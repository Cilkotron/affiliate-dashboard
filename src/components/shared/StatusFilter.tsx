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
				className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 cursor-pointer hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 shadow-sm"
			>
				<option value="all">All statuses</option>
				{statuses.map((status) => (
					<option key={status} value={status}>
						{status.charAt(0).toUpperCase() + status.slice(1)}
					</option>
				))}
			</select>
			<div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
				<svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
				</svg>
			</div>
		</div>
	);
};
