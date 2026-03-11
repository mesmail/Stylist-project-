
import React, { useState } from 'react';
import { generateFashionVisual } from '../services/geminiService';

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [size, setSize] = useState('1K');
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);

  const handleGenerate = async () => {
    // Check for API key if needed (mock for UI)
    if (!(window as any).aistudio?.hasSelectedApiKey()) {
        setShowKeyModal(true);
        return;
    }

    if (!prompt.trim()) return;
    setIsLoading(true);
    try {
      const imageUrl = await generateFashionVisual(prompt, aspectRatio, size);
      setResult(imageUrl);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const openKeyPicker = async () => {
    await (window as any).aistudio.openSelectKey();
    setShowKeyModal(false);
    handleGenerate();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-xl">
        <h3 className="text-2xl font-bold mb-6">Imagine Your Style</h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Creative Prompt</label>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., A minimalist futuristic summer collection with linen fabrics and pastel tones..."
              className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl p-4 min-h-[100px] outline-none focus:ring-2 focus:ring-black transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Aspect Ratio</label>
              <select 
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-100 rounded-xl p-3 outline-none"
              >
                <option value="1:1">1:1 Square</option>
                <option value="3:4">3:4 Portrait</option>
                <option value="4:3">4:3 Landscape</option>
                <option value="9:16">9:16 Story</option>
                <option value="16:9">16:9 Cinematic</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Resolution</label>
              <select 
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-100 rounded-xl p-3 outline-none"
              >
                <option value="1K">1K Standard</option>
                <option value="2K">2K Professional</option>
                <option value="4K">4K Ultra HD</option>
              </select>
            </div>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim()}
            className="w-full py-4 bg-black text-white rounded-2xl font-bold hover:bg-zinc-800 transition-all disabled:opacity-50 flex items-center justify-center space-x-3 shadow-lg"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <i className="fas fa-sparkles"></i>
                <span>Generate Fashion Concept</span>
              </>
            )}
          </button>
        </div>
      </div>

      {result && (
        <div className="animate-fade-in space-y-4">
            <div className="bg-black p-2 rounded-[2rem] shadow-2xl overflow-hidden inline-block">
                <img src={result} alt="Generated fashion" className="rounded-[1.5rem] max-w-full" />
            </div>
            <div className="flex justify-center space-x-4">
                <button className="bg-white border border-zinc-200 px-6 py-2 rounded-full text-sm font-medium hover:bg-zinc-50">
                    <i className="fas fa-download mr-2"></i> Download
                </button>
                <button className="bg-white border border-zinc-200 px-6 py-2 rounded-full text-sm font-medium hover:bg-zinc-50">
                    <i className="fas fa-share-alt mr-2"></i> Share
                </button>
            </div>
        </div>
      )}

      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
                <h3 className="text-xl font-bold mb-4">API Key Required</h3>
                <p className="text-zinc-600 mb-6 leading-relaxed">
                    To use high-quality image generation (Imagen 3 Pro), you must select your own paid API key. 
                    Please refer to the <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-blue-600 underline">billing documentation</a>.
                </p>
                <div className="space-y-3">
                    <button 
                        onClick={openKeyPicker}
                        className="w-full py-3 bg-black text-white rounded-xl font-bold hover:bg-zinc-800 transition-all"
                    >
                        Select API Key
                    </button>
                    <button 
                        onClick={() => setShowKeyModal(false)}
                        className="w-full py-3 bg-zinc-100 text-zinc-600 rounded-xl font-medium"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default ImageGenerator;
