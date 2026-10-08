import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/auth/LoginPage';
import { Layout } from './components/layout/Layout';
import { AffiliatesPage } from './pages/affiliates/AffiliatesPage';
import { ProgramsPage } from './pages/programs/ProgramsPage';
import { LinksPage } from './pages/links/LinksPage';
import { ClicksPage } from './pages/clicks/ClicksPage';
import { ConversionsPage  } from './pages/conversions/ConversionsPage';
import { PayoutsPage } from './pages/payouts/PayoutsPage';

function App() {
	return (
		<BrowserRouter>
			<AuthProvider>
				<Routes>
					<Route path="/login" element={<LoginPage />} />
					<Route
						path="/"
						element={
							<ProtectedRoute>
								<Layout />
							</ProtectedRoute>
						}
					>
						<Route
							index
							element={
								<div className="animate-fade-in">
									<div className="mb-6">
										<h1 className="text-3xl font-display font-bold text-gray-900">Dashboard</h1>
										<p className="text-gray-500 mt-1">Welcome to your affiliate dashboard</p>
									</div>
									<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
										<div className="card p-6 card-hover">
											<div className="flex items-center justify-between mb-4">
												<div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
													<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
													</svg>
												</div>
											</div>
											<h3 className="text-2xl font-bold text-gray-900">Affiliates</h3>
											<p className="text-gray-500 text-sm mt-1">Manage your partners</p>
										</div>
										<div className="card p-6 card-hover">
											<div className="flex items-center justify-between mb-4">
												<div className="w-12 h-12 bg-gradient-to-br from-success-500 to-success-600 rounded-xl flex items-center justify-center shadow-lg shadow-success-500/30">
													<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
													</svg>
												</div>
											</div>
											<h3 className="text-2xl font-bold text-gray-900">Conversions</h3>
											<p className="text-gray-500 text-sm mt-1">Track performance</p>
										</div>
										<div className="card p-6 card-hover">
											<div className="flex items-center justify-between mb-4">
												<div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center shadow-lg shadow-accent-500/30">
													<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
													</svg>
												</div>
											</div>
											<h3 className="text-2xl font-bold text-gray-900">Programs</h3>
											<p className="text-gray-500 text-sm mt-1">Manage campaigns</p>
										</div>
									</div>
								</div>
							}
						/>
						<Route path="affiliates" element={<AffiliatesPage />} />
						<Route path="programs" element={<ProgramsPage />} />
						<Route path="links" element={<LinksPage />} />
						<Route path="clicks" element={<ClicksPage />} />
						<Route path="conversions" element={<ConversionsPage />} />
						<Route path="payouts" element={<PayoutsPage />} />
					</Route>
					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			</AuthProvider>
		</BrowserRouter>
	);
}

export default App;
