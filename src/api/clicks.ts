import api from './axios';
import type { ClickResponse } from '../types';

export const getClicks = async (
	page = 1,
	limit = 10,
): Promise<ClickResponse> => {
	const params = new URLSearchParams({
		page: String(page),
		limit: String(limit),
	});
	const { data } = await api.get<ClickResponse>(`/clicks?${params}`);
	return data;
};

export const getMyClicks = async (
	page = 1,
	limit = 10,
): Promise<ClickResponse> => {
	const params = new URLSearchParams({
		page: String(page),
		limit: String(limit),
	});
	const { data } = await api.get<ClickResponse>(`/clicks/affiliate?${params}`);
	return data;
};
