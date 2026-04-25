import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { templateAPI } from '../services/api';
import { HiSparkles, HiCheckCircle, HiDeviceMobile, HiGlobeAlt, HiLightningBolt, HiArrowRight } from 'react-icons/hi';

const Home = () => {
  const { user } = useAuth();
  const [featuredTemplates, setFeaturedTemplates] = useState([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await templateAPI.getAll('all');
        // Just take the first few distinct categories
        const featured = res.data.slice(0, 4);
        setFeaturedTemplates(featured);
      } catch (err) {
        console.error('Failed to fetch featured templates');
      }
    };
    fetchFeatured();
  }, []);

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
    },
    {
      title: 'Global Export',
      description: 'One-click export to professional PDF format, ready to be sent to recruiters worldwide.',
      icon: <HiGlobeAlt className="w-6 h-6 text-indigo-400" />
    },
    {
      title: 'Lightning Fast',
      description: 'Built on high-performance infrastructure, your resume is generated and saved in milliseconds.',
      icon: <HiLightningBolt className="w-6 h-6 text-amber-500" />
    }
  ];

  return (
    <div className="animate-fadeIn">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-mesh">
        <div className="container-app relative z-10">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-8 animate-bounce">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Now powered by GPT-4o
            </div>

            <h1 className="text-5xl md:text-8xl font-extrabold tracking-tight mb-8 max-w-5xl leading-[1.1]">
              Build a <span className="gradient-text">Winner Resume</span> <br className="hidden md:block" /> with AI in Seconds
            </h1>
            
            <p className="text-lg md:text-xl mb-12 max-w-3xl text-[var(--text-secondary)] font-medium">
              Land your dream job with an advanced AI that analyzes, scores, and enhances your professional experience into a top-tier resume.
            </p>

            <div className="flex flex-col sm:flex-row gap-5">
              {user ? (
                <Link to="/dashboard" className="btn btn-primary text-lg px-10 py-4">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/signup" className="btn btn-primary text-lg px-10 py-4 shadow-2xl">
                    Create My Resume Now
                  </Link>
                  <Link to="/pricing" className="btn btn-secondary text-lg px-10 py-4">
                    See All Features
                  </Link>
                </>
              )}
            </div>

            {/* Social Proof */}
            <div className="mt-16 pt-12 border-t border-[var(--border-color)] w-full max-w-4xl opacity-60">
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-8">Trusted by candidates at</p>
              <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 grayscale brightness-125">
                <span className="text-xl font-bold">GOOGLE</span>
                <span className="text-xl font-bold">META</span>
                <span className="text-xl font-bold">AMAZON</span>
                <span className="text-xl font-bold">NETFLIX</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Template Showcase */}
      <section className="py-24 overflow-hidden">
        <div className="container-app">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Professional Templates</h2>
              <p className="text-[var(--text-secondary)]">Choose from 50+ battle-tested templates designed to pass any ATS and wow recruiters.</p>
            </div>
            <Link to="/signup" className="group flex items-center gap-2 text-primary font-bold hover:underline">
              View all 50+ templates <HiArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredTemplates.length > 0 ? (
              featuredTemplates.map((tpl) => (
                <div key={tpl._id} className="group cursor-pointer">
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-[var(--border-color)] mb-4 shadow-sm group-hover:shadow-xl group-hover:-translate-y-2 transition-all duration-500">
                    <img src={tpl.thumbnail} alt={tpl.name} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all" />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                       <button className="w-full py-2 bg-white text-black font-bold rounded-lg text-sm">Use Template</button>
                    </div>
                  </div>
                  <h3 className="font-bold text-center">{tpl.name}</h3>
                  <p className="text-xs text-[var(--text-muted)] text-center capitalize">{tpl.category}</p>
                </div>
              ))
            ) : (
              [1,2,3,4].map(i => (
                <div key={i} className="aspect-[3/4] rounded-2xl bg-[var(--bg-secondary)] animate-pulse"></div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-[var(--bg-secondary)]">
        <div className="container-app">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Why Choose ResumeAI?</h2>
            <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">Everything you need to stand out from the competition and get hired faster.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

      {/* Stats / Impact Section */}
      <section className="py-24">
        <div className="container-app">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center">
              <span className="text-5xl font-extrabold gradient-text mb-2">95%</span>
              <span className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider">Success Rate</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-5xl font-extrabold gradient-text mb-2">10k+</span>
              <span className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider">Resumes Created</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-5xl font-extrabold gradient-text mb-2">2x</span>
              <span className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider">More Interviews</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container-app">
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-indigo-600 to-blue-700 p-8 md:p-16 text-center text-white shadow-2xl">
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to land your dream job?</h2>
              <p className="text-lg opacity-90 mb-10">
                Join thousands of successful candidates who used ResumeAI to build their professional profiles.
              </p>
              <Link to="/signup" className="bg-white text-indigo-600 font-bold px-10 py-4 rounded-xl hover:bg-opacity-90 transition-all inline-block shadow-lg">
                Get Started for Free
              </Link>
            </div>
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl"></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
