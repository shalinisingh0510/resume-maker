import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Pricing = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpgrade = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const res = await authAPI.upgrade();
      updateUser({ subscriptionType: res.data.subscriptionType });
      toast.success(res.data.message || 'Successfully upgraded to Premium!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upgrade. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-app py-16 animate-fadeIn">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
        <p className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>
          Choose the plan that best fits your career goals.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 justify-center max-w-5xl mx-auto">
        {/* Free Plan */}
        <div className="card flex-1 flex flex-col relative overflow-hidden" style={{ borderTop: '4px solid var(--color-border)' }}>
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Free Plan</h2>
            <div className="text-4xl font-extrabold mb-2">$0<span className="text-lg font-normal" style={{ color: 'var(--color-text-secondary)' }}>/forever</span></div>
            <p style={{ color: 'var(--color-text-muted)' }}>Perfect for getting started.</p>
          </div>
          
          <ul className="flex-1 flex flex-col gap-3 mb-8">
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span> Max 2 Resumes
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span> Max 2 AI Enhancements
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span> Unlimited AI Scoring
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span> Basic Templates
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span> PDF Download
            </li>
          </ul>

          <button className="btn btn-secondary w-full" disabled={user?.subscriptionType === 'free'}>
            {user?.subscriptionType === 'free' ? 'Current Plan' : 'Get Started'}
          </button>
        </div>

        {/* Premium Plan */}
        <div className="card flex-1 flex flex-col relative overflow-hidden" style={{ borderTop: '4px solid var(--color-primary)', transform: 'scale(1.05)', zIndex: 10 }}>
          <div className="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
            MOST POPULAR
          </div>
          <div className="mb-6 mt-2">
            <h2 className="text-2xl font-bold mb-2 text-white">Premium Plan</h2>
            <div className="text-4xl font-extrabold mb-2 text-white">$9.99<span className="text-lg font-normal" style={{ color: 'var(--color-text-secondary)' }}>/month</span></div>
            <p style={{ color: 'var(--color-text-muted)' }}>For ambitious professionals.</p>
          </div>
          
          <ul className="flex-1 flex flex-col gap-3 mb-8 text-white">
            <li className="flex items-center gap-2">
              <span className="text-indigo-400">✓</span> <strong>Unlimited</strong> Resumes
            </li>
            <li className="flex items-center gap-2">
              <span className="text-indigo-400">✓</span> <strong>Unlimited</strong> AI Enhancements
            </li>
            <li className="flex items-center gap-2">
              <span className="text-indigo-400">✓</span> Unlimited AI Scoring
            </li>
            <li className="flex items-center gap-2">
              <span className="text-indigo-400">✓</span> Premium Templates
            </li>
            <li className="flex items-center gap-2">
              <span className="text-indigo-400">✓</span> LaTeX Editor Access
            </li>
          </ul>

          <button 
            className="btn btn-primary w-full" 
            onClick={handleUpgrade}
            disabled={loading || user?.subscriptionType === 'premium'}
          >
            {loading ? <span className="spinner"></span> : user?.subscriptionType === 'premium' ? 'Current Plan' : 'Upgrade to Premium'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
