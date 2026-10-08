import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
	getConversions,
	getMyConversions,
	updateConversionStatus,
} from '../../api/conversions';
import type { Conversion, ConversionStatusFilter } from '../../types';
import { Pagination } from '../../components/shared/Pagination';
import { conversionsStatusColors } from '../../assets/colors';
import { StatusFilter } from '../../components/shared/StatusFilter';
import { TableSkeleton } from '../../components/shared/Skeleton';

export const ConversionsPage = () => {
	const [conversions, setClick] = useState<Conversion[]>([]);
	const [page, setPage] = useState(1);
	const [total, setTotal] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [statusFilter, setStatusFilter] =
		useState<ConversionStatusFilter>('all');

	const { user } = useAuth();
	const isAdmin = user?.role === 'admin';

	const fetchconversions = async (pageNumber = 1) => {
		setLoading(true);
		try {
			const response = isAdmin
				? await getConversions(
						pageNumber,
						10,
						statusFilter === 'all' ? undefined : statusFilter,
					)
				: await getMyConversions(pageNumber, 10, statusFilter === 'all' ? undefined : statusFilter);
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

	const handleStatusUpdate = async (
		id: number,
		status: 'pending' | 'approved' | 'paid',
	) => {
		try {
			const updated = await updateConversionStatus(id, status);
			setClick((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
		} catch {
			setError('Failed to update conversion status');
		}
	};

	useEffect(() => {
		fetchconversions(page);
	}, [page, statusFilter]);

	if (loading) return <TableSkeleton />;

	return (
		<div className="animate-fade-in">
			<div className="flex items-center justify-between mb-6">
				<div>
					<h1 className="text-3xl font-display font-bold text-gray-900">Conversions</h1>
					<p className="text-gray-500 mt-1">Track affiliate conversions</p>
				</div>
				<div className="flex justify-end items-center">
					<StatusFilter<ConversionStatusFilter>
						statuses={['pending', 'approved', 'paid']}
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
							<th>Amount</th>
							<th>Commission</th>
							<th>Status</th>
							{isAdmin && <th>Affiliate</th>}
							<th>Program</th>
							{isAdmin && <th>Actions</th>}
						</tr>
					</thead>
					<tbody>
						{conversions.map((conversion) => (
							<tr key={conversion.id}>
								<td className="font-semibold text-gray-900">
									{conversion.amount}
								</td>
								<td className="text-gray-600 max-w-xs truncate">
									{conversion.commission}
								</td>
								<td className="text-gray-600 max-w-xs truncate">
									<span className={`badge ${conversionsStatusColors[conversion.status]}`}>
										{conversion.status}
									</span>
								</td>
								{isAdmin && (
									<td className="text-gray-900 font-medium">
										{conversion.first_name} {conversion.last_name}
									</td>
								)}
								<td className="text-gray-600">{conversion.program_name}</td>

								{isAdmin && (
									<td>
										<div className="flex items-center gap-2">
											{conversion.status === 'pending' && (
												<button
													onClick={() =>
														handleStatusUpdate(conversion.id, 'approved')
													}
													className="btn-xs btn-success"
												>
													Approve
												</button>
											)}
											{conversion.status === 'approved' && (
												<button
													onClick={() =>
														handleStatusUpdate(conversion.id, 'paid')
													}
													className="btn-xs btn-primary"
												>
													Mark Paid
												</button>
											)}
											{conversion.status === 'paid' && (
												<span className="badge badge-neutral">Paid</span>
											)}
										</div>
									</td>
								)}
							</tr>
						))}
					</tbody>
				</table>

				{conversions.length === 0 && (
					<div className="text-center py-16">
						<svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
						<p className="text-gray-500 font-medium">No conversions found</p>
						<p className="text-gray-400 text-sm mt-1">Conversions will appear here when tracked</p>
					</div>
				)}
			</div>
			<Pagination
				page={page}
				totalPages={totalPages}
				onPageChange={setPage}
				totalItems={total}
				pageSize={conversions.length}
			/>
		</div>
	);
};
