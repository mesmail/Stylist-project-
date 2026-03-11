
import React from 'react';
import { FashionAnalysis } from '../types';

interface AnalysisResultsProps {
  analysis: FashionAnalysis;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ analysis }) => {
  if (!analysis) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <i className="fas fa-venus-mars"></i>
          </div>
          <span className="text-zinc-500 text-sm font-medium uppercase tracking-wider">Gender</span>
        </div>
        <div className="text-2xl font-bold capitalize">{analysis.gender || 'Unknown'}</div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
            <i className="fas fa-birthday-cake"></i>
          </div>
          <span className="text-zinc-500 text-sm font-medium uppercase tracking-wider">Age Range</span>
        </div>
        <div className="text-2xl font-bold">{analysis.ageRange || 'Unknown'}</div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
            <i className="fas fa-running"></i>
          </div>
          <span className="text-zinc-500 text-sm font-medium uppercase tracking-wider">Body Type</span>
        </div>
        <div className="text-2xl font-bold">{analysis.bodyType || 'Unknown'}</div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <i className="fas fa-bullseye"></i>
          </div>
          <span className="text-zinc-500 text-sm font-medium uppercase tracking-wider">Confidence</span>
        </div>
        <div className="text-2xl font-bold">{((analysis.confidence || 0) * 100).toFixed(0)}%</div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm col-span-full">
        <h4 className="text-sm font-semibold uppercase tracking-widest text-zinc-400 mb-6 border-b border-zinc-100 pb-2">Facial Profile</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <p className="text-zinc-500 text-xs mb-1">Face Shape</p>
            <p className="text-lg font-semibold">{analysis.facialFeatures?.shape || 'Not detected'}</p>
          </div>
          <div>
            <p className="text-zinc-500 text-xs mb-1">Skin Tone Category</p>
            <div className="flex items-center space-x-2">
                <p className="text-lg font-semibold">{analysis.facialFeatures?.skinTone || 'Not detected'}</p>
            </div>
          </div>
          <div>
            <p className="text-zinc-500 text-xs mb-1">Hair Color</p>
            <p className="text-lg font-semibold">{analysis.facialFeatures?.hairColor || 'Not detected'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;
