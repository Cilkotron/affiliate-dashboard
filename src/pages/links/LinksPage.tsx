import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
	getLinks,
	getMyLinks,
	deleteLink,
	deleteMyLink,
	createLink,
} from '../../api/links';
import { getMyPrograms } from '../../api/affiliatePrograms';
import type { Link, AffiliateProgram } from '../../types';
import { Pagination } from '../../components/shared/Pagination';
import { Modal } from '../../components/shared/Modal';
import { LinkForm } from '../links/LinkForm';

export const LinksPage = () => {
	const [links, setLinks] = useState<Link[]>([]);
	const [page, setPage] = useState(1);
	const [total, setTotal] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [showModal, setShowModal] = useState(false);
	const [myPrograms, setMyPrograms] = useState<AffiliateProgram[]>([]);
	const [programsLoading, setProgramsLoading] = useState(false);

	const { user } = useAuth();
	const isAdmin = user?.role === 'admin';

	const fetchLinks = async (pageNumber = 1) => {
		setLoading(true);
		try {
			const response = isAdmin
				? await getLinks(pageNumber, 10)
				: await getMyLinks(pageNumber, 10);
			setLinks(response.data);
			setPage(response.pagination.page);
			setTotalPages(response.pagination.totalPages);
			setTotal(response.pagination.total);
		} catch {
			setError('Failed to load links');
		} finally {
			setLoading(false);
		}
	};
	const handleCreate = async (data: {
		program_id: number;
		original_url: string;
	}) => {
		try {
			const newLink = await createLink(data.program_id, data.original_url);
			setLinks((prev) => [newLink, ...prev]);
			setShowModal(false);
			await fetchLinks(page);
		} catch {
			setError('Failed to create link');
		}
	};

	const handleDelete = async (id: number) => {
		if (!confirm('Are you sure?')) return;
		try {
			isAdmin ? await deleteLink(id) : await deleteMyLink(id);
			setLinks((prev) => prev.filter((l) => l.id !== id));
		} catch {
			setError('Failed to delete link');
		}
	};

	useEffect(() => {
		fetchLinks(page);
		if (!isAdmin) {
			setProgramsLoading(true);
			getMyPrograms()
				.then(setMyPrograms)
				.catch(() => setError('Failed to load programs'))
				.finally(() => setProgramsLoading(false));
		}
	}, [page, isAdmin]);

	if (loading) return <div className="text-gray-500">Loading...</div>;

	return (
		<div>
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold text-gray-800">Links</h1>
				{!isAdmin && (
					<button
						onClick={() => setShowModal(true)}
						className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700"
					>
						+ New Link
					</button>
				)}
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
								Slug
							</th>
							<th className="text-left px-6 py-3 text-gray-500 font-medium">
								Original URL
							</th>
							{isAdmin && (
								<th className="text-left px-6 py-3 text-gray-500 font-medium">
									Affiliate
								</th>
							)}
							<th className="text-left px-6 py-3 text-gray-500 font-medium">
								Program
							</th>
							<th className="text-left px-6 py-3 text-gray-500 font-medium">
								Action
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-100">
						{links.map((link) => (
							<tr key={link.id} className="hover:bg-gray-50">
								<td className="px-6 py-4 font-medium text-gray-800">
									{link.slug}
								</td>
								<td className="px-6 py-4 text-gray-600 max-w-xs truncate">
									{link.original_url}
								</td>
								{isAdmin && (
									<td className="px-6 py-4 text-gray-800 font-medium">
										{link.affiliate_first_name} {link.affiliate_last_name}
									</td>
								)}
								<td className="px-6 py-4">{link.program}</td>
								<td className="px-6 py-4">
									<button
										onClick={() => handleDelete(link.id)}
										className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
									>
										Delete
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>

				{links.length === 0 && (
					<div className="text-center py-12 text-gray-400">No links found</div>
				)}
			</div>
			<Pagination
				page={page}
				totalPages={totalPages}
				onPageChange={setPage}
				totalItems={total}
				pageSize={links.length}
			/>

			{/* modal */}
			{showModal && (
				<Modal title="Create Link" onClose={() => setShowModal(false)}>
					{programsLoading ? (
						<div className="text-gray-500 text-sm">Loading programs...</div>
					) : (
						<LinkForm
							programs={myPrograms}
							onSubmit={handleCreate}
							onCancel={() => setShowModal(false)}
						/>
					)}
				</Modal>
			)}
		</div>
	);
};
