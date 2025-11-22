// app/admin/users/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Search, Trash2, Eye, X } from 'lucide-react';
import UserDetailsModal from '@/components/UserDetailsModal';
import Navbar from "../navbar/page"

interface User {
    _id: string;
    name: string;
    userName: string;
    email: string;
    createdAt: string;
    placedOrders: any[];
}

export default function UsersManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

    useEffect(() => {
        fetchUsers();
    }, [currentPage, searchQuery]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/users?page=${currentPage}&limit=10&search=${searchQuery}`
            );
            const data = await response.json();
            setUsers(data.users);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (userId: string) => {
        if (!confirm('Are you sure you want to delete this user?')) return;

        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, { method: 'DELETE' });
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    return (
       <div className="min-h-screen bg-gray-50">
        <Navbar/>
         <div className="p-3 md:p-6 lg:p-8">
            <div className="flex justify-between items-center mb-4 md:mb-6">
                <h1 className="text-xl md:text-3xl font-bold">Users Management</h1>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); setCurrentPage(1); fetchUsers(); }} className="mb-4 md:mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 md:top-3 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 md:pl-10 pr-3 md:pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                    />
                </div>
            </form>

            {loading ? (
                <div className="text-center py-8">Loading...</div>
            ) : (
                <>
                    {/* Desktop Table View - Hidden on Mobile */}
                    <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orders</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {users.map((user) => (
                                        <tr key={user._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">{user.name}</td>
                                            <td className="px-6 py-4">{user.userName}</td>
                                            <td className="px-6 py-4">{user.email}</td>
                                            <td className="px-6 py-4">{user.placedOrders?.length || 0}</td>
                                            <td className="px-6 py-4">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => setSelectedUserId(user._id)}
                                                        className="text-blue-600 hover:text-blue-800"
                                                    >
                                                        <Eye className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(user._id)}
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Mobile Card View - Visible only on Mobile */}
                    <div className="lg:hidden space-y-3">
                        {users.map((user) => (
                            <div 
                                key={user._id} 
                                className="bg-white rounded-lg shadow p-4 border border-gray-200"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-base truncate">{user.name}</h3>
                                        <p className="text-xs text-gray-500 truncate">@{user.userName}</p>
                                    </div>
                                    <div className="flex gap-2 ml-2">
                                        <button
                                            onClick={() => setSelectedUserId(user._id)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user._id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div>
                                        <p className="text-xs text-gray-500">Email</p>
                                        <p className="text-sm font-medium truncate">{user.email}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <p className="text-xs text-gray-500">Total Orders</p>
                                            <p className="text-sm font-semibold text-blue-600">
                                                {user.placedOrders?.length || 0}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Joined</p>
                                            <p className="text-sm font-medium">
                                                {new Date(user.createdAt).toLocaleDateString('en-IN', { 
                                                    day: '2-digit', 
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination - Mobile Responsive */}
                    <div className="mt-4 md:mt-6 flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-3">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="w-full sm:w-auto px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base hover:bg-gray-50 transition"
                        >
                            Previous
                        </button>
                        <span className="px-4 py-2 text-sm md:text-base font-medium">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="w-full sm:w-auto px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base hover:bg-gray-50 transition"
                        >
                            Next
                        </button>
                    </div>
                </>
            )}

            {selectedUserId && (
                <UserDetailsModal
                    userId={selectedUserId}
                    onClose={() => setSelectedUserId(null)}
                />
            )}
        </div>
       </div>
    );
}
