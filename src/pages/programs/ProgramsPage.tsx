import { useEffect, useState } from 'react';
import {
	getPrograms,
	createProgram,
	updateProgram,
	deleteProgram,
} from '../../api/programs';
import type { Program } from '../../types';
import { programsStatusColors } from '../../assets/colors';
import { Modal } from '../../components/shared/Modal';
import { ProgramForm } from '../../components/programs/ProgramForm';

const emptyForm = {
	name: '',
	description: '',
	commission_rate: 0,
	status: 'active' as 'active' | 'inactive',
};

export const ProgramsPage = () => {
	const [programs, setPrograms] = useState<Program[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [showModal, setShowModal] = useState(false);
	const [editing, setEditing] = useState<Program | null>(null);
	const [form, setForm] = useState(emptyForm);

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
	}, []);

	const openCreate = () => {
		setEditing(null);
		setForm(emptyForm);
		setShowModal(true);
	};

	const openEdit = (program: Program) => {
		setEditing(program);
		setForm({
			name: program.name,
			description: program.description ?? '', // undefined → ''
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

	if (loading) return <div className="text-gray-500">Loading...</div>;

	return (
		<div>
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold text-gray-800">Programs</h1>
				<button
					onClick={openCreate}
					className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700"
				>
					+ New Program
				</button>
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
								Name
							</th>
							<th className="text-left px-6 py-3 text-gray-500 font-medium">
								Description
							</th>
							<th className="text-left px-6 py-3 text-gray-500 font-medium">
								Commission
							</th>
							<th className="text-left px-6 py-3 text-gray-500 font-medium">
								Status
							</th>
							<th className="text-left px-6 py-3 text-gray-500 font-medium">
								Created
							</th>
							<th className="text-left px-6 py-3 text-gray-500 font-medium">
								Actions
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-100">
						{programs.map((program) => (
							<tr key={program.id} className="hover:bg-gray-50">
								<td className="px-6 py-4 font-medium text-gray-800">
									{program.name}
								</td>
								<td className="px-6 py-4 text-gray-600 max-w-xs truncate">
									{program.description ?? (
										<span className="text-gray-400">—</span>
									)}
								</td>
								<td className="px-6 py-4 text-gray-800 font-medium">
									{program.commission_rate}%
								</td>
								<td className="px-6 py-4">
									<span
										className={`px-2 py-1 rounded-full text-xs font-medium ${programsStatusColors[program.status]}`}
									>
										{program.status}
									</span>
								</td>
								<td className="px-6 py-4 text-gray-500">
									{new Date(program.created_at).toLocaleDateString()}
								</td>
								<td className="px-6 py-4">
									<div className="flex items-center gap-2">
										<button
											onClick={() => openEdit(program)}
											className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
										>
											Edit
										</button>
										<button
											onClick={() => handleDelete(program.id)}
											className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
										>
											Delete
										</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>

				{programs.length === 0 && (
					<div className="text-center py-12 text-gray-400">
						No programs found
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
