import type { RoleName, UserStatus } from "@/entities/user";

export type AdminUserRoleFilter = "" | RoleName;
export type AdminUserStatusFilter = "" | UserStatus;
export type AdminUserSortBy = "name" | "username" | "createdAt" | "lastLoggedIn";
export type AdminUserSortDir = "asc" | "desc";

export interface AdminUserListQuery {
	q?: string;
	role?: AdminUserRoleFilter;
	status?: AdminUserStatusFilter;
	page?: number;
	limit?: number;
	sortBy?: AdminUserSortBy;
	sortDir?: AdminUserSortDir;
}

export interface AdminUserRoleRef {
	role: { name: RoleName };
}

export interface AdminUserListItem {
	id: string;
	name: string;
	email: string;
	username: string;
	status: UserStatus;
	banReason: string | null;
	emailVerified: boolean;
	createdAt: string;
	lastLoggedIn: string | null;
	roles: AdminUserRoleRef[];
}

export interface AdminUserListResponse {
	data: AdminUserListItem[];
	total: number;
	page: number;
	limit: number;
	pages: number;
}

export interface AdminUsersStats {
	total: number;
	active: number;
	inactive: number;
	blocked: number;
	newThisMonth: number;
	byRole: Partial<Record<RoleName, number>>;
}

export interface UpdateAdminUserDto {
	name?: string;
	username?: string;
	email?: string;
	role?: RoleName;
	status?: UserStatus;
}

export interface BlockAdminUserDto {
	banReason?: string;
}

export interface AdminUserExportQuery {
	q?: string;
	role?: AdminUserRoleFilter;
	status?: AdminUserStatusFilter;
}

export interface AdminUserDetail extends AdminUserListItem {
	lastSessionIp: string | null;
	lastSessionUserAgent: string | null;
}

export interface AdminUserDetailedStats {
	favoritesCount: number;
	suggestionsTotal: number;
	suggestionsApproved: number;
	entriesEdited: number;
	searchCount: number;
	activeDaysStreak: number;
}

export type AdminUserActivityType =
	| "login"
	| "edit"
	| "favorite"
	| "suggestion"
	| "ban";

export interface AdminUserActivityMeta {
	ip?: string;
	ua?: string;
	entryId?: number;
	word?: string;
	action?: string;
	suggestionId?: string;
	status?: string;
}

export interface AdminUserActivityItem {
	type: AdminUserActivityType;
	at: string;
	meta: AdminUserActivityMeta;
}

export interface AdminUserActivityQuery {
	limit?: number;
	offset?: number;
}

export interface AdminUserActivityResponse {
	data: AdminUserActivityItem[];
	total: number;
}

export interface AdminUserSessionItem {
	id: string;
	userAgent: string | null;
	ipAddress: string | null;
	createdAt: string;
	lastActiveAt: string;
	isCurrent: boolean;
}

export interface AdminUserDeleteResponse {
	deleted: boolean;
}

export interface AdminUserResetPasswordResponse {
	message: string;
}

export interface AdminUserRevokeAllResponse {
	count: number;
}
