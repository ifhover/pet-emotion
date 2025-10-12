import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transporter } from 'nodemailer';
import nodemailer from 'nodemailer';
import { EmailSendDto } from './dto/email-send.dto';
import { BusinessError } from '../../common/exception/business-exception';

@Injectable()
export class EmailService {
  private readonly transporter: Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: this.configService.get('SMTP_PORT'),
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'),
      },
    });
  }

  public async send(dto: EmailSendDto) {
    try {
      await this.transporter.sendMail({
        from: this.configService.get('SMTP_USER'),
        to: dto.to,
        subject: dto.subject,
        html: dto.text,
      });
    } catch (error) {
      throw new BusinessError('邮件发送失败');
    }
  }
}
