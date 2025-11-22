// app/admin/orders/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Search, Eye, Package, X } from 'lucide-react';
import Navbar from "../navbar/page"

interface Order {
    orderId: string;
    orderDate: string;
    totalAmount: number;
    orderStatus: string;
    paymentMethod: string;
    paymentStatus: string;
    customerName: string;
    customerEmail: string;
    userId: string;
    trackingId?: string;
}

export default function OrdersManagement() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [statusFilter, setStatusFilter] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, [currentPage, statusFilter]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: '10',
                ...(statusFilter && { status: statusFilter }),
                ...(searchQuery && { search: searchQuery })
            });

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders?${params}`);
            const data = await response.json();
            setOrders(data.orders);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (userId: string, orderId: string, newStatus: string, trackingId?: string) => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${userId}/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    orderStatus: newStatus,
                    ...(trackingId && { trackingId })
                })
            });
            fetchOrders();
            setShowModal(false);
        } catch (error) {
            console.error('Error updating order:', error);
        }
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            pending: 'bg-yellow-100 text-yellow-800',
            processing: 'bg-blue-100 text-blue-800',
            shipped: 'bg-purple-100 text-purple-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    return (
       <div className="min-h-screen bg-gray-50">
        <Navbar/>
         <div className="p-3 md:p-6 lg:p-8">
            <h1 className="text-xl md:text-3xl font-bold mb-4 md:mb-6">Orders Management</h1>

            {/* Search and Filter Section - Mobile Responsive */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-4 md:mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 md:top-3 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
                    <input
                        type="text"
                        placeholder="Search orders..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && fetchOrders()}
                        className="w-full pl-9 md:pl-10 pr-3 md:pr-4 py-2 border rounded-lg text-sm md:text-base"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 md:px-4 py-2 border rounded-lg text-sm md:text-base min-w-[140px]"
                >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

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
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {orders.map((order) => (
                                        <tr key={order.orderId} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium">{order.orderId}</td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="font-medium">{order.customerName}</div>
                                                    <div className="text-sm text-gray-500">{order.customerEmail}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {new Date(order.orderDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">₹{order.totalAmount}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                                                    {order.orderStatus}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm">
                                                    <div>{order.paymentMethod.toUpperCase()}</div>
                                                    <div className="text-gray-500">{order.paymentStatus}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => {
                                                        setSelectedOrder(order);
                                                        setShowModal(true);
                                                    }}
                                                    className="text-blue-600 hover:text-blue-800"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Mobile Card View - Visible only on Mobile */}
                    <div className="lg:hidden space-y-3">
                        {orders.map((order) => (
                            <div 
                                key={order.orderId} 
                                className="bg-white rounded-lg shadow p-4 border border-gray-200"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500 mb-1">Order ID</p>
                                        <p className="font-semibold text-sm">{order.orderId}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                                        {order.orderStatus}
                                    </span>
                                </div>

                                <div className="space-y-2 mb-3">
                                    <div>
                                        <p className="text-xs text-gray-500">Customer</p>
                                        <p className="text-sm font-medium">{order.customerName}</p>
                                        <p className="text-xs text-gray-600">{order.customerEmail}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <p className="text-xs text-gray-500">Date</p>
                                            <p className="text-sm font-medium">
                                                {new Date(order.orderDate).toLocaleDateString('en-IN', { 
                                                    day: '2-digit', 
                                                    month: 'short' 
                                                })}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Amount</p>
                                            <p className="text-sm font-semibold text-blue-600">₹{order.totalAmount}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <p className="text-xs text-gray-500">Payment</p>
                                            <p className="text-xs font-medium uppercase">{order.paymentMethod}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Status</p>
                                            <p className="text-xs font-medium">{order.paymentStatus}</p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        setSelectedOrder(order);
                                        setShowModal(true);
                                    }}
                                    className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                                >
                                    <Eye className="w-4 h-4" />
                                    View Details
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Pagination - Mobile Responsive */}
                    <div className="mt-4 md:mt-6 flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-3">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="w-full sm:w-auto px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                        >
                            Previous
                        </button>
                        <span className="px-4 py-2 text-sm md:text-base">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="w-full sm:w-auto px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                        >
                            Next
                        </button>
                    </div>
                </>
            )}

            {showModal && selectedOrder && (
                <OrderModal
                    order={selectedOrder}
                    onClose={() => setShowModal(false)}
                    onUpdate={updateOrderStatus}
                />
            )}
        </div>
       </div>
    );
}

function OrderModal({ order, onClose, onUpdate }: any) {
    const [newStatus, setNewStatus] = useState(order.orderStatus);
    const [trackingId, setTrackingId] = useState(order.trackingId || '');

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 md:p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                {/* Modal Header - Sticky */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-4 md:p-6 flex justify-between items-center z-10">
                    <h2 className="text-lg md:text-2xl font-bold">Order Details</h2>
                    <button 
                        onClick={onClose} 
                        className="text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded-full transition"
                    >
                        <X className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                </div>
                
                <div className="p-4 md:p-6 space-y-4 md:space-y-6">
                    {/* Order Information */}
                    <div className="grid grid-cols-2 gap-3 md:gap-4 p-3 md:p-4 bg-gray-50 rounded-lg text-sm md:text-base">
                        <div>
                            <p className="text-xs md:text-sm text-gray-600">Order ID</p>
                            <p className="font-semibold text-sm md:text-base break-all">{order.orderId}</p>
                        </div>
                        <div>
                            <p className="text-xs md:text-sm text-gray-600">Order Date</p>
                            <p className="font-semibold text-sm md:text-base">
                                {new Date(order.orderDate).toLocaleDateString()}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs md:text-sm text-gray-600">Payment Method</p>
                            <p className="font-semibold text-sm md:text-base uppercase">{order.paymentMethod}</p>
                        </div>
                        <div>
                            <p className="text-xs md:text-sm text-gray-600">Payment Status</p>
                            <p className="font-semibold text-sm md:text-base">{order.paymentStatus}</p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-xs md:text-sm text-gray-600">Total Amount</p>
                            <p className="font-semibold text-lg md:text-xl text-blue-600">₹{order.totalAmount}</p>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div>
                        <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3">Shipping Address</h3>
                        <div className="p-3 md:p-4 bg-blue-50 rounded-lg space-y-1 text-sm md:text-base">
                            <p className="font-semibold">{order.shippingAddress?.fullName}</p>
                            <p>{order.shippingAddress?.phone}</p>
                            <p>{order.shippingAddress?.addressLine1}</p>
                            {order.shippingAddress?.addressLine2 && (
                                <p>{order.shippingAddress.addressLine2}</p>
                            )}
                            <p>
                                {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                            </p>
                            <p>{order.shippingAddress?.country}</p>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div>
                        <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3">Order Items</h3>
                        <div className="space-y-2 md:space-y-3">
                            {order.orderItems?.map((item: any, index: number) => (
                                <div key={index} className="flex gap-3 md:gap-4 p-2 md:p-3 border rounded-lg">
                                    <img 
                                        src={item.image} 
                                        alt={item.title}
                                        className="w-16 h-16 md:w-20 md:h-20 object-cover rounded flex-shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm md:text-base line-clamp-2">{item.title}</p>
                                        <p className="text-xs md:text-sm text-gray-600 mt-1">
                                            Qty: {item.quantity}
                                        </p>
                                        <p className="text-xs md:text-sm font-semibold text-blue-600 mt-1">
                                            ₹{item.price} × {item.quantity} = ₹{parseFloat(item.price) * item.quantity}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Status Update */}
                    <div className="border-t pt-4">
                        <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3">Update Order</h3>
                        <div className="space-y-3 md:space-y-4">
                            <div>
                                <label className="block text-xs md:text-sm font-medium mb-1">Order Status</label>
                                <select
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg text-sm md:text-base"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="processing">Processing</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs md:text-sm font-medium mb-1">Tracking ID</label>
                                <input
                                    type="text"
                                    value={trackingId}
                                    onChange={(e) => setTrackingId(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg text-sm md:text-base"
                                    placeholder="Enter tracking ID"
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2 md:gap-3 mt-4 md:mt-6">
                                <button
                                    onClick={() => onUpdate(order.userId, order.orderId, newStatus, trackingId)}
                                    className="flex-1 bg-blue-600 text-white px-4 py-2.5 md:py-2 rounded-lg hover:bg-blue-700 transition text-sm md:text-base font-medium"
                                >
                                    Update Order
                                </button>
                                <button
                                    onClick={onClose}
                                    className="flex-1 bg-gray-300 px-4 py-2.5 md:py-2 rounded-lg hover:bg-gray-400 transition text-sm md:text-base font-medium"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
