import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const {
  BOT_TOKEN, CHAT_ID,
} = process.env;

export const sendErrorToTelegram = async (error: Error): Promise<void> => {
  const url = encodeURI(
    `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${error}`,
  );

  await axios.get(url);
};
