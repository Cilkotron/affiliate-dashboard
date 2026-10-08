import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
	getPrograms,
	createProgram,
	updateProgram,
	deleteProgram,
} from '../../api/programs';
import type { Program, AffiliateProgram } from '../../types';
import { programsStatusColors } from '../../assets/colors';
import { Modal } from '../../components/shared/Modal';
import { ProgramForm } from './ProgramForm';
import { TableSkeleton } from '../../components/shared/Skeleton';

const emptyForm = {
	name: '',
	description: '',
	commission_rate: 0,
	status: 'active' as 'active' | 'inactive',
};

import {
	joinProgram,
	leaveProgram,
	getMyPrograms,
} from '../../api/affiliatePrograms';

export const ProgramsPage = () => {
	const [programs, setPrograms] = useState<Program[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [showModal, setShowModal] = useState(false);
	const [editing, setEditing] = useState<Program | null>(null);
	const [form, setForm] = useState(emptyForm);
	const { user } = useAuth();
	const isAdmin = user?.role === 'admin';

	const visiblePrograms = isAdmin
		? programs
		: programs.filter((p) => p.status === 'active');

	const [myPrograms, setMyPrograms] = useState<AffiliateProgram[]>([]);

	const isJoined = (program_id: number) =>
		myPrograms.some((p) => p.program_id === program_id);

	const handleJoin = async (program_id: number) => {
		try {
			await joinProgram(program_id);
			const updated = await getMyPrograms();
			setMyPrograms(updated);
		} catch {
			setError('Failed to join program');
		}
	};

	const handleLeave = async (program_id: number) => {
		try {
			await leaveProgram(program_id);
			setMyPrograms((prev) => prev.filter((p) => p.program_id !== program_id));
		} catch {
			setError('Failed to leave program');
		}
	};

	const fetchPrograms = async () => {
		try {
			const data = await getPrograms();
			setPrograms(data);
		} catch {
			setError('Failed to load programs');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchPrograms();
		if (!isAdmin) {
			getMyPrograms().then(setMyPrograms);
		}
	}, [isAdmin]);

	const openCreate = () => {
		setEditing(null);
		setForm(emptyForm);
		setShowModal(true);
	};

	const openEdit = (program: Program) => {
		setEditing(program);
		setForm({
			name: program.name,
			description: program.description ?? '',
			commission_rate: program.commission_rate,
			status: program.status,
		});
		setShowModal(true);
	};

	const handleSubmit = async (e: React.SubmitEvent) => {
		e.preventDefault();
		try {
			if (editing) {
				const updated = await updateProgram(editing.id, {
					...form,
					version: editing.version,
				});
				setPrograms((prev) =>
					prev.map((p) => (p.id === updated.id ? updated : p)),
				);
			} else {
				const created = await createProgram(form);
				setPrograms((prev) => [created, ...prev]);
			}
			setShowModal(false);
		} catch {
			setError('Failed to save program');
		}
	};

	const handleDelete = async (id: number) => {
		if (!confirm('Are you sure you want to delete this program?')) return;
		try {
			await deleteProgram(id);
			setPrograms((prev) => prev.filter((p) => p.id !== id));
		} catch {
			setError('Failed to delete program');
		}
	};

	if (loading) return <TableSkeleton />;

	return (
		<div className="animate-fade-in">
			<div className="flex items-center justify-between mb-6">
				<div>
					<h1 className="text-3xl font-display font-bold text-gray-900">Programs</h1>
					<p className="text-gray-500 mt-1">Manage affiliate programs</p>
				</div>
				{isAdmin && (
					<button
						onClick={openCreate}
						className="btn-primary"
					>
						+ New Program
					</button>
				)}
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
							<th>Name</th>
							<th>Description</th>
							<th>Commission</th>
							{isAdmin && <th>Status</th>}
							<th>Created</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{visiblePrograms.map((program) => (
							<tr key={program.id}>
								<td className="font-semibold text-gray-900">
									{program.name}
								</td>
								<td className="text-gray-600 max-w-xs truncate">
									{program.description ?? (
										<span className="text-gray-400">—</span>
									)}
								</td>
								<td className="text-gray-900 font-semibold">
									{program.commission_rate}%
								</td>
								{isAdmin && (
									<td>
										<span className={`badge ${programsStatusColors[program.status]}`}>
											{program.status}
										</span>
									</td>
								)}
								<td className="text-gray-500">
									{new Date(program.created_at).toLocaleDateString()}
								</td>
								<td>
									{isAdmin ? (
										<div className="flex items-center gap-2">
											<button
												onClick={() => openEdit(program)}
												className="btn-xs btn-primary"
											>
												Edit
											</button>
											<button
												onClick={() => handleDelete(program.id)}
												className="btn-xs btn-danger"
											>
												Delete
											</button>
										</div>
									) : isJoined(program.id) ? (
										<button
											onClick={() => handleLeave(program.id)}
											className="btn-xs btn-danger"
										>
											Leave
										</button>
									) : (
										<button
											onClick={() => handleJoin(program.id)}
											className="btn-xs btn-success"
											disabled={program.status === 'inactive'}
										>
											Join
										</button>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>

				{programs.length === 0 && (
					<div className="text-center py-16">
						<svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
						</svg>
						<p className="text-gray-500 font-medium">No programs found</p>
						<p className="text-gray-400 text-sm mt-1">Create your first affiliate program</p>
					</div>
				)}
			</div>

			{/* Modal */}
			{showModal && (
				<Modal
					title={editing ? 'Edit Program' : 'New Program'}
					onClose={() => setShowModal(false)}
				>
					<ProgramForm
						form={form}
						onChange={setForm}
						onSubmit={handleSubmit}
						onCancel={() => setShowModal(false)}
						isEditing={!!editing}
					/>
				</Modal>
			)}
		</div>
	);
};
