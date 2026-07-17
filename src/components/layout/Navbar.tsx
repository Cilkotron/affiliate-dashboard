import { useAuth } from '../../context/AuthContext';

export const Navbar = () => {
    const { user } = useAuth();

    return (
        <header className="bg-white border-b border-gray-200 px-6 py-5.5 flex items-center justify-between">
            <div />
            <div className="flex items-center gap-3">
                <div className="text-sm text-gray-500">{user?.email}</div>
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {user?.email?.[0].toUpperCase()}
                </div>
            </div>
        </header>
    );
};