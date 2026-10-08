import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

export const Layout = () => {
    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-slate-100">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Navbar />
                <main className="flex-1 p-6 lg:p-8 animate-fade-in">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};