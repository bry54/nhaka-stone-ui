import { UserModel } from "@/auth/lib/models";
import { IMemorial } from "./memorial.types";

export enum ContributionType {
    BIOGRAPHY = 'BIOGRAPHY',
    COMMENT = 'COMMENT',
    STORY = 'STORY',
    PRAYER = 'PRAYER',
    IMAGE = 'IMAGE',
    AUDIO = 'AUDIO',
    VIDEO = 'VIDEO',
}

export enum UserRoles {
    ADMIN = 'admin',
    CLIENT = 'client',
}

export interface IContribution {
    id: string;
    memorialId: string;
    type: ContributionType;
    textContent?: string;

    /**
     * For media contributions (image/audio/video)
     * Could be URL, S3 key, IPFS hash, etc.
     */
    mediaUrl?: string;
    contributorName?: string; // for anonymous contributors
    isHidden: boolean; // soft moderation
    createdAt: string;
    memorial: IMemorial;
    createdBy?: UserModel;
}

export interface ICreateContribution {
    memorialId: string;
    type: ContributionType;
    textContent?: string;
    mediaUrl?: string;
    contributorName?: string; // for anonymous contributors
}
