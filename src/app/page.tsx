// / app/page.tsx
"use client";

import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';
import { Upload, ArrowRight, FileText, Zap, Users, Shield } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>('');

  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        setError('');
      } else {
        setError('Please select a PDF file only');
        setFile(null);
      }
    }
  }, []);

  const handleUploadAndNext = async () => {
    if (!file) {
      setError('Please select a PDF file first');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_BASE_URL}/upload-document`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.error || `Upload failed: ${response.status}`);
      }

      const data = await response.json();
      console.log("Document upload successful:", data);
      
      // Store upload info in session storage for next steps
      sessionStorage.setItem('uploadedDocument', JSON.stringify({
        filename: file.name,
        uploadedAt: new Date().toISOString(),
        ...data
      }));

      // Navigate to step 2
      router.push('/step2');
    } catch (error: unknown) {
      console.error("Upload failed:", error);
      setError(error instanceof Error ? error.message : 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleNext = () => {
    router.push('/step2');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Content */}
        <div className="text-white space-y-6">
          <div className="inline-block bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-sm font-medium">
            1/4
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
            Upload Legal Document
          </h1>
          
          <p className="text-lg text-slate-300 leading-relaxed">
            Our chatbot is built on the foundation of advanced AI and driven by a deeper purpose: 
            helping people communicate, solve problems, and find the information they need with ease 
            and understanding. As we continue to evolve, our focus remains on enhancing these 
            interactions and bringing technology closer to the heart of human conversation.
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-slate-300">PDF Analysis</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-green-400" />
              </div>
              <span className="text-slate-300">AI Powered</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-slate-300">Multi-language</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-red-400" />
              </div>
              <span className="text-slate-300">Secure</span>
            </div>
          </div>

          <button
            onClick={handleNext}
            className="inline-flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-semibold transition-colors"
          >
            <span>Next</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Right Upload Area */}
        <div className="flex justify-center lg:justify-end">
          <div className="w-full max-w-md">
            <div className="border-2 border-dashed border-orange-500/50 rounded-2xl p-8 text-center bg-slate-800/50 backdrop-blur-sm hover:border-orange-500/70 transition-colors">
              <div className="w-24 h-24 mx-auto mb-6 bg-slate-700/50 rounded-full flex items-center justify-center">
                <Upload className="w-12 h-12 text-slate-400" />
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-2">Upload Here</h3>
              <p className="text-slate-400 mb-6">Drag and drop your PDF file or click to browse</p>
              
              <div className="space-y-4">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-block w-full py-3 px-6 bg-slate-700 hover:bg-slate-600 text-white rounded-lg cursor-pointer transition-colors"
                >
                  Choose PDF File
                </label>
                
                {file && (
                  <div className="text-sm text-green-400 bg-green-500/10 p-3 rounded-lg">
                    ✓ {file.name} selected
                  </div>
                )}
                
                {error && (
                  <div className="text-sm text-red-400 bg-red-500/10 p-3 rounded-lg">
                    {error}
                  </div>
                )}
                
                <button
                  onClick={handleUploadAndNext}
                  disabled={!file || isUploading}
                  className="w-full py-3 px-6 bg-orange-500 hover:bg-orange-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                >
                  {isUploading ? 'Uploading...' : 'Upload & Continue'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}