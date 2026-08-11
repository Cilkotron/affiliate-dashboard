import type { ProgramFormProps } from '../../types';


export const ProgramForm = ({
	form,
	onChange,
	onSubmit,
	onCancel,
	isEditing,
}: ProgramFormProps) => {
	return (
		<form onSubmit={onSubmit} className="space-y-4">
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">
					Name
				</label>
				<input
					type="text"
					value={form.name}
					onChange={(e) => onChange({ ...form, name: e.target.value })}
					className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
					required
				/>
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">
					Description
				</label>
				<textarea
					value={form.description ?? ''}
					onChange={(e) => onChange({ ...form, description: e.target.value })}
					className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
					rows={3}
				/>
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">
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
					className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
					required
				/>
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">
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
					className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
				>
					<option value="active">Active</option>
					<option value="inactive">Inactive</option>
				</select>
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
					className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
				>
					{isEditing ? 'Save Changes' : 'Create'}
				</button>
			</div>
		</form>
	);
};
