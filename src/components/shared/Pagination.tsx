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
			{totalPages > 1 && (
				<div className="flex justify-center items-center gap-2 py-4">
					{totalPages > 5 && (
						<button
							onClick={() => onPageChange(page - 1)}
							disabled={page === 1}
							className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
						>
							Previous
						</button>
					)}

					{visiblePages.map((pageNumber) => (
						<button
							key={pageNumber}
							onClick={() => onPageChange(pageNumber)}
							className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
								page === pageNumber
									? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-500/25'
									: 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-sm'
							}`}
						>
							{pageNumber}
						</button>
					))}

					{totalPages > 5 && (
						<button
							onClick={() => onPageChange(page + 1)}
							disabled={page === totalPages}
							className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
						>
							Next
						</button>
					)}
				</div>
			)}

			<div className="flex justify-center pt-2">
				<span className="text-sm text-gray-500 font-medium">
					Showing {startItem}-{endItem} of {totalItems} items
				</span>
			</div>
		</>
	);
};
