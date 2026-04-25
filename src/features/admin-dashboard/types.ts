export interface AdminSidebarCounters {
	entries: number;
	suggestions: number;
	users: number;
}

export interface AdminDashboardStats {
	sidebar: AdminSidebarCounters;
}
