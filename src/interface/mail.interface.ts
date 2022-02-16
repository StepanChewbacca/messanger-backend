import { EmailSubjectEnum, EmailTextEnum } from '../enums/sendGrid.enums';

export interface ILinkForEmail {
    link: string;
}

export type TEmail = {
    email: string,
    link?: string,
    text?: EmailTextEnum,
    subject?: EmailSubjectEnum
};
