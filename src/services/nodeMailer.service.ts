import nodemailer from 'nodemailer';
import { EmailTextEnum, EmailSubjectEnum } from '../enums/sendGrid.enums';
import { sendErrorToTelegram } from './telegramAPI.service';
import { ILinkForEmail, TEmail } from '../interface/mail.interface';
import { ConfigService } from '../config/config';
import { IServiceResult } from '../interface/error';

export class NodeMailer {
  async sendMail({
    email, link = '', text = EmailTextEnum.CONFIRM_EMAIL, subject = EmailSubjectEnum.CONFIRM_EMAIL,
  }: TEmail): Promise<IServiceResult<string, Error>> {
    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.mail.ru',
        port: 465,
        secure: true,
        auth: {
          user: ConfigService.getCustomKey('NODE_MAILER_USER'),
          pass: ConfigService.getCustomKey('NODE_MAILER_PASSWORD'),
        },
      });

      await transporter.sendMail({
        to: email,
        from: ConfigService.getCustomKey('NODE_MAILER_USER'),
        subject,
        text,
        html: `<h1> ${text} ${link}</h1>`,
      });

      return { result: link };
    } catch (error) {
      console.log();
      await sendErrorToTelegram(error);

      return { error };
    }
  }
}

export const nodeMailer = new NodeMailer();
