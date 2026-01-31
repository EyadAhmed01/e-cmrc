import React, { useContext } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { UserContext } from '../../../Context/UserContext';

export default function AdminLayout() {
    const { user, setToken } = useContext(UserContext);
    const navigate = useNavigate();

    function handleLogout() {
        setToken(null);
        navigate('/login');
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#141420] to-[#1a1a2e]">
            {/* Sidebar */}
            <aside className="fixed top-0 left-0 z-40 w-64 h-screen glass-strong border-r border-white/10">
                <div className="h-full px-3 py-4 overflow-y-auto">
                    <div className="mb-8 p-4 border-b border-white/10">
                        <h2 className="text-2xl font-bold gradient-text">Admin Panel</h2>
                        {user && (
                            <p className="text-sm text-gray-400 mt-1">{user.name}</p>
                        )}
                    </div>
                    
                    <ul className="space-y-2">
                        <li>
                            <NavLink
                                to="/admin/dashboard"
                                className={({ isActive }) =>
                                    `flex items-center p-3 rounded-xl transition-smooth ${
                                        isActive
                                            ? 'bg-accent/20 text-accent font-semibold glow'
                                            : 'text-gray-300 hover:bg-white/10 hover:text-white'
                                    }`
                                }
                            >
                                <i className="fas fa-chart-line mr-3"></i>
                                Dashboard
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/admin/products"
                                className={({ isActive }) =>
                                    `flex items-center p-3 rounded-xl transition-smooth ${
                                        isActive
                                            ? 'bg-accent/20 text-accent font-semibold glow'
                                            : 'text-gray-300 hover:bg-white/10 hover:text-white'
                                    }`
                                }
                            >
                                <i className="fas fa-box mr-3"></i>
                                Products
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/admin/orders"
                                className={({ isActive }) =>
                                    `flex items-center p-3 rounded-xl transition-smooth ${
                                        isActive
                                            ? 'bg-accent/20 text-accent font-semibold glow'
                                            : 'text-gray-300 hover:bg-white/10 hover:text-white'
                                    }`
                                }
                            >
                                <i className="fas fa-shopping-cart mr-3"></i>
                                Orders
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/admin/users"
                                className={({ isActive }) =>
                                    `flex items-center p-3 rounded-xl transition-smooth ${
                                        isActive
                                            ? 'bg-accent/20 text-accent font-semibold glow'
                                            : 'text-gray-300 hover:bg-white/10 hover:text-white'
                                    }`
                                }
                            >
                                <i className="fas fa-users mr-3"></i>
                                Users
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/admin/brands"
                                className={({ isActive }) =>
                                    `flex items-center p-3 rounded-xl transition-smooth ${
                                        isActive
                                            ? 'bg-accent/20 text-accent font-semibold glow'
                                            : 'text-gray-300 hover:bg-white/10 hover:text-white'
                                    }`
                                }
                            >
                                <i className="fas fa-tags mr-3"></i>
                                Brands
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/admin/categories"
                                className={({ isActive }) =>
                                    `flex items-center p-3 rounded-xl transition-smooth ${
                                        isActive
                                            ? 'bg-accent/20 text-accent font-semibold glow'
                                            : 'text-gray-300 hover:bg-white/10 hover:text-white'
                                    }`
                                }
                            >
                                <i className="fas fa-list mr-3"></i>
                                Categories
                            </NavLink>
                        </li>
                        <li className="pt-4 border-t border-white/10">
                            <NavLink
                                to="/home"
                                className="flex items-center p-3 rounded-xl text-gray-300 hover:bg-white/10 hover:text-white transition-smooth"
                            >
                                <i className="fas fa-home mr-3"></i>
                                Back to Site
                            </NavLink>
                        </li>
                        <li>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center p-3 rounded-xl text-gray-300 hover:bg-red-500/20 hover:text-red-400 transition-smooth"
                            >
                                <i className="fas fa-sign-out-alt mr-3"></i>
                                Logout
                            </button>
                        </li>
                    </ul>
                </div>
            </aside>

            {/* Main Content */}
            <div className="ml-64">
                <div className="p-8">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
