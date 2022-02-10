import { EmailSubjectEnum, EmailTextEnum } from '../constants/mailer';

export interface ILinkInEmail {
    linkForEmail: string;
}

export type TEmail = {
    email: string,
    link?: string,
    text?: EmailTextEnum,
    subject?: EmailSubjectEnum
};
