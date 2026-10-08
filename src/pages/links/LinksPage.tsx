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
import { TableSkeleton } from '../../components/shared/Skeleton';

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

	if (loading) return <TableSkeleton />;

	return (
		<div className="animate-fade-in">
			<div className="flex items-center justify-between mb-6">
				<div>
					<h1 className="text-3xl font-display font-bold text-gray-900">Links</h1>
					<p className="text-gray-500 mt-1">Manage affiliate tracking links</p>
				</div>
				{!isAdmin && (
					<button
						onClick={() => setShowModal(true)}
						className="btn-primary"
					>
						+ New Link
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
							<th>Slug</th>
							<th>Original URL</th>
							{isAdmin && <th>Affiliate</th>}
							<th>Program</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>
						{links.map((link) => (
							<tr key={link.id}>
								<td className="font-semibold text-gray-900">
									{link.slug}
								</td>
								<td className="text-gray-600 max-w-xs truncate">
									{link.original_url}
								</td>
								{isAdmin && (
									<td className="text-gray-900 font-medium">
										{link.affiliate_first_name} {link.affiliate_last_name}
									</td>
								)}
								<td className="text-gray-600">{link.program}</td>
								<td>
									<button
										onClick={() => handleDelete(link.id)}
										className="btn-xs btn-danger"
									>
										Delete
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>

				{links.length === 0 && (
					<div className="text-center py-16">
						<svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
						</svg>
						<p className="text-gray-500 font-medium">No links found</p>
						<p className="text-gray-400 text-sm mt-1">Create your first tracking link</p>
					</div>
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
