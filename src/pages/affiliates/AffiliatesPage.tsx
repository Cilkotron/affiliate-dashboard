import { useEffect, useState } from 'react';
import {
	getAffiliates,
	updateAffiliateStatus,
	deleteAffiliate,
} from '../../api/affiliates';
import type { Affiliate, AffiliateStatusFilter } from '../../types';
import { affiliatesStatusColors } from '../../assets/colors';
import { Pagination } from '../../components/shared/Pagination';
import { StatusFilter } from '../../components/shared/StatusFilter';

export const AffiliatesPage = () => {
	const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
	const [page, setPage] = useState(1);
	const [total, setTotal] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [statusFilter, setStatusFilter] =
		useState<AffiliateStatusFilter>('all');

	const fetchAffiliates = async (pageNumber = 1) => {
		setLoading(true);

		try {
			const response = await getAffiliates(
				pageNumber,
				10,
				statusFilter === 'all' ? undefined : statusFilter,
			);

			setAffiliates(response.data);
			setPage(response.pagination.page);
			setTotalPages(response.pagination.totalPages);
			setTotal(response.pagination.total);
		} catch {
			setError('Failed to load affiliates');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchAffiliates(page);
	}, [page, statusFilter]);

	const handleStatusUpdate = async (
		affiliate: Affiliate,
		status: 'pending' | 'approved' | 'rejected',
	) => {
		try {
			const updated = await updateAffiliateStatus(
				affiliate.id,
				status,
				affiliate.version,
			);
			setAffiliates((prev) =>
				prev.map((a) => (a.id === updated.id ? updated : a)),
			);
		} catch {
			setError('Failed to update status');
		}
	};

	const handleDelete = async (id: number) => {
		if (!confirm('Are you sure you want to delete this affiliate?')) return;
		try {
			await deleteAffiliate(id);
			setAffiliates((prev) => prev.filter((a) => a.id !== id));
		} catch {
			setError('Failed to delete affiliate');
		}
	};

	if (loading) return <div className="text-gray-500">Loading...</div>;

	return (
		<div>
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold text-gray-800">Affiliates</h1>
				<div className="flex justify-end items-center">
					<StatusFilter
						statusFilter={statusFilter}
						setStatusFilter={setStatusFilter}
						setPage={setPage}
					/>
				</div>
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
								Name
							</th>
							<th className="text-left px-6 py-3 text-gray-500 font-medium">
								Email
							</th>
							<th className="text-left px-6 py-3 text-gray-500 font-medium">
								Website
							</th>
							<th className="text-left px-6 py-3 text-gray-500 font-medium">
								Status
							</th>
							<th className="text-left px-6 py-3 text-gray-500 font-medium">
								Created
							</th>
							<th className="text-left px-6 py-3 text-gray-500 font-medium">
								Actions
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-100">
						{affiliates.map((affiliate) => (
							<tr key={affiliate.id} className="hover:bg-gray-50">
								<td className="px-6 py-4 font-medium text-gray-800">
									{affiliate.first_name} {affiliate.last_name}
								</td>
								<td className="px-6 py-4 text-gray-600">{affiliate.email}</td>
								<td className="px-6 py-4 text-gray-600">
									{affiliate.website ? (
										<a
											href={affiliate.website}
											target="_blank"
											rel="noreferrer"
											className="text-blue-600 hover:underline"
										>
											{affiliate.website}
										</a>
									) : (
										<span className="text-gray-400">—</span>
									)}
								</td>
								<td className="px-6 py-4">
									<span
										className={`px-2 py-1 rounded-full text-xs font-medium ${affiliatesStatusColors[affiliate.status]}`}
									>
										{affiliate.status}
									</span>
								</td>
								<td className="px-6 py-4 text-gray-500">
									{new Date(affiliate.created_at).toLocaleDateString()}
								</td>
								<td className="px-6 py-4">
									<div className="flex items-center gap-2">
										{affiliate.status !== 'approved' && (
											<button
												onClick={() =>
													handleStatusUpdate(affiliate, 'approved')
												}
												className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
											>
												Approve
											</button>
										)}
										{affiliate.status !== 'rejected' && (
											<button
												onClick={() =>
													handleStatusUpdate(affiliate, 'rejected')
												}
												className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
											>
												Reject
											</button>
										)}
										<button
											onClick={() => handleDelete(affiliate.id)}
											className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
										>
											Delete
										</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>

				{affiliates.length === 0 && (
					<div className="text-center py-12 text-gray-400">
						No affiliates found
					</div>
				)}
			</div>
			<Pagination
				page={page}
				totalPages={totalPages}
				onPageChange={setPage}
				totalItems={total}
				items={affiliates.length}
			/>
		</div>
	);
};
