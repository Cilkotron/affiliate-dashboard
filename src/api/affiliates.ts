import api from './axios';
import type { Affiliate, AffiliatesResponse } from '../types';

export const getAffiliates = async (
	page = 1,
	limit = 10,
	status?: string,
): Promise<AffiliatesResponse> => {
	const params = new URLSearchParams({
		page: String(page),
		limit: String(limit),
	});

	if (status) {
		params.append('status', status);
	}

	const response = await api.get(`/affiliates?${params}`);

	return response.data;
};

export const getAffiliate = async (id: number): Promise<Affiliate> => {
	const { data } = await api.get<Affiliate>(`/affiliates/${id}`);
	return data;
};

export const createAffiliate = async (
	first_name: string,
	last_name: string,
	user_id: number,
): Promise<Affiliate> => {
	const { data } = await api.post<Affiliate>(`/affiliates`, {
		first_name,
		last_name,
		user_id,
	});
	return data;
};

export const updateAffiliateStatus = async (
	id: number,
	status: 'pending' | 'approved' | 'rejected',
	version: number,
): Promise<Affiliate> => {
	const { data } = await api.put<Affiliate>(`/affiliates/${id}`, {
		status,
		version,
	});
	return data;
};

export const deleteAffiliate = async (id: number): Promise<void> => {
	await api.delete(`/affiliates/${id}`);
};
