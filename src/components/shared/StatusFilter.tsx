import type { StatusFilterProps } from "../../types";

export const StatusFilter = ({statusFilter, setStatusFilter, setPage}: StatusFilterProps) => {
	return (
		<select
			value={statusFilter}
			onChange={(e) => {
				setStatusFilter(e.target.value as typeof statusFilter);
				setPage(1);
			}}
			className="border border-gray-300 rounded px-3 py-2 text-sm"
		>
			<option value="all">All statuses</option>
			<option value="pending">Pending</option>
			<option value="approved">Approved</option>
			<option value="rejected">Rejected</option>
		</select>
	);
};
