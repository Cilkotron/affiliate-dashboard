import api from './axios';
import type { Payout, PayoutResponse, PayoutStatusFilter } from '../types';

export const getPayouts = async (
	page = 1,
	limit = 10,
    status?: PayoutStatusFilter
): Promise<PayoutResponse> => {
	const params = new URLSearchParams({
		page: String(page),
		limit: String(limit),
	});
    if (status && status !== 'all') params.append('status', status);
	const { data } = await api.get<PayoutResponse>(`/payouts?${params}`);
	return data;
};

export const getMyPayouts = async (
	page = 1,
	limit = 10,
    status?: PayoutStatusFilter
): Promise<PayoutResponse> => {
	const params = new URLSearchParams({
		page: String(page),
		limit: String(limit),
	});
    if (status && status !== 'all') params.append('status', status);
	const { data } = await api.get<PayoutResponse>(
		`/payouts/affiliate?${params}`,
	);
	return data;
};

export const createPayout = async (
	amount: number,
	affiliate_id?: number,
): Promise<Payout> => {
	const { data } = await api.post<Payout>('/payouts', { amount, affiliate_id });
	return data;
};

export const updatePayoutStatus = async (id: number): Promise<Payout> => {
	const { data } = await api.put<Payout>(`/payouts/${id}/status`, {
		status: 'paid',
	});
	return data;
};

export const getAvailableCommissions = async (): Promise<{ available: number }> => {
    const { data } = await api.get<{ available: number }>('/payouts/available');
    return data;
};
