import type { PaginationProps } from '../../types';

export const Pagination = ({
	totalPages,
	page,
	onPageChange,
    totalItems,
    items, 
}: PaginationProps) => {
	return (
        <>
		<div className="flex justify-center gap-2 py-2">
			{Array.from({ length: totalPages }, (_, i) => (
				<button
					key={i}
					onClick={() => onPageChange(i + 1)}
					className={`px-3 py-1 rounded ${
						page === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
					}`}
				>
					{i + 1}
				</button>
			))}
		</div>
        <div className="flex justify-center pt-2">
            <span className="text-xs text-gray-400">Displaying {items} of total {totalItems} </span>
        </div>
        </>
	);
};
