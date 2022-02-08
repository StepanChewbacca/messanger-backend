import dotenv from 'dotenv';
import sendGrid from '@sendgrid/mail';
import axios from 'axios';
import { routes } from '../constants/routes';
import { EmailTextEnum, mailerRoutes } from '../constants/mailer';
import { sendErrorToTelegram } from './telegramAPI.service';

dotenv.config();

const {
  SG_API_KEY, HOST, PORT, EMAIL_FROM,
} = process.env;

sendGrid.setApiKey(SG_API_KEY);

type bla = {
  email: string, token: string, link?: string, text?: EmailTextEnum
};

export const sendMail = async ({
  email, token, link = '', text = EmailTextEnum.CONFIRM_EMAIL,
}: bla): Promise<string> => {
  try {
    const emailSend = {
      to: email,
      from: EMAIL_FROM,
      subject: 'Email Verification',
      text,
      html: `<h1> ${text} ${link}</h1>`,
    };

    const sentEmail = await sendGrid.send(emailSend);

    if (sentEmail[0].statusCode === 202) {
      return link;
    }

    return null;
  } catch (error) {
    console.error(error);
    await sendErrorToTelegram(error);

    return null;
  }
};
