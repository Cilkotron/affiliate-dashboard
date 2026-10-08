import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export const Navbar = () => {
	const { user, clearAuth } = useAuth();
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	// Close dropdown on outside click
	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				setOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	return (
		<header className="glass border-b border-gray-200/50 px-6 py-4 flex items-center justify-between shadow-sm">
			<div className="flex items-center gap-2">
				<div className="w-2 h-2 rounded-full bg-success-500 animate-pulse"></div>
				<span className="text-xs text-gray-500 font-medium">System Online</span>
			</div>

			<div className="relative" ref={ref}>
				<button
					onClick={() => setOpen((prev) => !prev)}
					className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all duration-200 transform hover:scale-105 active:scale-95"
				>
					{user?.email?.[0].toUpperCase()}
				</button>

				{open && (
					<div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 animate-scale-in">
						<div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-transparent">
							<p className="text-xs text-gray-500 font-medium mb-1">Signed in as</p>
							<p className="text-sm text-gray-900 font-semibold truncate">{user?.email.toLocaleLowerCase()}</p>
						</div>
						<div className="py-1">
							<button
								onClick={clearAuth}
								className="w-full text-left px-4 py-2.5 text-sm text-error-600 hover:bg-error-50 transition-colors duration-150 flex items-center gap-2"
							>
								<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
								</svg>
								Logout
							</button>
						</div>
					</div>
				)}
			</div>
		</header>
	);
};
