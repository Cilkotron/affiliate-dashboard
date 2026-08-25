import type { StatusFilterProps } from '../../types';

export const StatusFilter = <T extends string>({
	statuses,
	statusFilter,
	setStatusFilter,
	setPage,
}: StatusFilterProps<T>) => {
	return (
		<select
			value={statusFilter}
			onChange={(e) => {
				setStatusFilter(e.target.value as T);
				setPage(1);
			}}
			className="border border-gray-300 rounded px-3 py-2 text-sm cursor-pointer"
		>
			<option value="all">All statuses</option>
			{statuses.map((status) => (
				<option key={status} value={status}>
					{status.charAt(0).toUpperCase() + status.slice(1)}
				</option>
			))}
		</select>
	);
};
