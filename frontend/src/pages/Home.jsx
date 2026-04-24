import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="container-app py-16 flex flex-col items-center justify-center text-center animate-fadeIn min-h-[calc(100vh-4rem)]">
      
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm mb-8">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
        </span>
        ResumeAI 2.0 is live
      </div>

      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl">
        Build a <span className="gradient-text">Top-Tier Resume</span> in Minutes with AI
      </h1>
      
      <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
        Our advanced AI analyzes, scores, and enhances your resume to help you land your dream job. Choose from premium templates and stand out.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mb-16">
        {user ? (
          <Link to="/dashboard" className="btn btn-primary text-lg px-8 py-3">
            Go to Dashboard
          </Link>
        ) : (
          <>
            <Link to="/signup" className="btn btn-primary text-lg px-8 py-3">
              Start Building Free
            </Link>
            <Link to="/pricing" className="btn btn-secondary text-lg px-8 py-3">
              View Pricing
            </Link>
          </>
        )}
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full text-left">
        <div className="card">
          <div className="text-3xl mb-4">🤖</div>
          <h3 className="text-xl font-bold mb-2 text-white">AI Enhancement</h3>
          <p style={{ color: 'var(--color-text-muted)' }}>
            Automatically rewrite weak bullet points into impactful, results-driven statements using the STAR method.
          </p>
        </div>
        <div className="card">
          <div className="text-3xl mb-4">📊</div>
          <h3 className="text-xl font-bold mb-2 text-white">Smart Scoring</h3>
          <p style={{ color: 'var(--color-text-muted)' }}>
            Get an instant ATS compatibility score and actionable feedback to improve your resume's impact.
          </p>
        </div>
        <div className="card">
          <div className="text-3xl mb-4">🎨</div>
          <h3 className="text-xl font-bold mb-2 text-white">Premium Templates</h3>
          <p style={{ color: 'var(--color-text-muted)' }}>
            Choose from carefully crafted templates designed to pass ATS and impress human recruiters.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
