import api from './axios';
import type { AffiliateProgram } from '../types';

export const getMyPrograms = async (): Promise<AffiliateProgram[]> => {
    const { data } = await api.get<AffiliateProgram[]>('/affiliate-programs');
    return data;
};

export const joinProgram = async (program_id: number): Promise<void> => {
	await api.post(`/affiliate-programs/join/${program_id}`);
};

export const leaveProgram = async (program_id: number): Promise<void> => {
	await api.delete(`/affiliate-programs/leave/${program_id}`);
};
