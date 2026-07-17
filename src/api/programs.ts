import api from './axios';
import type { Program } from '../types';

export const getPrograms = async (): Promise<Program[]> => {
	const { data } = await api.get<Program[]>('/programs');
	return data;
};

export const createProgram = async (
	program: Omit<Program, 'id' | 'created_at' | 'version'>,
): Promise<Program> => {
	const { data } = await api.post<Program>('/programs', program);
	return data;
};

export const updateProgram = async (
	id: number,
	program: Omit<Program, 'id' | 'created_at'>,
): Promise<Program> => {
	const { data } = await api.put<Program>(`/programs/${id}`, program);
	return data;
};

export const deleteProgram = async (id: number): Promise<void> => {
	await api.delete(`/programs/${id}`);
};
