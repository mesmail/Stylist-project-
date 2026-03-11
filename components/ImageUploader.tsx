
import React, { useState, useRef } from 'react';

interface ImageUploaderProps {
  onUpload: (base64: string) => void;
  isLoading: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUpload, isLoading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreview(result);
        const base64Data = result.split(',')[1];
        onUpload(base64Data);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div 
        className={`relative border-2 border-dashed rounded-3xl p-10 transition-all text-center ${
          dragActive ? 'border-black bg-zinc-50' : 'border-zinc-200'
        } ${preview ? 'border-solid' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {preview ? (
          <div className="space-y-4">
            <img src={preview} alt="Upload preview" className="max-h-96 mx-auto rounded-2xl shadow-xl object-cover" />
            {!isLoading && (
              <button 
                onClick={() => setPreview(null)}
                className="text-red-500 text-sm font-medium hover:underline"
              >
                Choose a different photo
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto">
              <i className="fas fa-cloud-upload-alt text-3xl text-zinc-400"></i>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Upload a Full-Body Photo</h3>
              <p className="text-zinc-500 max-w-sm mx-auto">
                For best results, use a clear image with good lighting showing your full figure.
              </p>
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-zinc-800 transition-colors shadow-lg"
            >
              Select Image
            </button>
          </div>
        )}

        <input 
          ref={fileInputRef}
          type="file" 
          className="hidden" 
          accept="image/jpeg,image/png"
          onChange={handleChange}
        />

        {isLoading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center animate-fade-in">
            <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="font-semibold text-lg">Analyzing your style DNA...</p>
            <p className="text-zinc-500 text-sm mt-2">Gemini is processing facial features & body metrics</p>
          </div>
        )}
      </div>
      
      <div className="mt-8 flex items-center justify-center space-x-8 text-zinc-400 text-sm">
        <div className="flex items-center"><i className="fas fa-lock mr-2"></i> Private & Secure</div>
        <div className="flex items-center"><i className="fas fa-bolt mr-2"></i> AI-Powered Analysis</div>
      </div>
    </div>
  );
};

export default ImageUploader;
