import { EmailSubjectEnum, EmailTextEnum } from '../enums/sendGrid.enums';

export type TEmail = {
    email: string,
    link?: string,
    text?: EmailTextEnum,
    subject?: EmailSubjectEnum
};
