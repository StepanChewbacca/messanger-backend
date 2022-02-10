import dotenv from 'dotenv';
import sendGrid from '@sendgrid/mail';
import { EmailTextEnum, EmailSubjectEnum } from '../enums/sendGrid.enums';
import { sendErrorToTelegram } from './telegramAPI.service';
import { TEmail } from '../interface/mail.interface';

dotenv.config();

const {
  SG_API_KEY, EMAIL_FROM,
} = process.env;

sendGrid.setApiKey(SG_API_KEY);

export const sendMail = async ({
  email, link = '', text = EmailTextEnum.CONFIRM_EMAIL, subject = EmailSubjectEnum.CONFIRM_EMAIL,
}: TEmail): Promise<string> => {
  try {
    const emailSend = {
      to: email,
      from: EMAIL_FROM,
      subject,
      text,
      html: `<h1> ${text} ${link}</h1>`,
    };

    const sentEmail = await sendGrid.send(emailSend);

    if (sentEmail[0].statusCode === 202) {
      return link;
    }

    return null
  } catch (error) {
    console.error(error);
    await sendErrorToTelegram(error);

    return null;
  }
};
