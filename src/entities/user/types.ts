// ---------------------------------------------------------------------------
// Roles & Permissions
// ---------------------------------------------------------------------------

export type RoleName = "USER" | "EDITOR" | "ADMIN";

export type Permission =
  | "CAN_EDIT_ENTRIES"
  | "CAN_ADD_ENTRIES"
  | "CAN_DELETE_ENTRIES"
  | "CAN_MANAGE_USERS"
  | "CAN_MANAGE_API_KEYS"
  | "CAN_RUN_PIPELINE";

import type { WordLevel } from "@/shared/types";

export type { WordLevel };

export type UserStatus = "active" | "inactive" | "blocked";
export type Theme = "light" | "dark" | "system";
export type Language = "ru" | "ce" | "en";
export type PerPage = 10 | 20 | 50;

// ---------------------------------------------------------------------------
// User model
// ---------------------------------------------------------------------------

export interface UserRole {
  role: {
    id: string;
    name: RoleName;
  };
}

export interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  avatarUrl?: string;
  phone?: string;
  phoneVerified: boolean;
  status: UserStatus;
  banReason?: string;
  emailVerified: boolean;
  emailVerifiedAt?: string;
  lastLoggedIn?: string;
  roles: UserRole[];
  isAdmin: boolean;
  // Preferences
  prefSaveHistory: boolean;
  prefShowExamples: boolean;
  prefCompactView: boolean;
  prefTheme: Theme;
  prefLanguage: Language;
  prefHotkeys: boolean;
  prefShowGrammar: boolean;
  prefPerPage: PerPage;
  prefDefaultCefr?: WordLevel;
  prefPublicProfile: boolean;
  prefPublicFavorites: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserSession {
  id: string;
  userId: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  lastActiveAt: string;
  revokedAt?: string;
  isCurrent?: boolean;
}

export interface UserStats {
  favoritesCount: number;
  searchCount: number;
  suggestionsCount: number;
}

// ---------------------------------------------------------------------------
// Request DTOs
// ---------------------------------------------------------------------------

export interface UpdateProfileDto {
  name?: string;
  username?: string;
  email?: string;
}

export interface UpdatePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface UpdatePreferencesDto {
  prefSaveHistory?: boolean;
  prefShowExamples?: boolean;
  prefCompactView?: boolean;
  prefTheme?: Theme;
  prefLanguage?: Language;
  prefHotkeys?: boolean;
  prefShowGrammar?: boolean;
  prefPerPage?: PerPage;
  prefDefaultCefr?: WordLevel;
  prefPublicProfile?: boolean;
  prefPublicFavorites?: boolean;
}

export interface DeleteAccountDto {
  confirmation: "delete";
}
