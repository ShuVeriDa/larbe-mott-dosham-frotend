export const WordOfDaySkeleton = () => {
	return (
		<section className="px-6 pb-16 w-full">
			<div className="max-w-[600px] mx-auto">
				<div className="relative bg-raised border border-edge rounded-xl p-8 overflow-hidden animate-pulse">
					{/* Label */}
					<div className="h-3 w-24 bg-edge rounded mb-5" />
					{/* Word + tags */}
					<div className="flex items-baseline gap-3 flex-wrap mb-2">
						<div className="h-10 w-32 bg-edge rounded" />
						<div className="flex gap-2">
							<div className="h-5 w-7 bg-edge rounded-xs" />
							<div className="h-5 w-10 bg-edge rounded-xs" />
							<div className="h-5 w-10 bg-edge rounded-xs" />
						</div>
					</div>
					{/* Definition */}
					<div className="h-4 w-48 bg-edge rounded mb-5 mt-2" />
					{/* Example block */}
					<div className="bg-surface border-l-2 border-edge rounded-r-md px-5 py-4 mb-6 space-y-2">
						<div className="h-4 w-56 bg-edge rounded" />
						<div className="h-4 w-40 bg-edge rounded" />
					</div>
					{/* Buttons */}
					<div className="flex gap-3">
						<div className="h-8 w-36 bg-edge rounded-md" />
						<div className="h-8 w-28 bg-edge rounded-md" />
					</div>
				</div>
			</div>
		</section>
	);
};
