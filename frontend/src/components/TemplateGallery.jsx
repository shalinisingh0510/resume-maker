import { useState } from 'react';
import { RESUME_TEMPLATES, TEMPLATE_CATEGORIES } from '../data/templates';
import { HiLockClosed, HiCheckCircle, HiSearch, HiFilter } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const TemplateGallery = ({ selectedTemplate, onSelect }) => {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTemplates = RESUME_TEMPLATES.filter(tpl => {
    const matchesCategory = activeCategory === 'all' || 
                           (activeCategory === 'premium' ? tpl.isPremium : tpl.category === activeCategory);
    const matchesSearch = tpl.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tpl.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
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
            placeholder="Search templates..."
            className="input pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
          {TEMPLATE_CATEGORIES.map(cat => (
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredTemplates.map(tpl => {
          const isLocked = tpl.isPremium && !isUserPremium;
          const isSelected = selectedTemplate === tpl.id;

          return (
            <div 
              key={tpl.id}
              className={`group relative card p-0 overflow-hidden cursor-pointer transition-all border-2 ${
                isSelected ? 'border-primary' : 'border-transparent hover:border-primary/30'
              }`}
              onClick={() => !isLocked && onSelect(tpl.id)}
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-[3/4] bg-[var(--bg-secondary)]">
                <img 
                  src={tpl.thumbnail} 
                  alt={tpl.name}
                  className={`w-full h-full object-cover transition-all duration-500 ${isLocked ? 'blur-[2px] grayscale opacity-60' : 'group-hover:scale-105'}`}
                />
                
                {/* Overlays */}
                {isLocked && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex flex-col items-center justify-center p-4 text-center">
                    <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center mb-3 shadow-lg">
                      <HiLockClosed className="text-white text-2xl" />
                    </div>
                    <p className="text-white text-xs font-black uppercase tracking-widest mb-2">Premium Template</p>
                    <Link 
                      to="/pricing" 
                      className="px-4 py-2 bg-white text-black text-[10px] font-bold rounded-lg hover:bg-gray-100 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Upgrade to Unlock
                    </Link>
                  </div>
                )}

                {isSelected && (
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shadow-lg animate-bounce-short">
                    <HiCheckCircle className="text-white text-xl" />
                  </div>
                )}
                
                {tpl.isPremium && !isLocked && (
                  <div className="absolute top-3 left-3 px-2 py-1 bg-amber-500 text-white text-[10px] font-black rounded uppercase tracking-tighter">
                    PRO
                  </div>
                )}
              </div>

              {/* Info Area */}
              <div className="p-4 bg-[var(--bg-primary)]">
                <h4 className="font-bold text-sm mb-1">{tpl.name}</h4>
                <p className="text-[10px] text-[var(--text-muted)] line-clamp-1">{tpl.description}</p>
              </div>
            </div>
          );
        })}
      </div>
      
      {filteredTemplates.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-[var(--text-muted)] font-medium">No templates found in this category.</p>
        </div>
      )}
    </div>
  );
};

export default TemplateGallery;
