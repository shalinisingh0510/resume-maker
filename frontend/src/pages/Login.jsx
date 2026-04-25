import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to login. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-app py-12 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="w-full max-w-md animate-fadeIn">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block text-3xl mb-4">📄</Link>
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-[var(--text-secondary)]">Sign in to manage your resumes</p>
        </div>

        <div className="card shadow-xl p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-semibold mb-2 text-[var(--text-secondary)]">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input"
                placeholder="name@company.com"
                required
              />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <label className="block text-sm font-semibold text-[var(--text-secondary)]">Password</label>
                <Link to="#" className="text-xs text-primary hover:underline">Forgot password?</Link>
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input"
                placeholder="••••••••"
                required
              />
            </div>
            
            <button type="submit" className="btn btn-primary w-full mt-2 h-12" disabled={loading}>
              {loading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : 'Sign In'}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--border-color)]"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[var(--bg-card)] px-2 text-[var(--text-muted)]">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="btn btn-secondary flex gap-2 h-11">
              <FaGoogle className="text-red-500" /> Google
            </button>
            <button className="btn btn-secondary flex gap-2 h-11">
              <FaGithub /> GitHub
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-[var(--text-secondary)]">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary font-bold hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
