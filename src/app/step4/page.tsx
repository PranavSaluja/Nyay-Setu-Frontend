// // app/step4/page.tsx
// "use client";

// import { useRouter } from 'next/navigation';
// import { useState, useCallback } from 'react';
// import { ArrowLeft, Download, Trash2, RefreshCw, CheckCircle } from 'lucide-react';

// export default function Step4Page() {
//   const router = useRouter();
//   const [isClearing, setIsClearing] = useState(false);
//   const [clearSuccess, setClearSuccess] = useState(false);
//   const [error, setError] = useState<string>('');

//   const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;

//   const handleClearDocument = useCallback(async () => {
//     setIsClearing(true);
//     setError('');

//     try {
//       const response = await fetch(`${API_BASE_URL}/clear-document`, {
//         method: "DELETE",
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.detail || errorData.error || `Clear failed: ${response.status}`);
//       }

//       setClearSuccess(true);
//       // Clear session storage
//       sessionStorage.removeItem('uploadedDocument');
      
//       setTimeout(() => {
//         router.push('/');
//       }, 2000);

//     } catch (error: unknown) {
//       console.error("Clear document failed:", error);
//       setError(error instanceof Error ? error.message : 'Failed to clear document');
//     } finally {
//       setIsClearing(false);
//     }
//   }, [router]);

//   const handleBack = () => {
//     router.push('/step3');
//   };

//   const handleStartOver = () => {
//     router.push('/');
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
//       <div className="max-w-4xl w-full">
//         <div className="text-center mb-8">
//           <div className="inline-block bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-sm font-medium mb-4">
//             4/4
//           </div>
//           <h1 className="text-4xl font-bold text-white mb-4">Session Management</h1>
//           <p className="text-slate-300 text-lg">
//             Complete your consultation or start a new session
//           </p>
//         </div>

//         <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 mb-8">
//           {clearSuccess ? (
//             <div className="text-center py-12">
//               <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-6" />
//               <h3 className="text-2xl font-semibold text-white mb-4">Session Cleared Successfully!</h3>
//               <p className="text-slate-300 mb-6">Redirecting you to start a new session...</p>
//               <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto"></div>
//             </div>
//           ) : (
//             <div className="space-y-8">
//               {/* Session Summary */}
//               <div className="bg-slate-700/50 rounded-xl p-6">
//                 <h3 className="text-xl font-semibold text-white mb-4">Session Summary</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="space-y-3">
//                     <div className="flex items-center justify-between">
//                       <span className="text-slate-400">Status:</span>
//                       <span className="text-green-400">Consultation Complete</span>
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <span className="text-slate-400">Document:</span>
//                       <span className="text-white">Processed</span>
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <span className="text-slate-400">Queries:</span>
//                       <span className="text-white">Answered</span>
//                     </div>
//                   </div>
//                   <div className="space-y-3">
//                     <div className="flex items-center justify-between">
//                       <span className="text-slate-400">Session Time:</span>
//                       <span className="text-white">Active</span>
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <span className="text-slate-400">Language:</span>
//                       <span className="text-white">Multi-language</span>
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <span className="text-slate-400">AI Response:</span>
//                       <span className="text-white">Generated</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Actions */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600">
//                   <div className="flex items-center space-x-3 mb-4">
//                     <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
//                       <Download className="w-6 h-6 text-blue-400" />
//                     </div>
//                     <div>
//                       <h4 className="text-white font-semibold">Download Session</h4>
//                       <p className="text-slate-400 text-sm">Save your consultation</p>
//                     </div>
//                   </div>
//                   <button className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
//                     Download Report
//                   </button>
//                 </div>

//                 <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600">
//                   <div className="flex items-center space-x-3 mb-4">
//                     <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
//                       <Trash2 className="w-6 h-6 text-red-400" />
//                     </div>
//                     <div>
//                       <h4 className="text-white font-semibold">Clear Session</h4>
//                       <p className="text-slate-400 text-sm">Remove current document</p>
//                     </div>
//                   </div>
//                   <button
//                     onClick={handleClearDocument}
//                     disabled={isClearing}
//                     className="w-full py-3 px-4 bg-red-500 hover:bg-red-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
//                   >
//                     {isClearing ? (
//                       <div className="flex items-center justify-center space-x-2">
//                         <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
//                         <span>Clearing...</span>
//                       </div>
//                     ) : (
//                       'Clear Document'
//                     )}
//                   </button>
//                 </div>
//               </div>

//               {/* Quick Actions */}
//               <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600">
//                 <h4 className="text-white font-semibold mb-4">Quick Actions</h4>
//                 <div className="flex flex-wrap gap-3">
//                   <button
//                     onClick={handleStartOver}
//                     className="flex items-center space-x-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
//                   >
//                     <RefreshCw className="w-4 h-4" />
//                     <span>New Session</span>
//                   </button>
//                   <button
//                     onClick={() => router.push('/step3')}
//                     className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors"
//                   >
//                     Ask Another Question
//                   </button>
//                 </div>
//               </div>

//               {error && (
//                 <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400">
//                   {error}
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         <div className="flex justify-between">
//           <button
//             onClick={handleBack}
//             disabled={clearSuccess}
//             className="flex items-center space-x-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-full transition-colors"
//           >
//             <ArrowLeft className="w-5 h-5" />
//             <span>Back</span>
//           </button>
          
//           <button
//             onClick={handleStartOver}
//             className="flex items-center space-x-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full transition-colors"
//           >
//             <RefreshCw className="w-5 h-5" />
//             <span>Start Over</span>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }