import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getClicks, getMyClicks } from '../../api/clicks';
import type { Click } from '../../types';
import { Pagination } from '../../components/shared/Pagination';

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

	if (loading) return <div className="text-gray-500">Loading...</div>;

	return (
		<div>
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold text-gray-800">Clicks</h1>
			</div>

			{error && (
				<div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">
					{error}
				</div>
			)}

			<div className="bg-white rounded-lg shadow overflow-hidden">
				<table className="w-full text-sm">
					<thead className="bg-gray-50 border-b border-gray-200">
						<tr>
							<th className="text-left px-6 py-3 text-gray-500 font-medium">
								Slug
							</th>
							<th className="text-left px-6 py-3 text-gray-500 font-medium">
								Original URL
							</th>
							<th className="text-left px-6 py-3 text-gray-500 font-medium">
								Program
							</th>
							{isAdmin && (
								<th className="text-left px-6 py-3 text-gray-500 font-medium">
									Affiliate
								</th>
							)}
							<th className="text-left px-6 py-3 text-gray-500 font-medium">
								Time
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-100">
						{clicks.map((click) => (
							<tr key={click.id} className="hover:bg-gray-50">
								<td className="px-6 py-4 font-medium text-gray-800">
									{click.slug}
								</td>
								<td className="px-6 py-4 text-gray-600 max-w-xs truncate">
									{click.original_url ? (
										<a
											href={click.original_url}
											target="_blank"
											rel="noreferrer"
											className="text-blue-600 hover:underline"
										>
											{click.original_url}
										</a>
									) : (
										<span className="text-gray-400">—</span>
									)}
								</td>
								<td className="px-6 py-4 text-gray-600 max-w-xs truncate">
									{click.program_name}
								</td>
								{isAdmin && (
									<td className="px-6 py-4 text-gray-800 font-medium">
										{click.first_name} {click.last_name}
									</td>
								)}
								<td className="px-6 py-4">
									{new Date(click.clicked_at).toLocaleDateString()}
								</td>
							</tr>
						))}
					</tbody>
				</table>

				{clicks.length === 0 && (
					<div className="text-center py-12 text-gray-400">No clicks found</div>
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
