import type { ProgramFormProps } from '../../types';


export const ProgramForm = ({
	form,
	onChange,
	onSubmit,
	onCancel,
	isEditing,
}: ProgramFormProps) => {
	return (
		<form onSubmit={onSubmit} className="space-y-5">
			<div>
				<label className="block text-sm font-semibold text-gray-700 mb-2">
					Name
				</label>
				<input
					type="text"
					value={form.name}
					onChange={(e) => onChange({ ...form, name: e.target.value })}
					className="input"
					placeholder="Program name"
					required
				/>
			</div>

			<div>
				<label className="block text-sm font-semibold text-gray-700 mb-2">
					Description
				</label>
				<textarea
					value={form.description ?? ''}
					onChange={(e) => onChange({ ...form, description: e.target.value })}
					className="input resize-none"
					rows={3}
					placeholder="Program description"
				/>
			</div>

			<div>
				<label className="block text-sm font-semibold text-gray-700 mb-2">
					Commission Rate (%)
				</label>
				<input
					type="number"
					min={0}
					max={100}
					step={0.01}
					value={form.commission_rate}
					onChange={(e) =>
						onChange({ ...form, commission_rate: parseFloat(e.target.value) })
					}
					className="input"
					placeholder="0.00"
					required
				/>
			</div>

			<div>
				<label className="block text-sm font-semibold text-gray-700 mb-2">
					Status
				</label>
				<select
					value={form.status}
					onChange={(e) =>
						onChange({
							...form,
							status: e.target.value as 'active' | 'inactive',
						})
					}
					className="input cursor-pointer"
				>
					<option value="active">Active</option>
					<option value="inactive">Inactive</option>
				</select>
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
					className="btn-primary"
				>
					{isEditing ? 'Save Changes' : 'Create'}
				</button>
			</div>
		</form>
	);
};
