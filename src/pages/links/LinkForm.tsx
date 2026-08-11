import { useState } from 'react';
import type { AffiliateProgram } from '../../types';

type CreateLinkFormData = {
	program_id: number;
	original_url: string;
};

interface CreateLinkFormProps {
	programs: AffiliateProgram[];
	onSubmit: (data: CreateLinkFormData) => void;
	onCancel: () => void;
}

export const LinkForm = ({
	programs,
	onSubmit,
	onCancel,
}: CreateLinkFormProps) => {
	const [form, setForm] = useState<CreateLinkFormData>({
		program_id: programs[0]?.program_id ?? 0,
		original_url: '',
	});

	const activePrograms = programs.filter((p) => p.status === 'active');

	const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault();
		onSubmit(form);
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">
					Program
				</label>
				<select
					value={form.program_id}
					onChange={(e) =>
						setForm({ ...form, program_id: parseInt(e.target.value) })
					}
					className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
					required
				>
					{activePrograms.map((p) => (
						<option key={p.program_id} value={p.program_id}>
							{p.name} ({p.commission_rate}%)
						</option>
					))}
				</select>
				{activePrograms.length === 0 && (
					<p className="text-xs text-red-500 mt-1">
						No active programs. Join an active program first.
					</p>
				)}
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">
					Original URL
				</label>
				<input
					type="url"
					value={form.original_url}
					onChange={(e) => setForm({ ...form, original_url: e.target.value })}
					placeholder="https://example.com/products"
					className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
					required
				/>
			</div>

			<div className="flex justify-end gap-2 pt-2">
				<button
					type="button"
					onClick={onCancel}
					className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
				>
					Cancel
				</button>
				<button
					type="submit"
					disabled={activePrograms.length === 0}
					className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
				>
					Create Link
				</button>
			</div>
		</form>
	);
};
