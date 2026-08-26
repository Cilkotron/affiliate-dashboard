import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
	getPayouts,
	getMyPayouts,
	createPayout,
	updatePayoutStatus,
	getAvailableCommissions,
} from '../../api/payouts';
import type { Payout, PayoutStatusFilter } from '../../types';
import { Pagination } from '../../components/shared/Pagination';
import { Modal } from '../../components/shared/Modal';
import { StatusFilter } from '../../components/shared/StatusFilter';
import { payoutsStatusColors } from '../../assets/colors';

export const PayoutsPage = () => {
	const [payouts, setPayouts] = useState<Payout[]>([]);
	const [page, setPage] = useState(1);
	const [total, setTotal] = useState(0);
	const [totalPages, setTotalPages] = useState(1);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [showModal, setShowModal] = useState(false);
	const [amount, setAmount] = useState('');
	const [submitting, setSubmitting] = useState(false);
	const [statusFilter, setStatusFilter] = useState<PayoutStatusFilter>('all');
	const [available, setAvailable] = useState<number>(0);

	const { user } = useAuth();
	const isAdmin = user?.role === 'admin';

	const fetchPayouts = async (pageNumber = 1) => {
		setLoading(true);
		try {
			const response = isAdmin
				? await getPayouts(pageNumber, 10, statusFilter)
				: await getMyPayouts(pageNumber, 10, statusFilter);
			setPayouts(response.data);
			setPage(response.pagination.page);
			setTotalPages(response.pagination.totalPages);
			setTotal(response.pagination.total);
		} catch {
			setError('Failed to load payouts');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchPayouts(page);
		if (!isAdmin) {
			getAvailableCommissions().then((res) => setAvailable(res.available));
		}
	}, [page, isAdmin, statusFilter]);

	const handleCreate = async (e: React.SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault();
		setSubmitting(true);
		try {
			await createPayout(parseFloat(amount));
			setShowModal(false);
			setAmount('');
			await fetchPayouts(page);
			if (!isAdmin) {
				getAvailableCommissions().then((res) => setAvailable(res.available));
			}
		} catch (err: unknown) {
			const message =
				err instanceof Error ? err.message : 'Failed to create payout';
			setError(message);
		} finally {
			setSubmitting(false);
		}
	};

	const handleMarkPaid = async (id: number) => {
		try {
			const updated = await updatePayoutStatus(id);
			setPayouts((prev) =>
				prev.map((p) => (p.id === updated.id ? updated : p)),
			);
		} catch {
			setError('Failed to update payout status');
		}
	};

	if (loading) return <div className="text-gray-500">Loading...</div>;

	return (
		<div>
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold text-gray-800">Payouts</h1>

				<div className="flex items-center gap-2">
					{!isAdmin && (
						<button
							onClick={() => setShowModal(true)}
							disabled={available <= 0}
							className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							+ Request Payout
						</button>
					)}
					<StatusFilter<PayoutStatusFilter>
						statuses={['pending', 'paid']}
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
								Status
							</th>
							{isAdmin && (
								<th className="text-left px-6 py-3 text-gray-500 font-medium">
									Affiliate
								</th>
							)}
							<th className="text-left px-6 py-3 text-gray-500 font-medium">
								Requested At
							</th>
							<th className="text-left px-6 py-3 text-gray-500 font-medium">
								Payment
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-100">
						{payouts.map((payout) => (
							<tr key={payout.id} className="hover:bg-gray-50">
								<td className="px-6 py-4 font-medium text-gray-800">
									${payout.amount}
								</td>
								<td className="px-6 py-4">
									<span
										className={`px-2 py-1 rounded-full text-xs font-medium ${payoutsStatusColors[payout.status]}`}
									>
										{payout.status}
									</span>
								</td>
								{isAdmin && (
									<td className="px-6 py-4 text-gray-800">
										{payout.first_name} {payout.last_name}
									</td>
								)}
								<td className="px-6 py-4 text-gray-500">
									{new Date(payout.created_at).toLocaleDateString()}
								</td>
								<td className="px-6 py-4">
									{payout.status === 'pending' ? (
										isAdmin ? (
											<button
												onClick={() => handleMarkPaid(payout.id)}
												className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 cursor-pointer"
											>
												Mark As Paid
											</button>
										) : (
											<span className="text-gray-500">-</span>
										)
									) : (
										<div className="flex items-center gap-2">
											<span className="text-xs text-gray-600 bg-gray-200 px-2 py-0.5 rounded-md">
												Paid{' '}
											</span>
											{payout.paid_at && (
												<span className="text-sm text-gray-400">
													{new Date(payout.paid_at).toLocaleDateString()}
												</span>
											)}
										</div>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>

				{payouts.length === 0 && (
					<div className="text-center py-12 text-gray-400">
						No payouts found
					</div>
				)}
			</div>

			<Pagination
				page={page}
				totalPages={totalPages}
				onPageChange={setPage}
				totalItems={total}
				pageSize={payouts.length}
			/>

			{showModal && (
				<Modal title="Request Payout" onClose={() => setShowModal(false)}>
					<div className="mb-4 p-3 bg-blue-50 rounded text-sm text-blue-700">
						Available for payout:{' '}
						<span className="font-semibold">${available.toFixed(2)}</span>
					</div>
					<form onSubmit={handleCreate} className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Amount
							</label>
							<input
								type="number"
								min={0.01}
								max={available}
								step={0.01}
								value={amount}
								onChange={(e) => setAmount(e.target.value)}
								placeholder="0.00"
								className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
								required
							/>
						</div>
						<div className="flex justify-end gap-2 pt-2">
							<button
								type="button"
								onClick={() => setShowModal(false)}
								className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
							>
								Cancel
							</button>
							<button
								type="submit"
								disabled={submitting}
								className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
							>
								{submitting ? 'Requesting...' : 'Request Payout'}
							</button>
						</div>
					</form>
				</Modal>
			)}
		</div>
	);
};
