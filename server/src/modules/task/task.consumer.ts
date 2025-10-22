import { Inject, Injectable, MessageEvent } from '@nestjs/common';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { ConfigService } from '@nestjs/config';
import { TaskJobDto } from './dto/task-job.dto';
import { TaskStatus } from '@/common/type/dict';
import { Subject } from 'rxjs';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources';
import { TaskService } from './task.service';

@Processor('task')
@Injectable()
export class TaskConsumer extends WorkerHost {
  private qwen: OpenAI;
  private readonly sseMap: Map<string, Subject<MessageEvent>> = new Map();

  constructor(
    private readonly configService: ConfigService,
    private readonly taskService: TaskService,
  ) {
    super();
    (async () => {
      this.qwen = new OpenAI({
        baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
        apiKey: this.configService.get('QWEN_API_KEY'),
      });
    })();
  }

  async process(job: Job<TaskJobDto>) {
    if (job.name === 'pet-task') {
      const res = await fetch(job.data.url);
      const blob = await res.blob();
      const base64 = Buffer.from(await blob.arrayBuffer()).toString('base64');
      const mimeType = blob.type;
      if (!base64 || !mimeType) return;
      try {
        const messages: ChatCompletionMessageParam[] = [
          {
            role: 'system',
            content: [
              {
                type: 'text',
                text: '请只返回 JSON 数据，不要包含任何额外的文字描述或解释',
              },
            ],
          },
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: {
                  url: `data:${mimeType};base64,${base64}`,
                },
              },
              {
                type: 'text',
                text: `
请检测图像中所有宠物(仅限猫、狗)
**格式：** [xmin, ymin, xmax, ymax]，归一化到 0-1000 范围
如没检测到宠物，则pets返回为空数组
**请使用以下 JSON 格式严格输出:**
\`\`\`json
{
  "pets": [
    {
      "bbox_2d": [0, 0, 0, 0],
    }
  ]
}
\`\`\`
`,
              },
            ],
          },
        ];
        const sendMessage = async (messages: ChatCompletionMessageParam[]) =>
          await this.qwen.chat.completions.create({
            model: 'qwen3-vl-235b-a22b-instruct',
            response_format: { type: 'json_object' },
            messages,
          });
        const response1 = await sendMessage(messages);
        let json;
        try {
          json = JSON.parse(response1.choices[0].message.content!);
        } catch (error) {
          json = { pets: [] };
        }

        if (json.pets.length === 0) {
          this.taskService.complete({
            id: job.data.id,
            result: response1.choices[0].message.content!,
            status: TaskStatus.Ok,
          });
          return;
        }

        const prompt = `
现在请根据这些坐标返回对应宠物的信息
你的任务是：
1.请检测图像中所有宠物
2. **评估并描述**每个宠物的状态。
3. **以 JSON 格式**返回结果。

**JSON格式和要求:**
* 根元素应是一个名为 "pets" 的 **JSON 数组**。
* 数组中的每个对象代表一个被识别的宠物，必须包含以下键：
* "bbox_2d" 表示当前宠物的坐标
* "position_desc" 表示宠物的位置描述用作在多个宠物中区分，例如："坐在沙发上", "趴在地板上", "照片左侧" 描述不要太死板。
* "breed" 尝试猜测宠物的品种，例如："巴哥犬", "金毛"，如无法分析直接返回种类 例如"狗"。
* "tags" 提供最多3个最能代表当前状态的标签,例如：["沉静", "开心"]。
* "emotion_condition" 分析其整体情绪状态，用一句自然语言描述，如“情绪愉悦，充满好奇心”。
* "emotion" 储存情绪状态信息的对象
  情绪等级和分数区间:
    - 极度愉悦/兴奋:+76 到 +100
    - 放松/平静:+25 到 +75
    - 中立/警觉:-24 到 +24
    - 紧张/焦虑:-25 到 -75
    - 恐惧/攻击:-76 到 -100
  子字段:
    - "score": 分数
    - "level": score对应的情绪等级
    - "desc": 专业解释打分的原因
    - "confidence": 置信度 (0~1)
    - "emoji": 情绪对应的emoji
* "BCS" 储存BCS评分法信息的对象,采用9分制,评估主要基于三个关键部位的观感:肋骨、腰部、腹部
  子字段:
    - "score": 分数(1-9)
    - "level": score对应的体型特征描述(简短)
    - "desc": 专业解释打分的原因
    - "confidence": 置信度 (0~1)
    - "emoji": BCS对应的emoji
* "comfort" 储存舒适度信息的对象,分数范围从0(不安)到100(极度舒适),适用于休息中的宠物评估其休息质量
  子字段:
    - "score": 分数
    - "level": score对应的舒适度描述(简短)
    - "desc": 专业解释打分的原因
    - "confidence": 置信度 (0~1)
    - "emoji": 舒适度对应的emoji
* "health" 整体健康状况:
    - "body_condition":体型与肌肉状况
    - "coat_condition":毛发与皮肤状况
    - "concerns":潜在健康关注点（若有）或建议
    - "score":整体健康评分(0-100)
* "summary":生成一段温馨、拟人化的总结语,尝试猜测宠物对主人的心情、情感 以及宠物在想什么？以自然语言描述, 可以使用emoji。

请根据上传的宠物图片，进行细致的情绪与健康状态分析，并严格按照以下 JSON 格式返回结果。不要添加任何解释、说明或额外文本，只返回 JSON 对象。

**示例输出格式 (请严格遵循此格式):**
\`\`\`json
{
  "pets": [
    {
      "bbox_2d": [0, 0, 0, 0],
      "position_desc": "",
      "breed": "",
      "tags": ["", ""]
      "emotion_condition": "",
      "emotion": {
        "score": 0,
        "level": "",
        "desc": "",
        "confidence": 0,
        "emoji": ""
      },
      "BCS": {
        "score": 0,
        "level": "",
        "desc": "",
        "confidence": 0,
        "emoji": ""
      },
      "comfort": {
        "score": 0,
        "level": "",
        "desc": "",
        "confidence": 0,
        "emoji": ""
      },
      "health": {
        "body_condition": "",
        "coat_condition": "",
        "concerns": "",
        "score": 0
      },
      "summary": ""
    }
  ]
}
  \`\`\``;
        const response2 = await sendMessage([
          ...messages,
          {
            role: 'assistant',
            content: [
              {
                type: 'text',
                text: response1.choices[0].message.content!,
              },
            ],
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt,
              },
            ],
          },
        ]);

        if (response2.choices[0].message.content) {
          await this.taskService.complete({
            id: job.data.id,
            result: response2.choices[0].message.content,
            status: TaskStatus.Ok,
          });
        } else {
          await this.taskService.complete({
            id: job.data.id,
            error_message: 'AI 返回了空结果',
            status: TaskStatus.Error,
          });
        }
      } catch (error) {
        console.error(error);
        await this.taskService.complete({
          id: job.data.id,
          error_message: error.message,
          status: TaskStatus.Error,
        });
      }
    }
  }

  @OnWorkerEvent('completed')
  public onCompleted(job: Job<TaskJobDto>) {
    const subject = this.sseMap.get(job.data.id);
    if (subject) {
      subject.next({ data: { id: job.data.id, type: 'completed' } });
      subject.complete();
      this.sseMap.delete(job.data.id);
    }
  }

  public sse(id: string) {
    if (this.sseMap.has(id)) {
      return this.sseMap.get(id)!;
    } else {
      const subject = new Subject<MessageEvent>();
      this.sseMap.set(id, subject);
      return subject;
    }
  }
}
