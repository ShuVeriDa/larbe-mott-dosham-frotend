import type { AdminUserDetail } from "@/features/admin-users";
import type { Dictionary } from "@/i18n/dictionaries";
import { Button } from "@/shared/ui";
import type { FC } from "react";

interface DangerZoneCardProps {
	user: AdminUserDetail;
	dict: Dictionary["adminUserDetail"]["dangerZone"];
	isSelf: boolean;
	onBan: () => void;
	onUnban: () => void;
	onResetPassword: () => void;
	onDelete: () => void;
	isBlocking: boolean;
	isUnblocking: boolean;
	isResetting: boolean;
	isDeleting: boolean;
}

export const DangerZoneCard: FC<DangerZoneCardProps> = ({
	user,
	dict,
	isSelf,
	onBan,
	onUnban,
	onResetPassword,
	onDelete,
	isBlocking,
	isUnblocking,
	isResetting,
	isDeleting,
}) => {
	const isBlocked = user.status === "blocked";
	return (
		<section className="rounded-lg border border-red-500/15 bg-surface overflow-hidden mb-6">
			<div className="px-5 py-4 border-b border-red-500/15">
				<h2 className="text-sm font-semibold text-red-600 dark:text-red-400">
					⚠ {dict.title}
				</h2>
			</div>
			<div className="px-5 py-2">
				<DangerRow
					title={isBlocked ? dict.unblock.title : dict.block.title}
					desc={isBlocked ? dict.unblock.desc : dict.block.desc}
				>
					<Button
						type="button"
						variant={isBlocked ? "secondary" : "danger"}
						size="md"
						onClick={isBlocked ? onUnban : onBan}
						disabled={isBlocking || isUnblocking || isSelf}
					>
						{isBlocked
							? isUnblocking
								? dict.unblock.loading
								: `✓ ${dict.unblock.action}`
							: isBlocking
								? dict.block.loading
								: `🚫 ${dict.block.action}`}
					</Button>
				</DangerRow>

				<DangerRow title={dict.resetPassword.title} desc={dict.resetPassword.desc}>
					<Button
						type="button"
						variant="secondary"
						size="md"
						onClick={onResetPassword}
						disabled={isResetting}
					>
						{isResetting
							? dict.resetPassword.loading
							: `📧 ${dict.resetPassword.action}`}
					</Button>
				</DangerRow>

				<DangerRow title={dict.delete.title} desc={dict.delete.desc}>
					<Button
						type="button"
						variant="danger"
						size="md"
						className="!bg-red-500 !text-white hover:!brightness-110"
						onClick={onDelete}
						disabled={isDeleting || isSelf}
					>
						{isDeleting ? dict.delete.loading : `🗑 ${dict.delete.action}`}
					</Button>
				</DangerRow>
			</div>
		</section>
	);
};

interface DangerRowProps {
	title: string;
	desc: string;
	children: React.ReactNode;
}

const DangerRow: FC<DangerRowProps> = ({ title, desc, children }) => (
	<div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 py-4 border-b border-border last:border-b-0">
		<div className="flex-1 min-w-0">
			<div className="text-sm font-semibold text-foreground mb-0.5">
				{title}
			</div>
			<div className="text-xs text-muted-foreground">{desc}</div>
		</div>
		<div className="w-full sm:w-auto shrink-0">{children}</div>
	</div>
);
