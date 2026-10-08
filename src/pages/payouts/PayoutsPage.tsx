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
import { TableSkeleton } from '../../components/shared/Skeleton';

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

	if (loading) return <TableSkeleton />;

	return (
		<div className="animate-fade-in">
			<div className="flex items-center justify-between mb-6">
				<div>
					<h1 className="text-3xl font-display font-bold text-gray-900">Payouts</h1>
					<p className="text-gray-500 mt-1">Manage affiliate payouts</p>
				</div>

				<div className="flex items-center gap-3">
					{!isAdmin && (
						<button
							onClick={() => setShowModal(true)}
							disabled={available <= 0}
							className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
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
							<th>Status</th>
							{isAdmin && <th>Affiliate</th>}
							<th>Requested At</th>
							<th>Payment</th>
						</tr>
					</thead>
					<tbody>
						{payouts.map((payout) => (
							<tr key={payout.id}>
								<td className="font-semibold text-gray-900">
									${payout.amount}
								</td>
								<td>
									<span className={`badge ${payoutsStatusColors[payout.status]}`}>
										{payout.status}
									</span>
								</td>
								{isAdmin && (
									<td className="text-gray-900 font-medium">
										{payout.first_name} {payout.last_name}
									</td>
								)}
								<td className="text-gray-500">
									{new Date(payout.created_at).toLocaleDateString()}
								</td>
								<td>
									{payout.status === 'pending' ? (
										isAdmin ? (
											<button
												onClick={() => handleMarkPaid(payout.id)}
												className="btn-xs btn-success"
											>
												Mark As Paid
											</button>
										) : (
											<span className="text-gray-400">—</span>
										)
									) : (
										<div className="flex items-center gap-2">
											<span className="badge badge-neutral">
												Paid
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
					<div className="text-center py-16">
						<svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
						</svg>
						<p className="text-gray-500 font-medium">No payouts found</p>
						<p className="text-gray-400 text-sm mt-1">Payouts will appear here when requested</p>
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
					<div className="mb-4 p-4 bg-gradient-to-r from-info-50 to-info-100 border border-info-200 rounded-xl text-sm text-info-700">
						Available for payout:{' '}
						<span className="font-bold">${available.toFixed(2)}</span>
					</div>
					<form onSubmit={handleCreate} className="space-y-5">
						<div>
							<label className="block text-sm font-semibold text-gray-700 mb-2">
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
								className="input"
								required
							/>
						</div>
						<div className="flex justify-end gap-3 pt-4">
							<button
								type="button"
								onClick={() => setShowModal(false)}
								className="btn-secondary"
							>
								Cancel
							</button>
							<button
								type="submit"
								disabled={submitting}
								className="btn-primary disabled:opacity-50"
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
