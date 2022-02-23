import { EmailSubjectEnum, EmailTextEnum } from '../enums/mailer.enums';

export type TEmail = {
    email: string,
    link?: string,
    text?: EmailTextEnum,
    subject?: EmailSubjectEnum
};
