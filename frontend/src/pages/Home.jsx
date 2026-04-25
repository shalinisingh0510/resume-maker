import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { templateAPI } from '../services/api';
import { HiSparkles, HiCheckCircle, HiDeviceMobile, HiArrowRight, HiShieldCheck } from 'react-icons/hi';
import ResumePreview from '../components/ResumePreview';
import { SAMPLE_RESUME } from '../data/sampleResume';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [featuredTemplates, setFeaturedTemplates] = useState([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await templateAPI.getAll('all');
        // Take a few diverse templates
        setFeaturedTemplates(res.data.slice(0, 4));
      } catch (err) {
        console.error('Failed to fetch featured templates');
      }
    };
    fetchFeatured();
  }, []);

  const handleUseTemplate = (templateId) => {
    if (!user) {
      navigate('/signup');
    } else {
      navigate(`/builder/new?template=${templateId}`);
    }
  };

  const features = [
    {
      title: 'AI Enhancement',
      description: 'Automatically rewrite weak bullet points into impactful, results-driven statements using the STAR method.',
      icon: <HiSparkles className="w-6 h-6 text-primary" />
    },
    {
      title: 'ATS-Friendly',
      description: 'Our templates are optimized for Applicant Tracking Systems (ATS) to ensure you pass the first hurdle.',
      icon: <HiCheckCircle className="w-6 h-6 text-green-500" />
    },
    {
      title: 'Live Preview',
      description: 'See your changes in real-time with our side-by-side live editor and high-quality PDF export.',
      icon: <HiDeviceMobile className="w-6 h-6 text-secondary" />
    }
  ];

  return (
    <div className="animate-fadeIn">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-mesh">
        <div className="container-app relative z-10">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Engineered for 2026 Job Market
            </div>

            <h1 className="text-5xl md:text-8xl font-extrabold tracking-tight mb-8 max-w-5xl leading-[1.1]">
              Build a <span className="gradient-text">Winning Resume</span> <br /> in Minutes
            </h1>
            
            <p className="text-lg md:text-xl mb-12 max-w-2xl text-[var(--text-secondary)] font-medium">
              Join 10,000+ professionals using AI to optimize their resumes for MAANG, top-tier startups, and global enterprises.
            </p>

            <div className="flex flex-col sm:flex-row gap-5">
              <Link to={user ? "/dashboard" : "/signup"} className="btn btn-primary text-lg px-10 py-4 shadow-2xl">
                Create My Resume
              </Link>
              {/* ATS SCORE CTA */}
              <Link to="/ai-tools" className="btn btn-secondary text-lg px-10 py-4 flex items-center gap-3 border-2 border-primary/20 hover:border-primary/50">
                <HiShieldCheck className="text-primary text-2xl" />
                Check ATS Score
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* NEW: TEMPLATE SHOWCASE ON LANDING PAGE */}
      <section className="py-24 bg-[var(--bg-secondary)]">
        <div className="container-app">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Select a Template</h2>
              <p className="text-[var(--text-secondary)]">Pick a professional starting point and customize it with our AI builder.</p>
            </div>
            <Link to="/signup" className="group flex items-center gap-2 text-primary font-bold hover:underline">
              View full template gallery <HiArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredTemplates.map((tpl) => (
              <div key={tpl._id} className="group card p-0 overflow-hidden cursor-pointer" onClick={() => handleUseTemplate(tpl.templateId)}>
                <div className="relative aspect-[4/5] bg-white overflow-hidden">
                  <div className="absolute inset-0 flex justify-center items-start transition-transform duration-700 group-hover:scale-105">
                    <div
                      className="pointer-events-none"
                      style={{
                        width: '800px',
                        height: '1122px',
                        transform: 'scale(0.56)',
                        transformOrigin: 'top center'
                      }}
                    >
                      <ResumePreview
                        resume={SAMPLE_RESUME}
                        template={tpl.templateId}
                        templateLayout={tpl?.config?.layoutKey}
                        className="shadow-none border border-slate-200"
                      />
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-6">
                    <button className="btn btn-primary btn-sm w-full">Use this Template</button>
                  </div>
                  {tpl.isPremium && (
                    <div className="absolute top-4 left-4 px-2 py-1 bg-amber-500 text-white text-[10px] font-black rounded uppercase">PRO</div>
                  )}
                </div>
                <div className="p-4 border-t border-[var(--border-color)]">
                  <h3 className="font-bold text-sm">{tpl.name}</h3>
                  <p className="text-xs text-[var(--text-muted)] capitalize">{tpl.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24">
        <div className="container-app">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Powerful Features</h2>
            <p className="text-[var(--text-secondary)]">The only tool you need to land more interviews.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="card group hover:-translate-y-2">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 transition-colors group-hover:bg-primary/20">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
