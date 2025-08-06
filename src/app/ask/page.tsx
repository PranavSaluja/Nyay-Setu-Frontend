"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Mic,
  MicOff,
  Scale,
  RefreshCw,
  CheckCircle,
  Volume2,
  VolumeX,
} from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useRouter } from "next/navigation";

interface AskResponse {
  audio_response_base64: string;
  original_query: string;
  response_language: string;
  document_filename: string | null;
}

interface ConversationItem {
  type: "user" | "ai";
  text: string;
  audioUrl?: string;
  timestamp: Date;
}

export default function EnhancedVoiceConsultation() {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [currentStep, setCurrentStep] = useState<
    "language" | "conversation" | "complete"
  >("language");
  const [conversation, setConversation] = useState<ConversationItem[]>([]);
  const [recordingTimeout, setRecordingTimeout] =
    useState<NodeJS.Timeout | null>(null);
  const [hasWelcomed, setHasWelcomed] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const conversationEndRef = useRef<HTMLDivElement>(null);
  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;

  const languages = [
    { code: "en", name: "English" },
    { code: "hi", name: "Hindi (हिन्दी)" },
    { code: "gu", name: "Gujarati (ગુજરાતી)" },
  ];

  const welcomeMessages = {
    en: "Welcome! I'm your AI legal assistant. I have analyzed your document and I'm ready to answer your questions. Please go ahead and ask me anything.",
    hi: "स्वागत है! मैं आपका AI कानूनी सहायक हूं। मैंने आपके दस्तावेज़ का विश्लेषण किया है और आपके प्रश्नों का उत्तर देने के लिए तैयार हूं। कृपया आगे बढ़ें और मुझसे कुछ भी पूछें।",
    gu: "સ્વાગત છે! હું તમારો AI કાનૂની સહાયક છું. મેં તમારા દસ્તાવેજનું વિશ્લેષણ કર્યું છે અને તમારા પ્રશ્નોના જવાબ આપવા માટે તૈયાર છું. કૃપા કરીને આગળ વધો અને મને કંઈપણ પૂછો.",
  };

  const processingMessages = {
    en: "I understand your question about the document. Let me analyze it and create a comprehensive answer for you. Please wait a moment.",
    hi: "मैं दस्तावेज़ के बारे में आपके प्रश्न को समझता हूं। मुझे इसका विश्लेषण करने और आपके लिए एक व्यापक उत्तर बनाने दें। कृपया एक क्षण प्रतीक्षा करें।",
    gu: "હું દસ્તાવેજ વિશેના તમારા પ્રશ્નને સમજું છું. મને તેનું વિશ્લેષણ કરવા દો અને તમારા માટે એક વ્યાપક જવાબ બનાવવા દો. કૃપા કરીને એક ક્ષણ રાહ જુઓ.",
  };

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

  const speakText = useCallback(
    (text: string, onEnd?: () => void, isProfessional = false) => {
      if ("speechSynthesis" in window) {
        // Cancel any ongoing speech
        speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang =
          selectedLanguage === "hi"
            ? "hi-IN"
            : selectedLanguage === "gu"
            ? "gu-IN"
            : "en-US";

        if (isProfessional) {
          // Professional voice settings
          utterance.rate = 0.8;
          utterance.pitch = 0.9;
          utterance.volume = 1.0;

          // Try to select a male voice if available
          const voices = speechSynthesis.getVoices();
          const maleVoice = voices.find(
            (voice) =>
              voice.lang &&
              // English Male Voices
              (voice.name.toLowerCase().includes("joey") ||
                // Google Voices (generic)
                voice.name.toLowerCase().includes("google") ||
                // Hindi Male Voices
                voice.name.toLowerCase().includes("hemant") ||
                (voice.lang.toLowerCase() === "hi-in" &&
                  voice.name.toLowerCase().includes("standard-b")) ||
                // Marathi Male Voices
                voice.name.toLowerCase().includes("ravindra") ||
                (voice.lang.toLowerCase() === "mr-in" &&
                  voice.name.toLowerCase().includes("standard-b")) ||
                // Gujarati Male Voice
                voice.name.toLowerCase().includes("gujarati") ||
                (voice.lang.toLowerCase() === "gu-in" &&
                  voice.name.toLowerCase().includes("standard-b")) ||
                // Fallback English
                voice.name.toLowerCase().includes("english"))
          );

          if (maleVoice) {
            utterance.voice = maleVoice;
          }
        } else {
          utterance.rate = 0.9;
          utterance.pitch = 1.1;
        }

        utterance.onstart = () => {
          setIsAiSpeaking(true);
          videoRef.current?.play();
        };

        utterance.onend = () => {
          setIsAiSpeaking(false);
          // Reset video to first frame (0.0 time) and pause
          if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
          }
          if (onEnd) onEnd();
        };

        speechSynthesis.speak(utterance);
      }
    },
    [selectedLanguage]
  );

  const playAIResponse = useCallback(async (audioUrl: string) => {
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      setIsAiSpeaking(true);
      videoRef.current?.play();

      try {
        await audioRef.current.play();
      } catch (error) {
        console.error("Audio playback failed:", error);
        setIsAiSpeaking(false);
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
      }
    }
  }, []);

  const askForNextQuestion = useCallback(() => {
    const nextQuestionMessages = {
      en: "Do you have any other questions about your document? I'm here to help.",
      hi: "क्या आपके पास अपने दस्तावेज़ के बारे में कोई अन्य प्रश्न है? मैं यहाँ आपकी सहायता के लिए हूँ।",
      gu: "શું તમારી પાસે તમારા દસ્તાવેજ વિશે કોઈ અન્ય પ્રશ્નો છે? હું અહીં તમારી મદદ કરવા માટે છું.",
    };

    speakText(
      nextQuestionMessages[
        selectedLanguage as keyof typeof nextQuestionMessages
      ],
      () => {
        // Auto-open microphone after asking for next question
        setTimeout(async () => {
          setError("");

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

              // Show processing message
              speakText(
                processingMessages[
                  selectedLanguage as keyof typeof processingMessages
                ],
                undefined,
                true
              );

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
                    headers: { "Content-Type": "application/json" },
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

                  // Add user question to conversation
                  const userMessage: ConversationItem = {
                    type: "user",
                    text: data.original_query,
                    timestamp: new Date(),
                  };

                  if (data.audio_response_base64) {
                    const audioUrl = await createAudioFromBase64(
                      data.audio_response_base64
                    );

                    // Add AI response to conversation
                    const aiMessage: ConversationItem = {
                      type: "ai",
                      text: "AI Response",
                      audioUrl: audioUrl,
                      timestamp: new Date(),
                    };

                    setConversation((prev) => [
                      ...prev,
                      userMessage,
                      aiMessage,
                    ]);

                    // Play AI response
                    setTimeout(() => {
                      playAIResponse(audioUrl);
                    }, 1000);
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
            setIsRecording(true);

            // Auto-stop recording after silence detection (7 seconds)
            const timeout = setTimeout(() => {
              if (recorder.state === "recording") {
                recorder.stop();
              }
            }, 7000);

            setRecordingTimeout(timeout);
          } catch (error: unknown) {
            console.error("Microphone access failed:", error);
            setError("Microphone access denied. Please check permissions.");
          }
        }, 1000);
      }
    );
  }, [
    selectedLanguage,
    speakText,
    processingMessages,
    createAudioFromBase64,
    playAIResponse,
    API_BASE_URL,
  ]);

  const startRecording = useCallback(async () => {
    setError("");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
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

        // Show processing message
        speakText(
          processingMessages[
            selectedLanguage as keyof typeof processingMessages
          ],
          undefined,
          true
        );

        const audioBlob = new Blob(chunks, { type: "audio/webm; codecs=opus" });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);

        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(",")[1];

          try {
            const response = await fetch(`${API_BASE_URL}/ask`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
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

            // Add user question to conversation
            const userMessage: ConversationItem = {
              type: "user",
              text: data.original_query,
              timestamp: new Date(),
            };

            if (data.audio_response_base64) {
              const audioUrl = await createAudioFromBase64(
                data.audio_response_base64
              );

              // Add AI response to conversation
              const aiMessage: ConversationItem = {
                type: "ai",
                text: "AI Response", // You might want to get text response from API
                audioUrl: audioUrl,
                timestamp: new Date(),
              };

              setConversation((prev) => [...prev, userMessage, aiMessage]);

              // Play AI response
              setTimeout(() => {
                playAIResponse(audioUrl);
              }, 1000);
            }
          } catch (error: unknown) {
            console.error("Error during voice query:", error);
            setError(
              error instanceof Error ? error.message : "Failed to process query"
            );
          } finally {
            setIsLoading(false);
            stream.getTracks().forEach((track) => track.stop());
          }
        };
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);

      // Auto-stop recording after silence detection (7 seconds)
      const timeout = setTimeout(() => {
        if (recorder.state === "recording") {
          recorder.stop();
        }
      }, 7000);

      setRecordingTimeout(timeout);
    } catch (error: unknown) {
      console.error("Microphone access failed:", error);
      setError("Microphone access denied. Please check permissions.");
    }
  }, [
    selectedLanguage,
    createAudioFromBase64,
    playAIResponse,
    processingMessages,
    askForNextQuestion,
  ]);

  const stopRecording = useCallback(() => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
    }
    if (recordingTimeout) {
      clearTimeout(recordingTimeout);
      setRecordingTimeout(null);
    }
  }, [mediaRecorder, recordingTimeout]);

  const selectLanguage = useCallback((langCode: string) => {
    setSelectedLanguage(langCode);
    setCurrentStep("conversation");
  }, []);

  const startWelcome = useCallback(() => {
    if (!hasWelcomed) {
      setHasWelcomed(true);
      setTimeout(() => {
        speakText(
          welcomeMessages[selectedLanguage as keyof typeof welcomeMessages],
          () => {
            // Auto-start recording after welcome message
            setTimeout(async () => {
              setError("");

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

                  // Show processing message
                  speakText(
                    processingMessages[
                      selectedLanguage as keyof typeof processingMessages
                    ],
                    undefined,
                    true
                  );

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
                        headers: { "Content-Type": "application/json" },
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

                      // Add user question to conversation
                      const userMessage: ConversationItem = {
                        type: "user",
                        text: data.original_query,
                        timestamp: new Date(),
                      };

                      if (data.audio_response_base64) {
                        const audioUrl = await createAudioFromBase64(
                          data.audio_response_base64
                        );

                        // Add AI response to conversation
                        const aiMessage: ConversationItem = {
                          type: "ai",
                          text: "AI Response",
                          audioUrl: audioUrl,
                          timestamp: new Date(),
                        };

                        setConversation((prev) => [
                          ...prev,
                          userMessage,
                          aiMessage,
                        ]);

                        // Play AI response
                        setTimeout(() => {
                          playAIResponse(audioUrl);
                        }, 1000);
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
                setIsRecording(true);

                // Auto-stop recording after silence detection (7 seconds)
                const timeout = setTimeout(() => {
                  if (recorder.state === "recording") {
                    recorder.stop();
                  }
                }, 7000);

                setRecordingTimeout(timeout);
              } catch (error: unknown) {
                console.error("Microphone access failed:", error);
                setError("Microphone access denied. Please check permissions.");
              }
            }, 1000);
          },
          true
        ); // Use professional voice for welcome
      }, 1000);
    }
  }, [
    hasWelcomed,
    selectedLanguage,
    speakText,
    processingMessages,
    createAudioFromBase64,
    playAIResponse,
    API_BASE_URL,
  ]);

  const completeConsultation = useCallback(() => {
    setCurrentStep("complete");
    const thankYouMessage =
      selectedLanguage === "hi"
        ? "धन्यवाद! आपकी सहायता करके खुशी हुई। मुझे आशा है कि मैं आपके सवालों का जवाब दे पाया।"
        : selectedLanguage === "gu"
        ? "આભાર! તમારી સહાયતા કરીને આનંદ થયો. મને આશા છે કે હું તમારા પ્રશ્નોના જવાબ આપી શક્યો."
        : "Thank you! It was a pleasure helping you. I hope I was able to answer your questions satisfactorily.";

    speakText(
      thankYouMessage,
      () => {
        setTimeout(() => {
          router.push("/");
        }, 3000);
      },
      true
    ); // Use professional voice for goodbye
  }, [selectedLanguage, speakText, router]);

  const handleStartOver = useCallback(() => {
    fetch(`${API_BASE_URL}/clear-document`, { method: "POST" }).catch((err) => {
      console.error("Failed to clear document:", err);
    });
    router.push("/");
  }, [router, API_BASE_URL]);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  // Start welcome message when entering conversation
  useEffect(() => {
    if (currentStep === "conversation") {
      startWelcome();
    }
  }, [currentStep, startWelcome]);

  // Audio event handlers
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onended = () => {
        setIsAiSpeaking(false);
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0; // Reset to first frame
        }
        // Ask for next question after AI response ends
        setTimeout(() => {
          askForNextQuestion();
        }, 1000);
      };

      audioRef.current.onplay = () => {
        setIsAiSpeaking(true);
        videoRef.current?.play();
      };

      audioRef.current.onpause = () => {
        setIsAiSpeaking(false);
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0; // Reset to first frame
        }
      };
    }
  }, [askForNextQuestion]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Language Selection */}
      {currentStep === "language" && (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-4xl w-full">
            <div className="text-center mb-8">
              <div className="inline-block bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm font-medium mb-4">
                2/2
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">
                Voice Consultation
              </h1>
              <p className="text-slate-300 text-lg">
                Speak with your AI legal assistant about your document
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8">
              <div className="text-center mb-8">
                <Scale className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
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
                    className="p-6 rounded-xl border-2 border-slate-600 hover:border-yellow-500 hover:bg-yellow-500/10 text-slate-300 hover:text-white transition-all transform hover:scale-105"
                  >
                    <div className="text-xl font-semibold mb-2">
                      {lang.name}
                    </div>
                    <div className="text-sm opacity-75">Click to select</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conversation Interface */}
      {currentStep === "conversation" && (
        <div className="w-screen h-screen relative overflow-hidden bg-black">
          {/* Fullscreen AI Video */}
          <video
            ref={videoRef}
            src="/ai-avatar.mp4"
            muted
            loop
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover z-0"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/30 z-10"></div>

          {/* Main Interface */}
          <div className="relative z-20 h-full flex flex-col">
            {/* Header */}
            <div className="p-4 bg-gradient-to-b from-black/60 to-transparent">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
                  <span className="text-white font-medium">
                    AI Legal Assistant -{" "}
                    {languages.find((l) => l.code === selectedLanguage)?.name}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {isAiSpeaking ? (
                    <Volume2 className="w-5 h-5 text-yellow-400" />
                  ) : (
                    <VolumeX className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </div>
            </div>

            {/* Conversation History */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {conversation.map((item, index) => (
                <div
                  key={index}
                  className={`flex ${
                    item.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      item.type === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-slate-800/80 text-slate-100 border border-slate-700"
                    }`}
                  >
                    <p className="text-sm">{item.text}</p>
                    <span className="text-xs opacity-60">
                      {item.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={conversationEndRef} />
            </div>

            {/* Controls */}
            <div className="p-6 bg-gradient-to-t from-black/80 to-transparent">
              {/* Status Display */}
              <div className="text-center mb-6">
                {isLoading ? (
                  <div className="flex flex-col items-center space-y-3">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-3 h-3 bg-yellow-600 rounded-full animate-bounce"></div>
                    </div>
                    <span className="text-white text-sm">
                      Processing your question...
                    </span>
                  </div>
                ) : isRecording ? (
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-4 h-4 bg-red-400 rounded-full animate-pulse"></div>
                    <span className="text-white text-sm">
                      Listening... (Auto-stop in a few seconds)
                    </span>
                  </div>
                ) : isAiSpeaking ? (
                  <div className="flex flex-col items-center space-y-3">
                    <DotLottieReact
                      src="https://lottie.host/7bc17d91-9eda-4480-9286-74e5813d07f0/YUMyOUzDjq.lottie"
                      loop
                      autoplay
                      style={{ width: 60, height: 60 }}
                    />
                    <span className="text-white text-sm">
                      AI is speaking...
                    </span>
                  </div>
                ) : (
                  <span className="text-slate-300 text-sm">
                    Tap the microphone to ask a question
                  </span>
                )}
              </div>

              {/* Control Buttons */}
              <div className="flex justify-center items-center space-x-4">
                <button
                  onClick={startRecording}
                  disabled={isRecording || isLoading || isAiSpeaking}
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                    isRecording
                      ? "bg-red-500 animate-pulse shadow-lg shadow-red-500/50"
                      : "bg-yellow-500 hover:bg-yellow-600 hover:shadow-lg hover:shadow-yellow-500/50"
                  } disabled:bg-slate-600 disabled:cursor-not-allowed transform hover:scale-105`}
                >
                  {isRecording ? (
                    <MicOff className="w-8 h-8 text-white" />
                  ) : (
                    <Mic className="w-8 h-8 text-white" />
                  )}
                </button>

                {isRecording && (
                  <button
                    onClick={stopRecording}
                    className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center transition-all transform hover:scale-105"
                  >
                    <MicOff className="w-8 h-8 text-white" />
                  </button>
                )}

                <button
                  onClick={completeConsultation}
                  disabled={isLoading || isRecording}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-medium shadow-md disabled:bg-slate-600 disabled:cursor-not-allowed"
                >
                  <CheckCircle className="w-5 h-5 inline mr-2" />
                  Complete
                </button>

                <button
                  onClick={handleStartOver}
                  disabled={isLoading || isRecording}
                  className="px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-full font-medium shadow-md disabled:cursor-not-allowed"
                >
                  <RefreshCw className="w-5 h-5 inline mr-2" />
                  Start Over
                </button>
              </div>

              {error && (
                <div className="mt-4 bg-red-500/20 border border-red-500/40 rounded-xl p-3 text-red-300 text-center text-sm">
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Hidden Audio Element */}
          <audio ref={audioRef} />
        </div>
      )}

      {/* Completion Screen */}
      {currentStep === "complete" && (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-900/20 via-slate-800 to-slate-900">
          <div className="text-center">
            <CheckCircle className="w-24 h-24 text-green-400 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-white mb-4">
              Consultation Complete
            </h1>
            <p className="text-slate-300 text-lg mb-6">
              Thank you for using our AI legal assistant!
            </p>
            <div className="flex space-x-2 justify-center">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce [animation-delay:0.1s]"></div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
            </div>
            <p className="text-slate-400 text-sm mt-4">
              Redirecting to homepage...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
