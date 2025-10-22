import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { v7 } from 'uuid';
import { S3UploadDto } from './dto/s3-upload.dto';

@Injectable()
export class S3Service {
  private readonly s3: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3Client({
      endpoint: `https://${this.configService.get('S3_REGION')}.aliyuncs.com`,
      region: this.configService.get('S3_REGION'),
      credentials: {
        accessKeyId: this.configService.get('ALIYUN_ACCESS_KEY_ID')!,
        secretAccessKey: this.configService.get('ALIYUN_ACCESS_KEY_SCERT')!,
        sessionToken: this.configService.get('ALIYUN_SECURITY_TOKEN') || undefined,
      },
    });
  }

  public joinUrl(key: string) {
    return `${this.configService.get('S3_DOMAIN')}/${key}`;
  }

  public async upload(dto: S3UploadDto) {
    const key = `${this.configService.get('NODE_ENV')}/${v7()}.${dto.fileType}`;
    const command = new PutObjectCommand({
      Bucket: this.configService.get('S3_BUCKET'),
      Key: key,
      Body: dto.buffer,
      ContentType: dto.mimetype,
    });

    await this.s3.send(command);

    return { key, url: this.joinUrl(key) };
  }
}
