import React, { useState, useEffect, useContext } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  ChartBarIcon,
  Cog6ToothIcon,
  HomeIcon,
  UsersIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  UserCircleIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { AuthContext } from '../provider/AuthProvider';
import Swal from 'sweetalert2';

function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState('Home');
  const location = useLocation();
  const navigate = useNavigate();
    const { signOutUser} =
      useContext(AuthContext);

  const navItems = [
   
    // { icon: UsersIcon, label: 'Users', href: '/admin/users' },
    { icon: ChartBarIcon, label: 'Payment', href: '/admin/payment' },
    { icon: Cog6ToothIcon, label: 'Banner', href: '/admin/banner' },
    { icon: HomeIcon, label: 'Home', href: '/' },
  ];

  useEffect(() => {
    // Close mobile menu when resizing to desktop
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false);
        setIsMobileSearchOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Set active nav item based on current route
    const currentPath = location.pathname;
    const activeItem = navItems.find(item => item.href === currentPath);
    if (activeItem) {
      setActiveNavItem(activeItem.label);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your account!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, log me out!",
    }).then((result) => {
      if (result.isConfirmed) {
        signOutUser();
        Swal.fire("Logged Out!", "You have been logged out.", "success");
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white shadow-sm z-30 md:left-64 transition-all duration-300">
        <div className="flex items-center justify-between h-full px-4 md:px-6">
          {/* Mobile menu and search buttons */}
          <div className="flex items-center space-x-2 md:hidden">
            <button
              className="p-2 text-gray-600 rounded-lg hover:bg-gray-100"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
            <button
              className="p-2 text-gray-600 rounded-lg hover:bg-gray-100"
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            >
              <MagnifyingGlassIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Search..."
              />
            </div>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 rounded-full hover:bg-gray-100 relative">
              <BellIcon className="h-6 w-6" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="relative">
              <button
                className="flex items-center space-x-2 focus:outline-none"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <UserCircleIcon className="h-8 w-8 text-gray-600" />
                <span className="hidden md:inline text-sm font-medium text-gray-700">Admin</span>
                <ChevronDownIcon className={`hidden md:inline h-4 w-4 text-gray-500 transition-transform ${isProfileOpen ? 'transform rotate-180' : ''}`} />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Your Profile
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Settings
                  </a>
                  <button
                    onClick={signOutUser
                    }
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        {isMobileSearchOpen && (
          <div className="md:hidden p-3 bg-white border-t">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Search..."
                autoFocus
              />
              <button
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setIsMobileSearchOpen(false)}
              >
                <XMarkIcon className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 w-64 bg-white shadow-lg rounded-r-xl p-6 transition-transform duration-300 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 z-40 mt-16 md:mt-0`}
      >
        <h2 className="text-2xl font-bold text-indigo-600 mb-8 hidden md:block">Dashboard Pro</h2>
        <nav>
          <ul className="space-y-2">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.href}
                  className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                    activeNavItem === item.label
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                  }`}
                  onClick={() => {
                    setActiveNavItem(item.label);
                    if (window.innerWidth < 768) setIsSidebarOpen(false);
                  }}
                >
                  <item.icon className="h-6 w-6 mr-3" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            ))}
            <li className="border-t border-gray-200 pt-2">
              <button
                onClick={handleLogout}
                className="flex items-center w-full p-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
              >
                <ArrowRightOnRectangleIcon className="h-6 w-6 mr-3" />
                <span className="font-medium">Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="pt-16 md:ml-64 md:pt-0 p-4 md:p-8 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8">
            {activeNavItem === 'Home' ? 'Welcome back, Admin!' : activeNavItem}
          </h1>
          
          {/* Stats Grid - Only shown on Home */}
          {activeNavItem === 'Home' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
              {['Total Users', 'Revenue', 'Active Projects'].map((title, index) => (
                <div key={index} className="bg-white p-4 md:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                  <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
                  <p className="mt-2 text-2xl md:text-3xl font-bold text-gray-900">1,234</p>
                  <div className="mt-2 flex items-center text-green-600">
                    <span className="text-sm font-medium">+12.5%</span>
                    <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Outlet for Nested Routes */}
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm mb-6 md:mb-8">
            <Outlet />
          </div>

          {/* Recent Activity - Only shown on Home */}
          {activeNavItem === 'Home' && (
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {['New user registration', 'System update completed', 'Payment received'].map((item, index) => (
                  <div key={index} className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                    <div className="h-2 w-2 bg-indigo-600 rounded-full mr-3"></div>
                    <span className="text-gray-700 text-sm md:text-base">{item}</span>
                    <span className="ml-auto text-xs md:text-sm text-gray-500">2h ago</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;