import type { PaginationProps } from '../../types';

export const Pagination = ({
	totalPages,
	page,
	onPageChange,
	totalItems,
	pageSize,
}: PaginationProps) => {
	const startItem = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
	const endItem = Math.min(page * pageSize, totalItems);

	const getVisiblePages = () => {
		if (totalPages <= 5) {
			return Array.from({ length: totalPages }, (_, i) => i + 1);
		}

		const start = Math.max(1, page - 2);
		const end = Math.min(totalPages, page + 2);

		return Array.from({ length: end - start + 1 }, (_, i) => start + i);
	};

	const visiblePages = getVisiblePages();

	return (
		<>
			<div className="flex justify-center gap-2 py-2">
				{totalPages > 5 && (
					<button
						onClick={() => onPageChange(page - 1)}
						disabled={page === 1}
						className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
					>
						Previous
					</button>
				)}

				{visiblePages.map((pageNumber) => (
					<button
						key={pageNumber}
						onClick={() => onPageChange(pageNumber)}
						className={`px-3 py-1 rounded ${
							page === pageNumber ? 'bg-blue-600 text-white' : 'bg-gray-200'
						}`}
					>
						{pageNumber}
					</button>
				))}

				{totalPages > 5 && (
					<button
						onClick={() => onPageChange(page + 1)}
						disabled={page === totalPages}
						className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
					>
						Next
					</button>
				)}
			</div>

			<div className="flex justify-center pt-2">
				<span className="text-xs text-gray-400">
					Displaying {startItem}-{endItem} of total {totalItems}
				</span>
			</div>
		</>
	);
};
