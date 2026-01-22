import { IContribution } from "./contribution.types";

export interface IDeceasedPerson {
    fullName: string;
    dateOfBirth: string;
    dateOfDeath: string;
    placeOfDeath: string;
    memorial: IMemorial;
}

export interface IQRCode {
    code: string;
    isActive: boolean;
    memorial: IMemorial;
}

export interface IMemorial {
    id: string
    title: string;
    isPublic: boolean;
    isConfirmed: boolean;
    memorialPurchaseId: string;
    summary: string;
    deceasedPerson: IDeceasedPerson;
    qrCode: IQRCode;
    contributions: IContribution[];
}