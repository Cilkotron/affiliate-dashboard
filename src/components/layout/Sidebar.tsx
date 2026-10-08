import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
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

export const Sidebar = () => {
	const { user } = useAuth();
	const isAdmin = user?.role === 'admin';
	const links = isAdmin ? adminLinks : affiliateLinks;

	return (
		<aside className="w-64 bg-gradient-to-b from-gray-900 via-gray-900 to-primary-950 min-h-screen flex flex-col shadow-2xl">
			<div className="p-6 border-b border-gray-800/50">
				<h1 className="text-white font-display font-bold text-xl tracking-tight">
					{isAdmin ? 'Affiliate Admin' : 'Affiliate Dashboard'}
				</h1>
				<p className="text-gray-400 text-xs mt-1">Management Portal</p>
			</div>

			<nav className="flex-1 p-4 space-y-1 overflow-y-auto">
				{links.map((link) => (
					<NavLink
						key={link.to}
						to={link.to}
						end={link.to === '/'}
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

			<div className="p-4 border-t border-gray-800/50">
				<div className="bg-gradient-to-r from-primary-600/20 to-accent-600/20 rounded-lg p-4 border border-primary-500/20">
					<p className="text-xs text-gray-400 mb-2">Need help?</p>
					<p className="text-xs text-primary-300">Contact support</p>
				</div>
			</div>
		</aside>
	);
};
