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
import { TableSkeleton } from '../../components/shared/Skeleton';

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

	if (loading) return <TableSkeleton />;

	return (
		<div className="animate-fade-in">
			<div className="flex items-center justify-between mb-6">
				<div>
					<h1 className="text-3xl font-display font-bold text-gray-900">Affiliates</h1>
					<p className="text-gray-500 mt-1">Manage your affiliate partners</p>
				</div>
				<div className="flex justify-end items-center">
					<StatusFilter<AffiliateStatusFilter>
						statuses={['pending', 'approved', 'rejected']}
						statusFilter={statusFilter}
						setStatusFilter={setStatusFilter}
						setPage={setPage}
					/>
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
							<th>Name</th>
							<th>Email</th>
							<th>Website</th>
							<th>Status</th>
							<th>Created</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{affiliates.map((affiliate) => (
							<tr key={affiliate.id}>
								<td className="font-semibold text-gray-900">
									{affiliate.first_name} {affiliate.last_name}
								</td>
								<td className="text-gray-600">{affiliate.email}</td>
								<td className="text-gray-600">
									{affiliate.website ? (
										<a
											href={affiliate.website}
											target="_blank"
											rel="noreferrer"
											className="text-primary-600 hover:text-primary-700 font-medium hover:underline transition-colors"
										>
											{affiliate.website}
										</a>
									) : (
										<span className="text-gray-400">—</span>
									)}
								</td>
								<td>
									<span className={`badge ${affiliatesStatusColors[affiliate.status]}`}>
										{affiliate.status}
									</span>
								</td>
								<td className="text-gray-500">
									{new Date(affiliate.created_at).toLocaleDateString()}
								</td>
								<td>
									<div className="flex items-center gap-2">
										{affiliate.status !== 'approved' && (
											<button
												onClick={() =>
													handleStatusUpdate(affiliate, 'approved')
												}
												className="btn-xs btn-success"
											>
												Approve
											</button>
										)}
										{affiliate.status !== 'rejected' && (
											<button
												onClick={() =>
													handleStatusUpdate(affiliate, 'rejected')
												}
												className="btn-xs btn-danger"
											>
												Reject
											</button>
										)}
										<button
											onClick={() => handleDelete(affiliate.id)}
											className="btn-xs btn-secondary"
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
					<div className="text-center py-16">
						<svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
						</svg>
						<p className="text-gray-500 font-medium">No affiliates found</p>
						<p className="text-gray-400 text-sm mt-1">Try adjusting your filter or add new affiliates</p>
					</div>
				)}
			</div>
			<Pagination
				page={page}
				totalPages={totalPages}
				onPageChange={setPage}
				totalItems={total}
				pageSize={affiliates.length}
			/>
		</div>
	);
};
