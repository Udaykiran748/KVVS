import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Cpu, User, LogIn, LogOut, Menu, X, Shield, Calendar, History, AlertTriangle } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    logout();
    setIsOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Working Based', path: '/about' },
    { name: 'Products', path: '/products' },
    { name: 'Event', path: '/event' },
    { name: 'Contact', path: '/contact' }
  ];

  const activeStyle = ({ isActive }) =>
    `px-4 py-2 rounded-md font-orbitron text-sm transition-all duration-300 ${isActive
      ? 'text-[#B8860B] border-b-2 border-[#B8860B] bg-slate-100/30'
      : 'text-black hover:text-[#B8860B] hover:bg-slate-100/10'
    }`;

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 glass-panel border-b border-slate-800/60 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo Branding */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <img src="/images/Logo Kvvsai.jpg" alt="KVVSai Logo" className="w-16 h-16 object-contain" />
            </div>
            <span className="font-orbitron font-extrabold text-xl tracking-widest text-black">
              K V V SAI ELECTRONIC
            </span>
          </Link>

          {/* Large Screen Links */}
          <div className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => (
              <NavLink key={link.name} to={link.path} className={activeStyle}>
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Context Actions (Dashboard / Register / Login) */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-4">
                {isAdmin ? (
                  <Link to="/admin" className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full border border-purple-500/40 bg-purple-500/10 text-purple-300 text-xs font-orbitron hover:bg-purple-500/25 transition-all">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Admin Control</span>
                  </Link>
                ) : (
                  <Link to="/history" className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full border border-blue-500/40 bg-blue-500/10 text-blue-300 text-xs font-orbitron hover:bg-blue-500/25 transition-all">
                    <History className="w-3.5 h-3.5" />
                    <span>My Boarding Passes</span>
                  </Link>
                )}

                <div className="flex items-center space-x-2 border-l border-slate-700/60 pl-4">
                  <div className="text-right">
                    <p className="text-xs text-[#3b82f6] font-orbitron">{user.name.split(' ')[0]}</p>
                    <p className="text-[10px] text-black capitalize">{user.role}</p>
                  </div>
                  <User className="w-8 h-8 p-1.5 bg-slate-100 border border-slate-800 rounded-full text-black" />
                </div>

                <button
                  onClick={handleLogoutClick}
                  className="flex items-center space-x-1 p-2 rounded-md text-red-400 hover:bg-red-500/10 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/booking" className="btn-cyber px-5 py-2 rounded text-xs">
                  BOOKING GENERATOR
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-black hover:text-black hover:bg-slate-800 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Responsive Drawer Menu */}
      {isOpen && (
        <div className="md:hidden glass-panel border-t border-slate-800/80 slide-in-top">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2.5 rounded-md text-base font-orbitron font-medium text-black hover:text-[#B8860B] hover:bg-slate-100"
              >
                {link.name}
              </Link>
            ))}

            <div className="border-t border-slate-800/80 my-4 pt-4 px-3">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <User className="w-9 h-9 p-1.5 bg-slate-100 border border-slate-800 rounded-full text-black" />
                    <div>
                      <p className="text-sm text-[#3b82f6] font-orbitron">{user.name}</p>
                      <p className="text-xs text-black capitalize">{user.role}</p>
                    </div>
                  </div>

                  {isAdmin ? (
                    <Link
                      to="/admin"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-2 w-full px-3 py-2 rounded-md text-purple-300 bg-purple-500/10 border border-purple-500/20"
                    >
                      <Shield className="w-4 h-4" />
                      <span>Admin Control Panel</span>
                    </Link>
                  ) : (
                    <Link
                      to="/history"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-2 w-full px-3 py-2 rounded-md text-blue-300 bg-blue-500/10 border border-blue-500/20"
                    >
                      <History className="w-4 h-4" />
                      <span>My Pass Ledger</span>
                    </Link>
                  )}

                  <button
                    onClick={handleLogoutClick}
                    className="flex items-center space-x-2 w-full px-3 py-2.5 rounded-md text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Exit Terminal</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/booking"
                    onClick={() => setIsOpen(false)}
                    className="btn-cyber block text-center w-full px-4 py-2.5 rounded text-sm"
                  >
                    BOOKING GENERATOR
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>

      {/* Custom Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/70 backdrop-blur-sm">
          <div className="bg-slate-100 border border-slate-300 rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0" />
              <h3 className="font-bold text-slate-900 font-mono tracking-wide">CONFIRM LOGOUT</h3>
            </div>
            <p className="text-slate-700 text-sm mb-6 font-mono leading-relaxed">
              {isAdmin ? "Are you sure you want to log out of the admin panel?" : "Are you sure you want to log out?"}
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowLogoutConfirm(false)} 
                className="flex-1 py-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-200 transition text-sm font-mono"
              >
                CANCEL
              </button>
              <button 
                onClick={confirmLogout} 
                className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white transition text-sm font-mono font-bold"
              >
                LOGOUT
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;

