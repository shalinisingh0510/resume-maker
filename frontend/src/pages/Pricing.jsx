import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { HiCheck, HiStar, HiRocket, HiCheckCircle } from 'react-icons/hi';
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
    <div className="container-app py-20 animate-fadeIn">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6">Simple, Transparent <span className="gradient-text">Pricing</span></h1>
        <p className="text-lg text-[var(--text-secondary)]">
          Choose the plan that's right for your career stage. All plans include high-quality PDF exports.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch max-w-5xl mx-auto">
        {/* Free Plan */}
        <div className="card flex-1 flex flex-col p-10 hover:border-[var(--border-color)] transition-all">
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <HiRocket className="text-green-500" /> Free Plan
            </h2>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-5xl font-extrabold">$0</span>
              <span className="text-[var(--text-muted)]">/forever</span>
            </div>
            <p className="text-sm text-[var(--text-muted)] font-medium">Perfect for a quick resume update.</p>
          </div>
          
          <ul className="flex-1 flex flex-col gap-4 mb-10">
            {[
              'Up to 2 Resumes',
              '2 AI Enhancements',
              'Unlimited Smart Scoring',
              'Basic Professional Templates',
              'Standard PDF Export'
            ].map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                <HiCheckCircle className="text-green-500 w-5 h-5 shrink-0" /> {feature}
              </li>
            ))}
          </ul>

          <button className="btn btn-secondary w-full h-12 font-bold" disabled={user?.subscriptionType === 'free'}>
            {user?.subscriptionType === 'free' ? 'Current Plan' : 'Get Started'}
          </button>
        </div>

        {/* Premium Plan */}
        <div className="card flex-1 flex flex-col p-10 relative border-2 border-primary shadow-2xl shadow-primary/10 md:-translate-y-4">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
            Recommended
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <HiStar className="text-amber-500" /> Premium Plan
            </h2>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-5xl font-extrabold gradient-text">$9.99</span>
              <span className="text-[var(--text-muted)]">/month</span>
            </div>
            <p className="text-sm text-[var(--text-muted)] font-medium">For serious job seekers.</p>
          </div>
          
          <ul className="flex-1 flex flex-col gap-4 mb-10">
            {[
              'Unlimited Resumes',
              'Unlimited AI Enhancements',
              'Priority AI Response',
              'All Premium Templates',
              'Latex Editor Access',
              'Remove Watermarks'
            ].map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-sm font-semibold">
                <HiCheckCircle className="text-primary w-5 h-5 shrink-0" /> {feature}
              </li>
            ))}
          </ul>

          <button 
            className="btn btn-primary w-full h-12 font-bold shadow-xl shadow-primary/20" 
            onClick={handleUpgrade}
            disabled={loading || user?.subscriptionType === 'premium'}
          >
            {loading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : user?.subscriptionType === 'premium' ? 'Active Subscription' : 'Upgrade to Pro'}
          </button>
        </div>
      </div>
      
      {/* FAQ / Simple Text Section */}
      <div className="mt-32 text-center">
        <p className="text-[var(--text-muted)] text-sm">
          Trusted by over 10,000+ candidates globally. <br />
          Need a custom plan for your team? <Link to="#" className="text-primary hover:underline font-bold">Contact Sales</Link>
        </p>
      </div>
    </div>
  );
};

export default Pricing;
