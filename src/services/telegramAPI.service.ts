import axios from 'axios';
import { ConfigService } from '../config/config';

export const sendErrorToTelegram = async (error: Error): Promise<void> => {
  const url = encodeURI(
    `${ConfigService.getCustomKey('BOT_LINK')}${error}`,
  );

  await axios.get(url);
};
