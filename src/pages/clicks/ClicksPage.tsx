import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getClicks, getMyClicks } from '../../api/clicks';
import type { Click } from '../../types';
import { Pagination } from '../../components/shared/Pagination';
import { TableSkeleton } from '../../components/shared/Skeleton';

export const ClicksPage = () => {
	const [clicks, setClick] = useState<Click[]>([]);
	const [page, setPage] = useState(1);
	const [total, setTotal] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	const { user } = useAuth();
	const isAdmin = user?.role === 'admin';

	const fetchClicks = async (pageNumber = 1) => {
		setLoading(true);
		try {
			const response = isAdmin
				? await getClicks(pageNumber, 10)
				: await getMyClicks(pageNumber, 10);
			setClick(response.data);
			setPage(response.pagination.page);
			setTotalPages(response.pagination.totalPages);
			setTotal(response.pagination.total);
		} catch {
			setError('Failed to load links');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchClicks(page);
	}, [page]);

	if (loading) return <TableSkeleton />;

	return (
		<div className="animate-fade-in">
			<div className="flex items-center justify-between mb-6">
				<div>
					<h1 className="text-3xl font-display font-bold text-gray-900">Clicks</h1>
					<p className="text-gray-500 mt-1">Track link clicks</p>
				</div>
			</div>

			{error && (
				<div className="bg-gradient-to-r from-error-50 to-error-100 border border-error-200 text-error-700 p-4 rounded-xl mb-6 text-sm font-medium animate-slide-in">
					<div className="flex items-center gap-2">
						<svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
						{error}
					</div>
				</div>
			)}

			<div className="table-container">
				<table className="table">
					<thead>
						<tr>
							<th>Slug</th>
							<th>Original URL</th>
							<th>Program</th>
							{isAdmin && <th>Affiliate</th>}
							<th>Time</th>
						</tr>
					</thead>
					<tbody>
						{clicks.map((click) => (
							<tr key={click.id}>
								<td className="font-semibold text-gray-900">
									{click.slug}
								</td>
								<td className="text-gray-600 max-w-xs truncate">
									{click.original_url ? (
										<a
											href={click.original_url}
											target="_blank"
											rel="noreferrer"
											className="text-primary-600 hover:text-primary-700 font-medium hover:underline transition-colors"
										>
											{click.original_url}
										</a>
									) : (
										<span className="text-gray-400">—</span>
									)}
								</td>
								<td className="text-gray-600 max-w-xs truncate">
									{click.program_name}
								</td>
								{isAdmin && (
									<td className="text-gray-900 font-medium">
										{click.first_name} {click.last_name}
									</td>
								)}
								<td className="text-gray-500">
									{new Date(click.clicked_at).toLocaleDateString()}
								</td>
							</tr>
						))}
					</tbody>
				</table>

				{clicks.length === 0 && (
					<div className="text-center py-16">
						<svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
						</svg>
						<p className="text-gray-500 font-medium">No clicks found</p>
						<p className="text-gray-400 text-sm mt-1">Clicks will appear here when tracked</p>
					</div>
				)}
			</div>
			<Pagination
				page={page}
				totalPages={totalPages}
				onPageChange={setPage}
				totalItems={total}
				pageSize={clicks.length}
			/>
		</div>
	);
};
