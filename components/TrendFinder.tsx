
import React, { useState } from 'react';
import { searchFashionTrends } from '../services/geminiService';

const TrendFinder: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{text: string, sources: any[]} | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsLoading(true);
    try {
      const data = await searchFashionTrends(query);
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4 mb-10">
        <h2 className="text-4xl font-bold tracking-tight">Stay Ahead of the Curve</h2>
        <p className="text-zinc-500 max-w-xl mx-auto">Get real-time insights into what's trending in global fashion capitals, powered by Google Search grounding.</p>
      </div>

      <form onSubmit={handleSearch} className="flex space-x-2">
        <div className="relative flex-1">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"></i>
            <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for '2025 Spring Streetwear Trends' or 'Sustainable Denim Brands'..."
                className="w-full bg-white border border-zinc-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-black transition-all shadow-lg"
            />
        </div>
        <button 
            type="submit"
            disabled={isLoading || !query.trim()}
            className="bg-black text-white px-8 rounded-2xl font-bold hover:bg-zinc-800 transition-all disabled:opacity-50"
        >
            {isLoading ? <i className="fas fa-spinner animate-spin"></i> : 'Discover'}
        </button>
      </form>

      {results && (
        <div className="bg-white rounded-[2.5rem] border border-zinc-100 shadow-xl p-8 space-y-6 animate-fade-in">
          <div className="prose prose-zinc max-w-none">
            <p className="text-zinc-700 leading-relaxed whitespace-pre-wrap">{results.text}</p>
          </div>
          
          {results.sources.length > 0 && (
            <div className="pt-6 border-t border-zinc-100">
              <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4">Verified Sources</h4>
              <div className="flex flex-wrap gap-3">
                {results.sources.map((src, i) => (
                  <a 
                    key={i} 
                    href={src.uri} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center space-x-2 bg-zinc-50 border border-zinc-100 px-4 py-2 rounded-xl text-sm font-medium hover:bg-zinc-100 transition-colors"
                  >
                    <i className="fas fa-link text-zinc-400 text-xs"></i>
                    <span className="truncate max-w-[200px]">{src.title || 'Source'}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TrendFinder;
