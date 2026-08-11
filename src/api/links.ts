import api from './axios';
import type { Link, LinkResponse } from '../types';

export const getLinks = async (page = 1, limit = 10): Promise<LinkResponse> => {
	const params = new URLSearchParams({
		page: String(page),
		limit: String(limit),
	});
	const { data } = await api.get<LinkResponse>(`/links?${params}`);
	return data;
};

export const getMyLinks = async (
	page = 1,
	limit = 10,
): Promise<LinkResponse> => {
	const params = new URLSearchParams({
		page: String(page),
		limit: String(limit),
	});
	const { data } = await api.get<LinkResponse>(`/links/affiliate?${params}`);
	return data;
};

export const createLink = async (
	program_id: number,
	original_url: string,
): Promise<Link> => {
	const { data } = await api.post<Link>('/links', { program_id, original_url });
	return data;
};

export const deleteLink = async (id: number): Promise<void> => {
	await api.delete(`/links/${id}`);
};

export const deleteMyLink = async (id: number): Promise<void> => {
	await api.delete(`/links/affiliate/${id}`);
};
