import React from 'react';
import { Bell, Search } from 'lucide-react';

const Header = () => {
    return (
        <div className="flex justify-between items-center bg-white p-4 shadow-sm">
            <div className="flex items-center">
                <h2 className="text-xl font-semibold text-gray-800">Welcome,</h2>
            </div>

            <div className="flex items-center space-x-6">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search here"
                        className="pl-4 pr-10 py-2 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500 w-64"
                    />
                    <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
                </div>

                <button className="relative">
                    <Bell className="text-gray-600" size={24} />
                    <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>

                <div className="h-8 w-8 rounded-full bg-teal-500"></div>
            </div>
        </div>
    );
};

export default Header;
