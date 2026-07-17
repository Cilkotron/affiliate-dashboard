import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/auth/LoginPage';
import { Layout } from './components/layout/Layout';
import { AffiliatesPage  } from './pages/affiliates/AffiliatesPage';

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
                        <Route index element={<div className="text-gray-700">Dashboard coming soon...</div>} />
                        <Route path="affiliates" element={<div className="text-gray-700"><AffiliatesPage /></div>} />
                        <Route path="programs" element={<div className="text-gray-700">Programs coming soon...</div>} />
                        <Route path="links" element={<div className="text-gray-700">Links coming soon...</div>} />
                        <Route path="clicks" element={<div className="text-gray-700">Clicks coming soon...</div>} />
                        <Route path="conversions" element={<div className="text-gray-700">Conversions coming soon...</div>} />
                        <Route path="payouts" element={<div className="text-gray-700">Payouts coming soon...</div>} />
                    </Route>
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;