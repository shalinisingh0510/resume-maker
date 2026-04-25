import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { HiMenu, HiX, HiMoon, HiSun } from 'react-icons/hi';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  const navLinks = user
    ? [
        { to: '/dashboard', label: 'Dashboard' },
        { to: '/builder', label: 'Builder' },
        { to: '/history', label: 'History' },
        { to: '/ai-tools', label: 'AI Tools' },
        { to: '/pricing', label: 'Pricing' },
      ]
    : [
        { to: '/pricing', label: 'Pricing' },
      ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-[var(--border-color)]">
      <div className="container-app flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-xl font-bold no-underline">
          <span className="text-2xl">📄</span>
          <span className="gradient-text">ResumeAI</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="px-3 py-2 rounded-lg text-sm font-medium no-underline text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-all"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-all"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <HiSun size={20} /> : <HiMoon size={20} />}
          </button>
          
          <div className="h-6 w-[1px] bg-[var(--border-color)] mx-1" />

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-[var(--text-secondary)]">
                {user.name}
              </span>
              {user.subscriptionType === 'premium' && (
                <span className="badge bg-amber-500/10 text-amber-500 border border-amber-500/20">PRO</span>
              )}
              <button onClick={handleLogout} className="btn btn-ghost text-xs">
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost text-sm">Login</Link>
              <Link to="/signup" className="btn btn-primary text-sm">Get Started</Link>
            </>
          )}
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-2 md:hidden">
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-lg text-[var(--text-secondary)]"
          >
            {theme === 'dark' ? <HiSun size={22} /> : <HiMoon size={22} />}
          </button>
          <button
            className="btn btn-ghost p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[var(--border-color)] bg-[var(--bg-secondary)] animate-fadeIn">
          <div className="p-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="px-3 py-2 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)] transition-all"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-[var(--border-color)] pt-3 mt-2">
              {user ? (
                <button onClick={handleLogout} className="btn btn-ghost w-full">Logout</button>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link to="/login" className="btn btn-ghost no-underline" onClick={() => setMobileOpen(false)}>Login</Link>
                  <Link to="/signup" className="btn btn-primary no-underline" onClick={() => setMobileOpen(false)}>Get Started</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
