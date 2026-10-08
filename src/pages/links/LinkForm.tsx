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
		<form onSubmit={handleSubmit} className="space-y-5">
			<div>
				<label className="block text-sm font-semibold text-gray-700 mb-2">
					Program
				</label>
				<select
					value={form.program_id}
					onChange={(e) =>
						setForm({ ...form, program_id: parseInt(e.target.value) })
					}
					className="input cursor-pointer"
					required
				>
					{activePrograms.map((p) => (
						<option key={p.program_id} value={p.program_id}>
							{p.name} ({p.commission_rate}%)
						</option>
					))}
				</select>
				{activePrograms.length === 0 && (
					<p className="text-xs text-error-600 mt-2 font-medium">
						No active programs. Join an active program first.
					</p>
				)}
			</div>

			<div>
				<label className="block text-sm font-semibold text-gray-700 mb-2">
					Original URL
				</label>
				<input
					type="url"
					value={form.original_url}
					onChange={(e) => setForm({ ...form, original_url: e.target.value })}
					placeholder="https://example.com/products"
					className="input"
					required
				/>
			</div>

			<div className="flex justify-end gap-3 pt-4">
				<button
					type="button"
					onClick={onCancel}
					className="btn-secondary"
				>
					Cancel
				</button>
				<button
					type="submit"
					disabled={activePrograms.length === 0}
					className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
				>
					Create Link
				</button>
			</div>
		</form>
	);
};
