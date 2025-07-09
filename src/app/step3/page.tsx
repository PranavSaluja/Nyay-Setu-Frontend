"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  ArrowLeft,
  Mic,
  MicOff,
  Play,
  Pause,
  Volume2,
  Scale,
  RefreshCw,
} from "lucide-react";
// import { useRouter } from 'next/navigation';
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useRouter } from "next/navigation";

interface AskResponse {
  audio_response_base64: string;
  original_query: string;
  response_language: string;
  document_filename: string | null;
}

export default function EnhancedVoiceConsultation() {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [lastQuery, setLastQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [showListening, setShowListening] = useState(false);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [currentStep, setCurrentStep] = useState<
    "language" | "question" | "response"
  >("language");

  const audioRef = useRef<HTMLAudioElement>(null);
  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;

  const languages = [
    { code: "en", name: "English" },
    { code: "hi", name: "Hindi (हिन्दी)" },
    { code: "gu", name: "Gujarati (ગુજરાતી)" },
  ];

  const cleanupAudioUrl = useCallback(() => {
    if (audioUrl && audioUrl.startsWith("blob:")) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl("");
    }
  }, [audioUrl]);

  const createAudioFromBase64 = useCallback(
    async (base64Data: string): Promise<string> => {
      try {
        const binaryString = atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        const blob = new Blob([bytes], { type: "audio/mpeg" });
        return URL.createObjectURL(blob);
      } catch (error) {
        console.error("Base64 decode failed:", error);
        throw new Error("Invalid audio data");
      }
    },
    []
  );

  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang =
        selectedLanguage === "hi"
          ? "hi-IN"
          : selectedLanguage === "gu"
          ? "gu-IN"
          : "en-US";
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      speechSynthesis.speak(utterance);
    }
  };

  const startRecording = useCallback(async () => {
    setShowListening(true);
    setError("");
    cleanupAudioUrl();

    // AI says "Now speak"
    const listenText =
      selectedLanguage === "hi"
        ? "अब बोलें"
        : selectedLanguage === "gu"
        ? "હવે બોલો"
        : "Now speak";
    speakText(listenText);

    setTimeout(async () => {
      setIsRecording(true);
      setShowListening(false);

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const recorder = new MediaRecorder(stream, {
          mimeType: "audio/webm; codecs=opus",
        });

        const chunks: BlobPart[] = [];

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };

        recorder.onstop = async () => {
          setIsRecording(false);
          setIsLoading(true);

          const audioBlob = new Blob(chunks, {
            type: "audio/webm; codecs=opus",
          });
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);

          reader.onloadend = async () => {
            const base64Audio = (reader.result as string).split(",")[1];

            try {
              const response = await fetch(`${API_BASE_URL}/ask`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  audio_base64: base64Audio,
                  language: selectedLanguage,
                }),
              });

              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                  errorData.detail ||
                    errorData.error ||
                    `Error: ${response.status}`
                );
              }

              const data: AskResponse = await response.json();
              setLastQuery(data.original_query);

              if (data.audio_response_base64) {
                const newAudioUrl = await createAudioFromBase64(
                  data.audio_response_base64
                );
                setAudioUrl(newAudioUrl);
                setCurrentStep("response");
              }
            } catch (error: unknown) {
              console.error("Error during voice query:", error);
              setError(
                error instanceof Error
                  ? error.message
                  : "Failed to process query"
              );
            } finally {
              setIsLoading(false);
              stream.getTracks().forEach((track) => track.stop());
            }
          };
        };

        recorder.start();
        setMediaRecorder(recorder);
      } catch (error: unknown) {
        console.error("Microphone access failed:", error);
        setError("Microphone access denied. Please check permissions.");
        setIsRecording(false);
        setShowListening(false);
      }
    }, 1500);
  }, [selectedLanguage, cleanupAudioUrl, createAudioFromBase64]);

  const stopRecording = useCallback(() => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
    }
  }, [mediaRecorder]);

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setAiSpeaking(false);
      } else {
        audioRef.current.play();
        setAiSpeaking(true);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const selectLanguage = (langCode: string) => {
    setSelectedLanguage(langCode);
    setCurrentStep("question");
  };

  const askNewQuestion = () => {
    setCurrentStep("question");
    setLastQuery("");
    setAudioUrl("");
    setError("");
  };

  // const handleNext = () => {
  //   router.push('/step4');
  //   // console.log("Navigate to step 4");
  // };

  const handleBack = () => {
    if (currentStep === "response") {
      setCurrentStep("question");
    } else if (currentStep === "question") {
      setCurrentStep("language");
    } else {
      // router.push('/step2');
      console.log("Navigate to step 2");
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onended = () => {
        setIsPlaying(false);
        setAiSpeaking(false);
      };
    }
  }, [audioUrl]);

  const handleStartOver = () => {
  // Trigger clear-document API
  fetch(`${API_BASE_URL}/clear-document`, {
    method: 'POST',
  }).catch((err) => {
    console.error("Failed to clear document:", err);
  });

  // Immediately redirect to homepage
  router.push('/');
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-sm font-medium mb-4">
            2/2
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Voice Consultation
          </h1>
          <p className="text-slate-300 text-lg">
            Speak with your AI legal assistant about your document
          </p>
        </div>

        {/* Language Selection */}
        {currentStep === "language" && (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 mb-8">
            <div className="text-center mb-8">
              <Scale className="w-16 h-16 text-orange-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-4">
                Select Your Preferred Language
              </h3>
              <p className="text-slate-300">
                Choose the language for your consultation
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => selectLanguage(lang.code)}
                  className="p-6 rounded-xl border-2 border-slate-600 hover:border-orange-500 hover:bg-orange-500/10 text-slate-300 hover:text-white transition-all transform hover:scale-105"
                >
                  <div className="text-xl font-semibold mb-2">{lang.name}</div>
                  <div className="text-sm opacity-75">Click to select</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Question Section */}
        {currentStep === "question" && (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 mb-8">
            <div className="flex flex-col justify-center items-center text-center mb-8">
              {/* <MessageSquare className="w-16 h-16 text-blue-400 mx-auto mb-4" /> */}
              <div className="flex flex-col justify-center items-center">
                <DotLottieReact
                  src="https://lottie.host/7bc17d91-9eda-4480-9286-74e5813d07f0/YUMyOUzDjq.lottie"
                  loop
                  autoplay
                />
              </div>

              <h3 className="text-2xl font-semibold text-white mb-4">
                Ask Your Question
              </h3>
              <p className="text-slate-300">
                Speaking in:{" "}
                <span className="text-orange-400 font-medium">
                  {languages.find((l) => l.code === selectedLanguage)?.name}
                </span>
              </p>
            </div>

            <div className="text-center mb-8">
              <div className="flex justify-center space-x-4 mb-6">
                <button
                  onClick={startRecording}
                  disabled={isRecording || isLoading || showListening}
                  className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                    isRecording
                      ? "bg-red-500 animate-pulse shadow-lg shadow-red-500/50"
                      : showListening
                      ? "bg-yellow-500 animate-pulse shadow-lg shadow-yellow-500/50"
                      : "bg-orange-500 hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/50"
                  } disabled:bg-slate-600 disabled:cursor-not-allowed transform hover:scale-105`}
                >
                  {isRecording ? (
                    <MicOff className="w-10 h-10 text-white" />
                  ) : (
                    <Mic className="w-10 h-10 text-white" />
                  )}
                </button>

                {isRecording && (
                  <button
                    onClick={stopRecording}
                    className="w-24 h-24 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center transition-all transform hover:scale-105 shadow-lg shadow-red-500/50"
                  >
                    <MicOff className="w-10 h-10 text-white" />
                  </button>
                )}
              </div>

              <div className="text-lg text-slate-300 mb-4">
                {showListening ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <span className="ml-2">AI is speaking...</span>
                  </div>
                ) : isRecording ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                    <span>Recording... Click stop when finished</span>
                  </div>
                ) : isLoading ? (
                  <div className="flex flex-col items-center justify-center space-y-4 animate-pulse text-sm text-gray-300">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></div>
                    </div>
                    <span className="tracking-wide font-medium">
                      Processing your question...
                    </span>
                  </div>
                ) : (
                  "Click the microphone to start recording your question"
                )}
              </div>

              {lastQuery && (
                <div className="bg-slate-700/50 rounded-xl p-4 mb-4">
                  <p className="text-white font-medium mb-2">Your Question:</p>
                  <p className="text-slate-300">{lastQuery}</p>
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400">
                {error}
              </div>
            )}
          </div>
        )}

        {/* Response Section */}
        {currentStep === "response" && (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 mb-8">
            <div className="text-center mb-8">
              <div className="relative mx-auto w-40 h-40 mb-6">
                {/* AI Lawyer Avatar */}
                <div
                  className={`w-full h-full align-middle ${
                    aiSpeaking ? "animate-pulse" : ""
                  }`}
                >
                  <DotLottieReact
                    key={aiSpeaking ? "playing" : "paused"}
                    className="w-140 h-auto -translate-x-50 -translate-y-15"
                    src="https://lottie.host/bb47f2da-01d7-49a6-beda-6846c510403c/bm9bNo71sH.lottie"
                    loop
                    autoplay={aiSpeaking}
                  />
                  {/* </div> */}
                </div>

                {/* Speaking Animation Ring */}
                {aiSpeaking && (
                  <>
                    <div className="absolute -inset-2 rounded-full border-2 border-orange-400 animate-ping"></div>
                    <div
                      className="absolute -inset-4 rounded-full border-2 border-orange-300 animate-ping"
                      style={{ animationDelay: "0.3s" }}
                    ></div>
                    <div
                      className="absolute -inset-6 rounded-full border-2 border-orange-200 animate-ping"
                      style={{ animationDelay: "0.6s" }}
                    ></div>
                  </>
                )}

                {/* Thought Bubble when thinking */}
                {isLoading && (
                  <div className="absolute -top-8 -right-8 bg-white rounded-full px-3 py-2 shadow-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              <h3 className="text-2xl font-semibold text-white mb-2">
                {aiSpeaking ? "Speaking..." : "AI Legal Assistant"}
              </h3>
              <p className="text-slate-300">
                {aiSpeaking
                  ? "Listen carefully to my analysis"
                  : "Here's my analysis of your question"}
              </p>
            </div>

            {lastQuery && (
              <div className="bg-slate-700/30 rounded-xl p-6 mb-6">
                <div className="flex items-center space-x-3 mb-3">
                  <Volume2 className="w-5 h-5 text-blue-400" />
                  <span className="text-white font-medium">Your Question</span>
                </div>
                <p className="text-slate-300 bg-slate-800/50 rounded-lg p-4">
                  {lastQuery}
                </p>
              </div>
            )}

            {audioUrl && (
              <div className="bg-slate-700/30 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Scale className="w-5 h-5 text-orange-400" />
                  <span className="text-white font-medium">
                    Legal Analysis & Response
                  </span>
                </div>

                <div className="flex items-center space-x-4 mb-4">
                  <button
                    onClick={togglePlayback}
                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-all transform hover:scale-105 ${
                      isPlaying
                        ? "bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/50"
                        : "bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/50"
                    }`}
                  >
                    {isPlaying ? (
                      <Pause className="w-8 h-8 text-white" />
                    ) : (
                      <Play className="w-8 h-8 text-white" />
                    )}
                  </button>

                  <div className="flex-1 bg-slate-800/50 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm text-slate-300">
                        Audio Response
                      </span>
                    </div>
                    <audio
                      ref={audioRef}
                      src={audioUrl}
                      onEnded={() => setIsPlaying(false)}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      className="w-full"
                      controls
                    />
                  </div>
                </div>

                <div className="text-center mb-4">
                  <p className="text-slate-300 italic">
                    {isPlaying
                      ? "🎧 Listen to my professional legal analysis"
                      : "Click play to hear my detailed response"}
                  </p>
                </div>

                <button
                  onClick={askNewQuestion}
                  className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
                >
                  Ask Another Question
                </button>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          {currentStep === "response" && (
            <button
              onClick={handleStartOver}
              className="flex items-center space-x-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Start Over</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
