
import React, { useState } from 'react';
import Layout from './components/Layout';
import ImageUploader from './components/ImageUploader';
import AnalysisResults from './components/AnalysisResults';
import OutfitRecommender from './components/OutfitRecommender';
import FashionChat from './components/FashionChat';
import ImageGenerator from './components/ImageGenerator';
import TrendFinder from './components/TrendFinder';
import { StyleRecommendations, Outfit } from './types';
import { analyzeImageAndRecommend, generateOutfitImage, saveToHistory, getHistory } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('analyze');
  const [analysisResult, setAnalysisResult] = useState<StyleRecommendations | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = async (base64: string) => {
    setIsLoading(true);
    try {
      // 1. Get Textual Analysis and Outfit Prompts
      const result = await analyzeImageAndRecommend(base64);
      
      // 2. Generate all images in parallel for better performance and single state update
      if (result.outfits && result.outfits.length > 0) {
        const imagePromises = result.outfits.map(outfit => 
          outfit.visualPrompt ? generateOutfitImage(outfit.visualPrompt) : Promise.resolve(null)
        );
        
        const imageUrls = await Promise.all(imagePromises);
        
        // 3. Enrich the result object with the generated image URLs
        result.outfits = result.outfits.map((outfit, index) => ({
          ...outfit,
          imageUrl: imageUrls[index] || undefined
        }));
      }

      // 4. Update the analysisResult state once with the complete data (text + images)
      setAnalysisResult(result);
      
      // 5. Save to backend history
      await saveToHistory(result.analysis, result.outfits);
      
      // 6. Transition to the results view
      setActiveTab('outfits');
    } catch (err) {
      console.error("Analysis failed:", err);
      alert("Failed to analyze image. Please try again with a clearer photo.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadHistory = async () => {
    const data = await getHistory();
    setHistory(data);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'analyze':
        return (
          <div className="space-y-12">
            <div className="text-center space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight gradient-text">Elevate Your Personal Style</h1>
              <p className="text-zinc-500 text-xl max-w-2xl mx-auto">Upload a photo to discover your unique style DNA and see high-fashion visualizations curated for your body type.</p>
            </div>
            <ImageUploader onUpload={handleImageUpload} isLoading={isLoading} />
            {analysisResult?.analysis && (
              <div className="mt-20">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="h-px flex-1 bg-zinc-200"></div>
                  <h2 className="text-2xl font-bold italic">Latest Analysis Result</h2>
                  <div className="h-px flex-1 bg-zinc-200"></div>
                </div>
                <AnalysisResults analysis={analysisResult.analysis} />
                <div className="text-center">
                   <button 
                     onClick={() => setActiveTab('outfits')}
                     className="bg-black text-white px-8 py-4 rounded-2xl font-bold hover:bg-zinc-800 transition-all shadow-xl"
                   >
                     View Outfits Recommendations
                   </button>
                </div>
              </div>
            )}
          </div>
        );
      case 'history':
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-4xl font-bold">Analysis History</h2>
              <button 
                onClick={loadHistory}
                className="text-zinc-500 hover:text-black"
              >
                <i className="fas fa-sync mr-2"></i> Refresh
              </button>
            </div>
            {history.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {history.map((entry) => (
                  <div key={entry.id} className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm hover:shadow-md transition-all cursor-pointer" onClick={() => {
                    setAnalysisResult({ analysis: entry.analysis, outfits: entry.outfits });
                    setActiveTab('outfits');
                  }}>
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">{new Date(entry.timestamp).toLocaleString()}</span>
                      <span className="bg-zinc-100 px-3 py-1 rounded-full text-xs font-bold">{entry.analysis.bodyType}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{entry.analysis.gender} - {entry.analysis.ageRange}</h3>
                    <p className="text-zinc-500 text-sm line-clamp-2">{entry.outfits.map((o: any) => o.title).join(', ')}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-zinc-200">
                <p className="text-zinc-400">No history found. Start by analyzing an image.</p>
                <button 
                  onClick={() => setActiveTab('analyze')}
                  className="mt-4 text-black font-bold underline"
                >
                  Analyze Now
                </button>
              </div>
            )}
          </div>
        );
      case 'outfits':
        return analysisResult?.analysis ? (
          <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
               <div>
                <h2 className="text-4xl font-bold mb-2">Visual Style Concepts</h2>
                <p className="text-zinc-500">Tailored for your {analysisResult.analysis.bodyType || 'unique'} frame and {analysisResult.analysis.facialFeatures?.shape || 'natural'} face shape.</p>
               </div>
               <button 
                onClick={() => setActiveTab('analyze')}
                className="text-zinc-500 hover:text-black font-medium"
               >
                 <i className="fas fa-redo mr-2"></i> New Analysis
               </button>
            </div>
            <OutfitRecommender outfits={analysisResult.outfits || []} />
          </div>
        ) : (
          <div className="text-center py-20 space-y-6">
            <div className="w-24 h-24 bg-zinc-100 rounded-full flex items-center justify-center mx-auto text-3xl text-zinc-300">
              <i className="fas fa-vest"></i>
            </div>
            <h3 className="text-2xl font-bold">No recommendations yet</h3>
            <p className="text-zinc-500">Upload a photo in the Analysis tab to generate your personal outfits.</p>
            <button 
              onClick={() => setActiveTab('analyze')}
              className="bg-black text-white px-8 py-3 rounded-full font-bold"
            >
              Get Started
            </button>
          </div>
        );
      case 'chat':
        return <FashionChat />;
      case 'generate':
        return <ImageGenerator />;
      case 'trends':
        return <TrendFinder />;
      case 'live':
        return (
          <div className="max-w-4xl mx-auto bg-zinc-900 text-white rounded-[3rem] p-10 min-h-[60vh] flex flex-col items-center justify-center text-center space-y-8">
            <div className="w-24 h-24 rounded-full border-4 border-white/20 flex items-center justify-center relative">
              <div className="absolute inset-0 rounded-full border-4 border-white border-t-transparent animate-spin"></div>
              <i className="fas fa-microphone text-3xl"></i>
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Live Style Consultation</h2>
              <p className="text-zinc-400 max-w-md mx-auto">Start a real-time voice session with Gemini to discuss your styling needs, get immediate feedback on outfit ideas, or talk through a wardrobe overhaul.</p>
            </div>
            <button className="bg-white text-black px-10 py-4 rounded-2xl font-bold hover:bg-zinc-200 transition-all transform hover:scale-105">
              Connect to Stylist
            </button>
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Powered by Gemini 2.5 Native Audio</p>
          </div>
        );
      default:
        return <div>Section coming soon...</div>;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

export default App;
