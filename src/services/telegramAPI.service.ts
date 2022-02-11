import axios from 'axios';
import { ConfigService } from '../config/config';

export const sendErrorToTelegram = async (error: Error): Promise<void> => {
  const url = encodeURI(
    `https://api.telegram.org/bot${ConfigService.getCustomKey('BOT_TOKEN')}
    /sendMessage?chat_id=${ConfigService.getCustomKey('CHAT_ID')}&text=${error}`,
  );

  await axios.get(url);
};
