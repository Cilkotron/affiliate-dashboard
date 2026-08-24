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
		<aside className="w-64 bg-gray-900 min-h-screen flex flex-col">
			<div className="p-6 border-b border-gray-700">
				<h1 className="text-white font-bold text-xl">
					{isAdmin ? 'Affiliate Admin' : 'Affiliate Dashboard'}
				</h1>
			</div>

			<nav className="flex-1 p-4 space-y-1">
				{links.map((link) => (
					<NavLink
						key={link.to}
						to={link.to}
						end={link.to === '/'}
						className={({ isActive }) =>
							`flex items-center gap-3 px-4 py-2.5 rounded text-sm transition-colors ${
								isActive
									? 'bg-blue-600 text-white'
									: 'text-gray-400 hover:bg-gray-800 hover:text-white'
							}`
						}
					>
						<span className="w-5 h-5">{link.icon}</span>
						<span>{link.label}</span>
					</NavLink>
				))}
			</nav>
		</aside>
	);
};
