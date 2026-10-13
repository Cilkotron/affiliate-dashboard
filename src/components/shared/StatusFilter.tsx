import type { StatusFilterProps } from '../../types';

export const StatusFilter = <T extends string>({
	statuses,
	statusFilter,
	setStatusFilter,
	setPage,
}: StatusFilterProps<T>) => {
	return (
		<div className="relative">
			<select
				value={statusFilter}
				onChange={(e) => {
					setStatusFilter(e.target.value as T);
					setPage(1);
				}}
				className="status-filter"
			>
				<option value="all">All statuses</option>
				{statuses.map((status) => (
					<option key={status} value={status}>
						{status.charAt(0).toUpperCase() + status.slice(1)}
					</option>
				))}
			</select>
			<div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
				<svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
				</svg>
			</div>
		</div>
	);
};
