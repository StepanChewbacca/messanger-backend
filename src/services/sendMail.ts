import dotenv from 'dotenv';
import sendGrid from '@sendgrid/mail';
import { routes } from '../constants/routes';
import { IError } from '../interface/error';
import { IMailer } from '../interface/mail.interface';

dotenv.config();

const { API_KEY, HOST, PORT } = process.env;

sendGrid.setApiKey(API_KEY);

export const sendMail = async (email: string, token: number): Promise<string> => {
  try {
    const linkInEmail = `http://${HOST}:${PORT}/${routes.USER}/${routes.CONFIRM_EMAIL}?token=${token}`;
    const emailSend = {
      to: email,
      from: 'miha1488plet@gmail.com',
      subject: 'Email Verification',
      text: 'Hi! please confirm your email',
      html: `<h1>Hi! please confirm your email. 
      Please visit ${linkInEmail}</h1>`,
    };

    await sendGrid.send(emailSend);

    return linkInEmail;
  } catch (error) {
    return null;
  }
};
