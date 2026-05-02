import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Grid3X3,
  Users,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Bell,
  Search
} from 'lucide-react';

import axios from 'axios';


const AdminLayout = () => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  useEffect(() => {
    const fetchResults = async () => {
      if (!search) {
        setResults(null);
        return;
      }

    try {
       const token = localStorage.getItem('adminToken'); // 🔥 IMPORTANT

       const res = await axios.get(
         `http://localhost:5000/api/admin/search?q=${search}`,
         {
           headers: {
              Authorization: `Bearer ${token}`
            }
          } 
        );

       setResults(res.data);
      } catch (error) {
         console.error(error);
        }
    }; 

    const delay = setTimeout(fetchResults, 400);
    return () => clearTimeout(delay);
  }, [search]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/login');
  };

  const menuItems = [
    { path: '/', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
    { path: '/products', icon: <Package className="w-5 h-5" />, label: 'Products' },
    { path: '/orders', icon: <ShoppingCart className="w-5 h-5" />, label: 'Orders' },
    { path: '/categories', icon: <Grid3X3 className="w-5 h-5" />, label: 'Categories' },
    { path: '/users', icon: <Users className="w-5 h-5" />, label: 'Users' },
    { path: '/settings', icon: <Grid3X3 className="w-5 h-5" />, label: 'Settings' }
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gradient-to-b from-slate-900 to-slate-800 text-white transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <span className="text-2xl">🌿</span>
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="text-lg font-bold">Sri Bhoomi</h1>
                <p className="text-xs text-slate-400">Admin Panel</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-1">
          {menuItems.map((item, index) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                isActive(item.path)
                  ? 'bg-purple-600 text-white'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {item.icon}
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-700 space-y-1">
          <Link
            to="/"
            target="_blank"
            className="flex items-center space-x-3 px-4 py-3 text-slate-300 hover:bg-slate-700 rounded-xl transition-all"
          >
            <ExternalLink className="w-5 h-5" />
            {sidebarOpen && <span className="font-medium">View Website</span>}
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {sidebarOpen ? (
                <X className="w-6 h-6 text-gray-600" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600" />
              )}
            </button>
            <div>
              <h2 className="text-xl font-bold text-gray-900 capitalize">
                {location.pathname === '/'
                  ? 'Dashboard'
                  : location.pathname.slice(1)}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

             <input
               type="text"
               placeholder="Search..."
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="w-full pl-10 pr-4 py-2 border rounded"
              />

              {/* 🔥 SEARCH RESULTS */}
             {results && (
               <div className="absolute bg-white shadow-lg rounded-lg mt-2 w-full z-50 p-3 max-h-64 overflow-y-auto">

               {/* Products */}
               <div>
               <h4 className="font-semibold text-sm">Products</h4>
               {results.products.map(p => (
                  <div key={p._id} className="text-sm py-1">{p.name}</div>
               ))}
              </div>

              {/* Users */}
             <div className="mt-2">
               <h4 className="font-semibold text-sm">Users</h4>
               {results.users.map(u => (
                 <div key={u._id} className="text-sm py-1">{u.name}</div>
                ))}
              </div>

              {/* Orders */}
             <div className="mt-2">
               <h4 className="font-semibold text-sm">Orders</h4>
               {results.orders.map(o => (
                 <div key={o._id} className="text-sm py-1">{o._id}</div>
                ))}
              </div>

            </div>           
            )}
          </div>
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-6 h-6 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                
              </div>
              <div className="hidden sm:block">
                <p className="font-semibold text-gray-900">Admin</p>
                <p className="text-sm text-gray-500">Super Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
