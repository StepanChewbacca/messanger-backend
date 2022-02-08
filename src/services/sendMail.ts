import dotenv from 'dotenv';
import sendGrid from '@sendgrid/mail';
import axios from 'axios';
import { routes } from '../constants/routes';
import { mailerText } from '../constants/mailer';

dotenv.config();

const {
  SG_API_KEY, HOST, PORT, EMAIL_FROM, BOT_TOKEN, CHAT_ID,
} = process.env;

sendGrid.setApiKey(SG_API_KEY);

export const sendMail = async (email: string, token: string, routeForMail: string): Promise<string> => {
  try {
    let textForMail;

    if (routeForMail === routes.CONFIRM_EMAIL) {
      textForMail = mailerText.SIGN_UP_TEXT;
    } else if (routeForMail === routes.FORGOT_PASSWORD) {
      textForMail = mailerText.FORGOT_PASSWORD_TEXT;
    }

    const linkInEmail = `http://${HOST}:${PORT}${routes.USER}${routeForMail}?token=${token}`;
    const emailSend = {
      to: 'qweqwe322322322@gmail.com',
      from: EMAIL_FROM,
      subject: 'Email Verification',
      text: textForMail,
      html: `<h1> ${textForMail} ${linkInEmail}</h1>`,
    };

    const sentEmail = await sendGrid.send(emailSend);

    if (sentEmail[0].statusCode === 202) {
      return linkInEmail;
    }

    return null;
  } catch (error) {
    console.error(error);
    const url = encodeURI(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${error}`,
    );

    await axios.get(url);

    return null;
  }
};
