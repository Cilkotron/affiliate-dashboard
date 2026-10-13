import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { useState } from 'react';

export const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleMenuClick = () => {
        console.log('handleMenuClick called, current sidebarOpen:', sidebarOpen);
        setSidebarOpen(true);
    };

    console.log('Layout render, sidebarOpen:', sidebarOpen);

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-slate-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 overflow-hidden">
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            <div className="flex-1 flex flex-col lg:ml-0 transition-all duration-300 overflow-hidden">
                <Navbar onMenuClick={handleMenuClick} />
                <main className="flex-1 p-4 sm:p-6 lg:p-8 animate-fade-in main-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};