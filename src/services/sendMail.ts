import dotenv from 'dotenv';
import sendGrid from '@sendgrid/mail';

dotenv.config();

const { API_KEY } = process.env;

sendGrid.setApiKey(API_KEY);

export const sendMMail = async (data: any, token: number) => {
  try {
    const { email } = data;
    const emailSend = {
      to: email,
      from: 'miha1488plet@gmail.com',
      subject: 'Email Verification',
      text: 'Hi! please confirm your email',
      html: `<h1>Hi! please confirm your email. 
      Please visit http://localhost:3004/confirm-email?token=${token}</h1>`,
    };

    const result = await sendGrid.send(emailSend);

    return {
      MailerResult: {
        data: emailSend,
        status: result[0].statusCode,
      },
    };
  } catch (error) {
    return { MailerError: { data: error.message, status: 500 } };
  }
};
