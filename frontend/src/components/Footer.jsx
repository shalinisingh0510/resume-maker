import { Link } from 'react-router-dom';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-[var(--border-color)] bg-[var(--bg-secondary)] pt-12 pb-8">
      <div className="container-app">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold mb-4">
              <span>📄</span>
              <span className="gradient-text">ResumeAI</span>
            </Link>
            <p className="text-sm text-[var(--text-secondary)]">
              Build professional, AI-powered resumes in minutes. Your dream career starts with a great resume.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-[var(--text-primary)]">Product</h4>
            <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
              <li><Link to="/builder" className="hover:text-primary transition-colors">Resume Builder</Link></li>
              <li><Link to="/ai-tools" className="hover:text-primary transition-colors">AI Enhancer</Link></li>
              <li><Link to="/templates" className="hover:text-primary transition-colors">Templates</Link></li>
              <li><Link to="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-[var(--text-primary)]">Resources</h4>
            <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
              <li><Link to="/blog" className="hover:text-primary transition-colors">Career Blog</Link></li>
              <li><Link to="/guide" className="hover:text-primary transition-colors">Writing Guide</Link></li>
              <li><Link to="/samples" className="hover:text-primary transition-colors">Resume Samples</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-[var(--text-primary)]">Connect</h4>
            <div className="flex gap-4 mb-4">
              <a href="#" className="text-[var(--text-secondary)] hover:text-primary transition-colors"><FaGithub size={20} /></a>
              <a href="#" className="text-[var(--text-secondary)] hover:text-primary transition-colors"><FaTwitter size={20} /></a>
              <a href="#" className="text-[var(--text-secondary)] hover:text-primary transition-colors"><FaLinkedin size={20} /></a>
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              Subscribe to our newsletter for career tips.
            </p>
          </div>
        </div>
        
        <div className="border-t border-[var(--border-color)] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[var(--text-muted)]">
            © {new Date().getFullYear()} ResumeAI. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-[var(--text-muted)]">
            <Link to="/privacy" className="hover:text-[var(--text-primary)]">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-[var(--text-primary)]">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
