"use client";
import React from 'react';
import dynamic from 'next/dynamic';
import { Download } from 'lucide-react';
import api from '@/lib/api';

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

interface Stats {
    total_reports: number;
    pending_reports: number;
    highest_risk_region: string;
    completed_reports: number;
    today_reports: number;
    type_breakdown: { label: string; value: number; color: string }[];
}

export default function DashboardPage() {
    const [stats, setStats] = React.useState<Stats | null>(null);
    const [incidents, setIncidents] = React.useState<any[]>([]);

    React.useEffect(() => {
        // Fetch Stats
        api.get('/stats/').then((res: { data: Stats }) => setStats(res.data)).catch(console.error);
        // Fetch Incidents
        api.get('/incidents/').then((res: { data: any[] }) => setIncidents(res.data)).catch(console.error);
    }, []);

    const stat = stats || { total_reports: 0, pending_reports: 0, highest_risk_region: 'N/A' };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Todays Statistics</h1>
                    <p className="text-sm text-gray-600">Tue, 14 Nov, 2025, 11:30 AM</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Left Column - Stats */}
                <div className="md:col-span-1 space-y-6">
                    {/* New Reports */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-gray-700 font-semibold">New reports</h3>
                            <span className="bg-teal-50 text-teal-700 text-xs px-2 py-1 rounded font-medium">Today</span>
                        </div>
                        <div className="flex items-end justify-between">
                            <div>
                                <span className="text-4xl font-bold text-gray-900">{stat.total_reports}</span>
                                <p className="text-sm text-gray-500 mt-1">Total received so far</p>
                            </div>
                            <span className="text-teal-600 text-sm font-medium">↑ Live</span>
                        </div>
                    </div>

                    {/* Highest Risk Region */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-gray-700 font-semibold">Highest Risk Region</h3>
                            <span className="bg-teal-50 text-teal-700 text-xs px-2 py-1 rounded font-medium">Today</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">{stat.highest_risk_region}</h2>
                        <p className="text-sm text-gray-500">Based on report frequency</p>
                    </div>

                    {/* Pending Reports */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-gray-700 font-semibold">Pending Action</h3>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-3xl font-bold text-yellow-600">{stat.pending_reports}</span>
                            <span className="text-sm text-gray-600">incident(s) waiting</span>
                        </div>
                    </div>
                </div>

                {/* Right Column - Map & Table */}
                <div className="md:col-span-3 space-y-6">
                    {/* Map Section */}
                    <div className="bg-white p-2 rounded-xl shadow-sm h-80 overflow-hidden relative border border-gray-100">
                        <div className="absolute top-4 left-4 z-[400] bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-medium shadow-sm text-gray-700 pointer-events-none">
                            Live Incident Map
                        </div>
                        <Map incidents={incidents} />
                    </div>

                    {/* Report Summary Table */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-gray-800">Recent Reports</h3>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-600 uppercase bg-gray-50/50">
                                    <tr>
                                        <th className="px-4 py-3 font-semibold">ID</th>
                                        <th className="px-4 py-3 font-semibold">Title</th>
                                        <th className="px-4 py-3 font-semibold text-center">Status</th>
                                        <th className="px-4 py-3 font-semibold text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {incidents.slice(0, 5).map((inc) => (
                                        <tr key={inc.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-4 py-4 text-gray-500">#{inc.id}</td>
                                            <td className="px-4 py-4 font-medium text-gray-900">{inc.title}</td>
                                            <td className="px-4 py-4 text-center">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                    ${inc.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                                        inc.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                                                    {inc.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-right">
                                                <button className="text-teal-600 hover:text-teal-700 font-medium text-xs">View Details</button>
                                            </td>
                                        </tr>
                                    ))}
                                    {incidents.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                                                No reports found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
