interface SkeletonProps {
	className?: string;
	variant?: 'text' | 'circular' | 'rectangular';
	width?: string;
	height?: string;
}

export const Skeleton = ({ className = '', variant = 'rectangular', width, height }: SkeletonProps) => {
	const baseClasses = 'skeleton';

	const variantClasses = {
		text: 'h-4 rounded',
		circular: 'rounded-full',
		rectangular: 'rounded-lg',
	};

	const style = {
		width: width || (variant === 'text' ? '100%' : undefined),
		height: height || (variant === 'text' ? '1rem' : undefined),
	};

	return (
		<div
			className={`${baseClasses} ${variantClasses[variant]} ${className}`}
			style={style}
		/>
	);
};

export const TableSkeleton = ({ rows = 5, columns = 6 }: { rows?: number; columns?: number }) => {
	return (
		<div className="table-container animate-fade-in">
			<div className="p-6 space-y-4">
				{Array.from({ length: rows }).map((_, rowIndex) => (
					<div key={rowIndex} className="flex items-center gap-4">
						{Array.from({ length: columns }).map((_, colIndex) => (
							<Skeleton
								key={colIndex}
								variant="text"
								className={colIndex === 0 ? 'w-32' : colIndex === columns - 1 ? 'w-24' : 'flex-1'}
							/>
						))}
					</div>
				))}
			</div>
		</div>
	);
};

export const CardSkeleton = () => {
	return (
		<div className="card p-6 animate-fade-in">
			<div className="space-y-4">
				<Skeleton variant="text" width="60%" height="2rem" />
				<Skeleton variant="text" width="40%" />
				<div className="space-y-2 pt-4">
					<Skeleton variant="text" />
					<Skeleton variant="text" />
					<Skeleton variant="text" width="80%" />
				</div>
			</div>
		</div>
	);
};
