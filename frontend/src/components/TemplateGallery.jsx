import { useState, useEffect } from 'react';
import { templateAPI } from '../services/api';
import { HiLockClosed, HiCheckCircle, HiSearch } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { id: 'all', name: 'All Templates' },
  { id: 'professional', name: 'Professional' },
  { id: 'student', name: 'Student' },
  { id: 'creative', name: 'Creative' },
  { id: 'minimal', name: 'Minimalist' },
  { id: 'premium', name: 'Premium (PRO)' }
];

const TemplateGallery = ({ selectedTemplate, onSelect }) => {
  const { user } = useAuth();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTemplates();
  }, [activeCategory]);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      // Fetch from backend
      const res = await templateAPI.getAll(activeCategory);
      setTemplates(res.data);
    } catch (error) {
      toast.error('Failed to load templates');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTemplates = templates.filter(tpl => {
    const matchesSearch = tpl.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tpl.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const isUserPremium = user?.subscriptionType === 'premium';

  return (
    <div className="space-y-6 animate-fadeIn pb-20">
      {/* Search and Filter */}
      <div className="flex flex-col gap-4">
        <div className="relative">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search premium templates..."
            className="input pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                activeCategory === cat.id
                ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                : 'bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-muted)] hover:border-primary/50'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      {loading ? (
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="aspect-[3/4] rounded-xl bg-[var(--bg-secondary)] animate-pulse border border-[var(--border-color)]"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredTemplates.map(tpl => {
            const isLocked = tpl.isPremium && !isUserPremium;
            const isSelected = selectedTemplate === tpl.templateId;

            return (
              <div 
                key={tpl._id}
                className={`group relative card p-0 overflow-hidden cursor-pointer transition-all border-2 ${
                  isSelected ? 'border-primary' : 'border-transparent hover:border-primary/30'
                }`}
                onClick={() => !isLocked && onSelect(tpl.templateId)}
              >
                <div className="relative aspect-[3/4] bg-[var(--bg-secondary)]">
                  <img 
                    src={tpl.thumbnail} 
                    alt={tpl.name}
                    className={`w-full h-full object-cover transition-all duration-500 ${isLocked ? 'blur-[3px] grayscale opacity-60' : 'group-hover:scale-105'}`}
                  />
                  
                  {isLocked && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 text-center">
                      <HiLockClosed className="text-white text-3xl mb-2" />
                      <p className="text-white text-[10px] font-black uppercase tracking-widest mb-2">Premium</p>
                      <Link 
                        to="/pricing" 
                        className="px-3 py-1.5 bg-white text-black text-[9px] font-bold rounded hover:bg-gray-100 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Unlock Now
                      </Link>
                    </div>
                  )}

                  {isSelected && (
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                      <HiCheckCircle className="text-white text-xl" />
                    </div>
                  )}
                  
                  {tpl.isPremium && !isLocked && (
                    <div className="absolute top-3 left-3 px-2 py-1 bg-amber-500 text-white text-[9px] font-black rounded uppercase">
                      PRO
                    </div>
                  )}
                </div>

                <div className="p-3 bg-[var(--bg-primary)]">
                  <h4 className="font-bold text-xs mb-0.5">{tpl.name}</h4>
                  <p className="text-[9px] text-[var(--text-muted)] line-clamp-1">{tpl.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {!loading && filteredTemplates.length === 0 && (
        <div className="py-12 text-center text-[var(--text-muted)] text-sm">
          No templates found.
        </div>
      )}
    </div>
  );
};

export default TemplateGallery;
