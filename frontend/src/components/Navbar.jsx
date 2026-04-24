import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiMenu, HiX } from 'react-icons/hi';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
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
    <nav className="fixed top-0 left-0 right-0 z-50 glass" style={{ borderBottom: '1px solid var(--color-border)' }}>
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
              className="px-3 py-2 rounded-lg text-sm font-medium no-underline transition-colors"
              style={{ color: 'var(--color-text-secondary)' }}
              onMouseOver={(e) => { e.target.style.color = 'var(--color-text-primary)'; e.target.style.background = 'var(--color-bg-tertiary)'; }}
              onMouseOut={(e) => { e.target.style.color = 'var(--color-text-secondary)'; e.target.style.background = 'transparent'; }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                {user.name}
              </span>
              {user.subscriptionType === 'premium' && (
                <span className="badge badge-warning">PRO</span>
              )}
              <button onClick={handleLogout} className="btn btn-ghost text-sm">
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost no-underline">Login</Link>
              <Link to="/signup" className="btn btn-primary no-underline">Get Started</Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden btn btn-ghost p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t animate-fadeIn" style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg-secondary)' }}>
          <div className="p-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="px-3 py-2 rounded-lg text-sm font-medium no-underline"
                style={{ color: 'var(--color-text-secondary)' }}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t pt-3 mt-2" style={{ borderColor: 'var(--color-border)' }}>
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
