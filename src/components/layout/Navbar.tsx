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
		<header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-end">
			<div className="relative" ref={ref}>
				<button
					onClick={() => setOpen((prev) => !prev)}
					className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium hover:bg-blue-700"
				>
					{user?.email?.[0].toUpperCase()}
				</button>

				{open && (
					<div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
						<div className="px-4 py-2 border-b border-gray-100">
							<p className="text-xs text-gray-500 truncate">{user?.email.toLocaleLowerCase()}</p>
						</div>
						<button
							onClick={clearAuth}
							className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
						>
							Logout
						</button>
					</div>
				)}
			</div>
		</header>
	);
};
