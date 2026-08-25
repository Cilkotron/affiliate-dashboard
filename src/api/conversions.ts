import api from './axios';
import type {
	Conversion,
	ConversionResponse,
	ConversionStatusFilter,
} from '../types';

export const getConversions = async (
	page = 1,
	limit = 10,
	status?: ConversionStatusFilter,
): Promise<ConversionResponse> => {
	const params = new URLSearchParams({
		page: String(page),
		limit: String(limit),
	});

	if (status && status !== 'all') {
		params.append('status', status);
	}
	const { data } = await api.get<ConversionResponse>(`/conversions?${params}`);
	return data;
};

export const getMyConversions = async (
	page = 1,
	limit = 10,
	status?: ConversionStatusFilter,
): Promise<ConversionResponse> => {
	const params = new URLSearchParams({
		page: String(page),
		limit: String(limit),
	});
	if (status && status !== 'all') {
		params.append('status', status);
	}
	const { data } = await api.get<ConversionResponse>(
		`/conversions/affiliate?${params}`,
	);
	return data;
};

export const createConversion = async (
	click_id: number,
	amount: number,
): Promise<Conversion> => {
	const { data } = await api.post<Conversion>('/conversions', {
		click_id,
		amount,
	});
	return data;
};

export const updateConversionStatus = async (
	id: number,
	status: 'pending' | 'approved' | 'paid',
): Promise<Conversion> => {
	const { data } = await api.put<Conversion>(`/conversions/${id}/status`, {
		status,
	});
	return data;
};
