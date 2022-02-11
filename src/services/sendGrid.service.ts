import sendGrid from '@sendgrid/mail';
import { EmailTextEnum, EmailSubjectEnum } from '../enums/sendGrid.enums';
import { sendErrorToTelegram } from './telegramAPI.service';
import { ILinkForEmail, TEmail } from '../interface/mail.interface';
import { ConfigService } from '../config/config';
import { IServiceResult } from '../interface/error';

export class SendGridMailer {
  public API_KEY: string;

  constructor(API_KEY: string) {
    this.API_KEY = API_KEY;
    sendGrid.setApiKey(this.API_KEY);
  }

  async sendMail({
    email, link = '', text = EmailTextEnum.CONFIRM_EMAIL, subject = EmailSubjectEnum.CONFIRM_EMAIL,
  }: TEmail): Promise<IServiceResult<ILinkForEmail, Error>> {
    try {
      const emailSend = {
        to: email,
        from: ConfigService.getCustomKey('EMAIL_FROM'),
        subject,
        text,
        html: `<h1> ${text} ${link}</h1>`,
      };

      const sentEmail = await sendGrid.send(emailSend);

      if (sentEmail[0].statusCode === 202) {
        return { result: { link } };
      }

      return null;
    } catch (error) {
      console.error(error);
      await sendErrorToTelegram(error);

      return { error };
    }
  }
}

export const sendGridMailer = new SendGridMailer(ConfigService.getCustomKey('SG_API_KEY'));
