'use client';

import { useState } from 'react';
import {
  Menu,
  Search,
  User,
  LogOut,
  Settings,
  Truck
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface AdminNavbarProps {
  onMenuToggle?: () => void;
}

export default function AdminNavbar({ onMenuToggle }: AdminNavbarProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const router = useRouter();

  const gotoOrders = () => router.push('/Component/Admin/orders');
  const gotoUsers = () => router.push('/Component/Admin/users');
  const gotoDashBoard = () => router.push('/Component/Admin/dashboard');

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 px-3 py-2 md:px-4 md:py-3 sticky top-0 z-40">
      <div className="flex items-center justify-between gap-2">
        {/* Left Section */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Menu for mobile */}
          {/* <button
            onClick={onMenuToggle}
            className="lg:hidden p-1.5 md:p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
          </button> */}

          {/* Title (click to dashboard) */}
          <button
            onClick={gotoDashBoard}
            className="text-left"
          >
            <h1 className="text-base md:text-xl font-bold text-gray-800 truncate max-w-[150px] md:max-w-xs">
              Admin Dashboard
            </h1>
          </button>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-1 md:gap-3">
         
          {/* Orders & Users – compact on mobile */}
          <div className="flex items-center gap-1 md:gap-2">
            <button
              onClick={gotoOrders}
              className="flex items-center gap-1 md:gap-2 p-1.5 md:p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="w-7 h-7 md:w-8 md:h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Truck className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <span className="hidden sm:block text-xs md:text-sm font-medium text-gray-700">
                Orders
              </span>
            </button>

            <button
              onClick={gotoUsers}
              className="flex items-center gap-1 md:gap-2 p-1.5 md:p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="w-7 h-7 md:w-8 md:h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <span className="hidden sm:block text-xs md:text-sm font-medium text-gray-700">
                All Users
              </span>
            </button>
          </div>

          
        </div>
      </div>
    </nav>
  );
}
