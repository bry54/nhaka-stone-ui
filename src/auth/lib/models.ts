import { UserRoles } from "@/types/contribution.types";

// Define UUID type for consistent usage
export type UUID = string;

// Language code type for user preferences
export type LanguageCode = 'en' | 'de' | 'es' | 'fr' | 'ja' | 'zh';

// Auth model representing the authentication session
export interface AuthModel {
  accessToken: string;
  refresh_token?: string;
}

// User model representing the user profile
export interface UserModel {
  id?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  role?: UserRoles;
  allowAccess?: boolean;
  avatar?: string;
}
