import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';
import {
	DashboardIcon,
	AffiliatesIcon,
	ProgramsIcon,
	LinksIcon,
	ClicksIcon,
	ConversionsIcon,
	PayoutsIcon,
	//LogoutIcon,
} from '../../assets/icons';

const adminLinks = [
	{ to: '/', label: 'Dashboard', icon: <DashboardIcon /> },
	{ to: '/affiliates', label: 'Affiliates', icon: <AffiliatesIcon /> },
	{ to: '/programs', label: 'Programs', icon: <ProgramsIcon /> },
	{ to: '/links', label: 'Links', icon: <LinksIcon /> },
	{ to: '/clicks', label: 'Clicks', icon: <ClicksIcon /> },
	{ to: '/conversions', label: 'Conversions', icon: <ConversionsIcon /> },
	{ to: '/payouts', label: 'Payouts', icon: <PayoutsIcon /> },
];

const affiliateLinks = [
	{ to: '/', label: 'Dashboard', icon: <DashboardIcon /> },
	{ to: '/programs', label: 'Programs', icon: <ProgramsIcon /> },
	{ to: '/links', label: 'Links', icon: <LinksIcon /> },
	{ to: '/clicks', label: 'Clicks', icon: <ClicksIcon /> },
	{ to: '/conversions', label: 'Conversions', icon: <ConversionsIcon /> },
	{ to: '/payouts', label: 'Payouts', icon: <PayoutsIcon /> },
];

interface SidebarProps {
	isOpen: boolean;
	setIsOpen: (open: boolean) => void;
}

export const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
	const { user } = useAuth();
	const isAdmin = user?.role === 'admin';
	const links = isAdmin ? adminLinks : affiliateLinks;
	const location = useLocation();

	// Close sidebar on route change
	useEffect(() => {
		setIsOpen(false);
	}, [location.pathname, setIsOpen]);

	return (
		<>
			{/* Mobile overlay */}
			{isOpen && (
				<div
					className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
					onClick={() => setIsOpen(false)}
				/>
			)}

			{/* Sidebar */}
			<aside
				className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-gray-900 via-gray-900 to-primary-950 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 min-h-screen flex flex-col shadow-2xl border border-gray-800/50 transform transition-transform duration-300 ease-in-out ${
					isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
				}`}
			>
				<div className="p-4 sm:p-6 border-b border-gray-800/50 dark:border-slate-700 flex items-center justify-between">
					<div>
						<h1 className="text-white font-display font-bold text-lg sm:text-xl tracking-tight">
							{isAdmin ? 'Affiliate Admin' : 'Affiliate Dashboard'}
						</h1>
						<p className="text-gray-400 text-xs mt-1">Management Portal</p>
					</div>
					<button
						onClick={() => setIsOpen(false)}
						className="lg:hidden text-gray-400 hover:text-white transition-colors"
					>
						<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>

				<nav className="flex-1 p-4 space-y-1 overflow-y-auto">
					{links.map((link) => (
						<NavLink
							key={link.to}
							to={link.to}
							end={link.to === '/'}
							onClick={() => setIsOpen(false)}
							className={({ isActive }) =>
								`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group ${
									isActive
										? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-500/25'
										: 'text-gray-400 hover:bg-gray-800/50 hover:text-white hover:shadow-md'
								}`
							}
						>
							<span className="w-5 h-5 transition-transform duration-200 group-hover:scale-110">
								{link.icon}
							</span>
							<span className="transition-colors duration-200">{link.label}</span>
						</NavLink>
					))}
				</nav>

				{/* <div className="p-4 border-t border-gray-800/50 dark:border-slate-700">
					<div className="bg-gradient-to-r from-primary-600/20 to-accent-600/20 rounded-lg p-4 border border-primary-500/20">
						<p className="text-xs text-gray-400 mb-2">Need help?</p>
						<p className="text-xs text-primary-300">Contact support</p>
					</div>
				</div> */}
			</aside>
		</>
	);
};
