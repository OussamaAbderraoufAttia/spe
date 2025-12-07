"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Bell, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Sidebar = () => {
    const pathname = usePathname();
    const { logout } = useAuth();

    const navItems = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Admins', href: '/dashboard/admins', icon: Users },
        { name: 'Notifications', href: '/dashboard/notifications', icon: Bell },
        { name: 'Settings', href: '/dashboard/settings', icon: Settings },
    ];

    return (
        <div className="h-screen w-64 bg-sidebar text-white flex flex-col">
            <div className="p-6">
                <h1 className="text-2xl font-bold">leakcontrol</h1>
            </div>

            <div className="flex-1 px-4 py-4 space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-teal-500 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                }`}
                        >
                            <Icon size={20} />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </div>

            <div className="p-4 border-t border-gray-800">
                <div className="px-4 py-2">
                    <h3 className="text-xs text-gray-500 uppercase font-semibold mb-2">Report</h3>
                    <Link href="/dashboard/predictions" className="flex items-center space-x-3 text-gray-400 hover:text-white py-2">
                        <span>Predictions</span>
                    </Link>
                    <Link href="/dashboard/graphics" className="flex items-center space-x-3 text-gray-400 hover:text-white py-2">
                        <span>Graphics</span>
                    </Link>
                    <Link href="/dashboard/statistics" className="flex items-center space-x-3 text-gray-400 hover:text-white py-2">
                        <span>Statistics</span>
                    </Link>
                </div>

                <button
                    onClick={logout}
                    className="w-full flex items-center justify-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded mt-4"
                >
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
