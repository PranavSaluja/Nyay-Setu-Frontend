// app/step2/page.tsx
"use client";

import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle, Clock, FileText, Download, Trash2, RefreshCw } from 'lucide-react';

interface DocumentStatus {
  document_loaded: boolean;
  filename?: string;
  processed_at?: string;
  summary_preview?: string;
  document_length?: number;
  message?: string;
}

export default function Step2Page() {
  const router = useRouter();
  const [documentStatus, setDocumentStatus] = useState<DocumentStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [isClearing, setIsClearing] = useState(false);
  const [clearSuccess, setClearSuccess] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;

  const checkDocumentStatus = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/status`);
      if (!response.ok) {
        throw new Error(`Status check failed: ${response.status}`);
      }
      const data: DocumentStatus = await response.json();
      setDocumentStatus(data);
      setIsLoading(false);
    } catch (error: unknown) {
      console.error("Failed to check document status:", error);
      setError(error instanceof Error ? error.message : 'Failed to check status');
      setIsLoading(false);
    }
  }, [API_BASE_URL]);

  const handleClearDocument = async () => {
    setIsClearing(true);
    try {
      const response = await fetch(`${API_BASE_URL}/clear`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error(`Clear failed: ${response.status}`);
      }
      setClearSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (error: unknown) {
      console.error("Failed to clear document:", error);
      setError(error instanceof Error ? error.message : 'Failed to clear document');
    } finally {
      setIsClearing(false);
    }
  };

  const handleStartOver = () => {
    router.push('/');
  };

  useEffect(() => {
    checkDocumentStatus();
    
    // Poll for status updates every 3 seconds if document is not loaded
    const interval = setInterval(() => {
      if (!documentStatus?.document_loaded) {
        checkDocumentStatus();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [checkDocumentStatus, documentStatus?.document_loaded]);

  const handleNext = () => {
    if (documentStatus?.document_loaded) {
      router.push('/step3');
    }
  };

  const handleBack = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <div className="inline-block bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-sm font-medium mb-4">
            2/4
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Document Processing</h1>
          <p className="text-slate-300 text-lg">
            We are analyzing your legal document to prepare personalized assistance
          </p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 mb-8">
          {clearSuccess ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-white mb-4">Session Cleared Successfully!</h3>
              <p className="text-slate-300 mb-6">Redirecting you to start a new session...</p>
              <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto"></div>
            </div>
          ) : isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-slate-300">Checking document status...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-400 text-xl">!</span>
              </div>
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={checkDocumentStatus}
                className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
              >
                Retry
              </button>
            </div>
          ) : documentStatus?.document_loaded ? (
            <div className="space-y-8">
              {/* Session Summary */}
              <div className="bg-slate-700/50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Session Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Status:</span>
                      <span className="text-green-400">Document Ready</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Document:</span>
                      <span className="text-white">Processed</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Filename:</span>
                      <span className="text-white">{documentStatus.filename || 'Unknown'}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Processed:</span>
                      <span className="text-white">
                        {documentStatus.processed_at 
                          ? new Date(documentStatus.processed_at).toLocaleString()
                          : 'Just now'
                        }
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Language:</span>
                      <span className="text-white">Multi-language</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">AI Response:</span>
                      <span className="text-white">Ready</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Document Details */}
              {documentStatus.summary_preview && (
                <div className="bg-slate-700/50 rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <FileText className="w-5 h-5 text-blue-400" />
                    <span className="text-white font-medium">Document Summary</span>
                  </div>
                  <p className="text-white bg-slate-800 rounded-lg p-4 text-sm">
                    {documentStatus.summary_preview}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                      <Download className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">Download Session</h4>
                      <p className="text-slate-400 text-sm">Save your consultation</p>
                    </div>
                  </div>
                  <button className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                    Download Report
                  </button>
                </div>

                <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                      <Trash2 className="w-6 h-6 text-red-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">Clear Session</h4>
                      <p className="text-slate-400 text-sm">Remove current document</p>
                    </div>
                  </div>
                  <button
                    onClick={handleClearDocument}
                    disabled={isClearing}
                    className="w-full py-3 px-4 bg-red-500 hover:bg-red-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                  >
                    {isClearing ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                        <span>Clearing...</span>
                      </div>
                    ) : (
                      'Clear Document'
                    )}
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600">
                <h4 className="text-white font-semibold mb-4">Quick Actions</h4>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleStartOver}
                    className="flex items-center space-x-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>New Session</span>
                  </button>
                  <button
                    onClick={() => router.push('/step3')}
                    className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors"
                  >
                    Ask Another Question
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-center mb-6">
                <Clock className="w-16 h-16 text-orange-400 animate-pulse" />
              </div>

              <div className="text-center">
                <h3 className="text-2xl font-semibold text-white mb-2">Processing Document...</h3>
                <p className="text-slate-300">
                  Please wait while we analyze your document. This may take a few moments.
                </p>
              </div>

              <div className="bg-slate-700/50 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                  <span className="text-slate-300">Analyzing document structure...</span>
                </div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse delay-100"></div>
                  <span className="text-slate-300">Extracting legal content...</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse delay-200"></div>
                  <span className="text-slate-300">Preparing AI consultation...</span>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 mt-4">
              {error}
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <button
            onClick={handleBack}
            disabled={clearSuccess}
            className="flex items-center space-x-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          
          <button
            onClick={documentStatus?.document_loaded ? handleNext : handleStartOver}
            className="flex items-center space-x-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full transition-colors"
          >
            {documentStatus?.document_loaded ? (
              <>
                <span>Next</span>
                <ArrowRight className="w-5 h-5" />
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5" />
                <span>Start Over</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}