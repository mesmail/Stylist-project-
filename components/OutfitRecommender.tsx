
import React from 'react';
import { Outfit } from '../types';

interface OutfitRecommenderProps {
  outfits: Outfit[];
}

const OutfitRecommender: React.FC<OutfitRecommenderProps> = ({ outfits }) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Casual': return 'fa-coffee';
      case 'Business': return 'fa-briefcase';
      case 'Night': return 'fa-moon';
      default: return 'fa-star';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Casual': return 'bg-zinc-100 text-zinc-800';
      case 'Business': return 'bg-slate-800 text-white';
      case 'Night': return 'bg-zinc-900 text-white';
      default: return 'bg-zinc-100';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {outfits.map((outfit, idx) => (
        <div key={idx} className="bg-white rounded-[2rem] overflow-hidden border border-zinc-100 shadow-xl flex flex-col group hover:-translate-y-2 transition-transform duration-300">
          <div className={`p-6 ${getCategoryColor(outfit.category)} flex justify-between items-center`}>
            <div className="flex items-center space-x-3">
              <i className={`fas ${getCategoryIcon(outfit.category)}`}></i>
              <span className="font-bold tracking-tight">{outfit.category} Edition</span>
            </div>
            <div className="text-xs font-medium uppercase tracking-widest opacity-70">Style Set {idx + 1}</div>
          </div>
          
          <div className="relative aspect-[3/4] bg-zinc-100 overflow-hidden">
            {outfit.imageUrl ? (
              <img 
                src={outfit.imageUrl} 
                alt={outfit.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center space-y-3">
                <div className="w-10 h-10 border-4 border-zinc-200 border-t-black rounded-full animate-spin"></div>
                <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest">Visualizing Style...</p>
              </div>
            )}
          </div>

          <div className="p-8 flex-1 space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-2 group-hover:text-zinc-700 transition-colors">{outfit.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed italic">"{outfit.explanation}"</p>
            </div>

            <div className="space-y-4">
               <div className="flex items-start space-x-3">
                 <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 mt-2"></div>
                 <div>
                    <span className="text-xs text-zinc-400 font-bold uppercase block mb-1">Top</span>
                    <span className="font-medium">{outfit.items?.top || 'N/A'}</span>
                 </div>
               </div>
               <div className="flex items-start space-x-3">
                 <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 mt-2"></div>
                 <div>
                    <span className="text-xs text-zinc-400 font-bold uppercase block mb-1">Bottom</span>
                    <span className="font-medium">{outfit.items?.bottom || 'N/A'}</span>
                 </div>
               </div>
               <div className="flex items-start space-x-3">
                 <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 mt-2"></div>
                 <div>
                    <span className="text-xs text-zinc-400 font-bold uppercase block mb-1">Footwear</span>
                    <span className="font-medium">{outfit.items?.shoes || 'N/A'}</span>
                 </div>
               </div>
            </div>

            <div className="pt-4">
               <span className="text-xs text-zinc-400 font-bold uppercase block mb-3">Color Palette</span>
               <div className="flex space-x-2">
                  {outfit.colorPalette?.map((color, cIdx) => (
                    <div 
                      key={cIdx} 
                      className="w-8 h-8 rounded-full border border-zinc-200 shadow-sm"
                      style={{ backgroundColor: color }}
                      title={color}
                    ></div>
                  ))}
               </div>
            </div>
          </div>

          <div className="p-6 border-t border-zinc-100 bg-zinc-50">
             <button className="w-full py-3 bg-black text-white rounded-xl font-medium hover:bg-zinc-800 transition-colors">
                Shop This Look
             </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OutfitRecommender;
