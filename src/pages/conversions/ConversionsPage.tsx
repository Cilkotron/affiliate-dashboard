import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
	getConversions,
	getMyConversions,
	updateConversionStatus,
} from '../../api/conversions';
import type { Conversion, ConversionStatusFilter } from '../../types';
import { Pagination } from '../../components/shared/Pagination';
import { conversionsStatusColor } from '../../assets/colors';
import { StatusFilter } from '../../components/shared/StatusFilter';

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

	if (loading) return <div className="text-gray-500">Loading...</div>;

	return (
		<div>
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold text-gray-800">Conversions</h1>
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
				<div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">
					{error}
				</div>
			)}

			<div className="bg-white rounded-lg shadow overflow-hidden">
				<table className="w-full text-sm">
					<thead className="bg-gray-50 border-b border-gray-200">
						<tr>
							<th className="text-left px-6 py-3 text-gray-500 font-medium">
								Amount
							</th>
							<th className="text-left px-6 py-3 text-gray-500 font-medium">
								Commission
							</th>
							<th className="text-left px-6 py-3 text-gray-500 font-medium">
								Status
							</th>
							{isAdmin && (
								<th className="text-left px-6 py-3 text-gray-500 font-medium">
									Affiliate
								</th>
							)}
							<th className="text-left px-6 py-3 text-gray-500 font-medium">
								Program
							</th>
							{isAdmin && (
								<th className="text-left px-6 py-3 text-gray-500 font-medium">
									Actions
								</th>
							)}
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-100">
						{conversions.map((conversion) => (
							<tr key={conversion.id} className="hover:bg-gray-50">
								<td className="px-6 py-4 font-medium text-gray-800">
									{conversion.amount}
								</td>
								<td className="px-6 py-4 text-gray-600 max-w-xs truncate">
									{conversion.commission}
								</td>
								<td className="px-6 py-4 text-gray-600 max-w-xs truncate">
									<span
										className={`px-2 py-1 rounded-full text-xs font-medium ${conversionsStatusColor[conversion.status]}`}
									>
										{conversion.status}
									</span>
								</td>
								{isAdmin && (
									<td className="px-6 py-4 text-gray-800 font-medium">
										{conversion.first_name} {conversion.last_name}
									</td>
								)}
								<td className="px-6 py-4">{conversion.program_name}</td>

								{isAdmin && (
									<td className="px-6 py-4">
										<div className="flex items-center gap-2">
											{conversion.status === 'pending' && (
												<button
													onClick={() =>
														handleStatusUpdate(conversion.id, 'approved')
													}
													className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 cursor-pointer"
												>
													Approve
												</button>
											)}
											{conversion.status === 'approved' && (
												<button
													onClick={() =>
														handleStatusUpdate(conversion.id, 'paid')
													}
													className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 cursor-pointer"
												>
													Mark Paid
												</button>
											)}
											{conversion.status === 'paid' && (
												<span className="text-xs text-gray-400">Paid</span>
											)}
										</div>
									</td>
								)}
							</tr>
						))}
					</tbody>
				</table>

				{conversions.length === 0 && (
					<div className="text-center py-12 text-gray-400">
						No conversions found
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
