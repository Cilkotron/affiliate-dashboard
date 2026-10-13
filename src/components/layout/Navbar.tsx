import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export const Navbar = () => {
	const { user, clearAuth } = useAuth();
	const { theme, toggleTheme } = useTheme();
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
		<header className="glass border-b border-gray-200/50 dark:border-dark-border px-6 py-6 h-[98px] flex items-center justify-between shadow-sm">
			<div className="flex items-center gap-2">
				<div className="w-2 h-2 rounded-full bg-success-500 animate-pulse"></div>
				<span className="text-xs text-gray-500 dark:text-dark-text-secondary font-medium">System Online</span>
			</div>

			<div className="flex items-center gap-3">
				<button
					onClick={toggleTheme}
					className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-dark-bg-tertiary dark:to-dark-bg-secondary rounded-xl flex items-center justify-center text-gray-600 dark:text-dark-text shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105 active:scale-95"
					title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
				>
					{theme === 'light' ? (
						<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
						</svg>
					) : (
						<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
						</svg>
					)}
				</button>

				<div className="relative" ref={ref}>
				<button
					onClick={() => setOpen((prev) => !prev)}
					className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all duration-200 transform hover:scale-105 active:scale-95"
				>
					{user?.email?.[0].toUpperCase()}
				</button>

				{open && (
					<div className="absolute right-0 mt-3 w-56 bg-white dark:bg-dark-bg-secondary rounded-xl shadow-2xl border border-gray-100 dark:border-dark-border py-2 animate-scale-in">
						<div className="px-4 py-3 border-b border-gray-100 dark:border-dark-border bg-gradient-to-r from-gray-50 dark:from-dark-bg-tertiary to-transparent">
							<p className="text-xs text-gray-500 dark:text-dark-text-secondary font-medium mb-1">Signed in as</p>
							<p className="text-sm text-gray-900 dark:text-dark-text font-semibold truncate">{user?.email.toLocaleLowerCase()}</p>
						</div>
						<div className="py-1">
							<button
								onClick={clearAuth}
								className="w-full text-left px-4 py-2.5 text-sm text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/20 transition-colors duration-150 flex items-center gap-2"
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
			</div>
		</header>
	);
};
