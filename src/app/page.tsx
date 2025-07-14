"use client";
import React, { useState, useEffect, useRef } from 'react';
import { 
  Scale, 
  Upload, 
  MessageCircle, 
  FileText, 
  Users, 
  CheckCircle, 
  ArrowRight,
  Menu,
  X,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Play,
  Globe,
  Shield,
  Zap,
  Sparkles, Gavel, BookOpen,
  Languages, Bot,
  ArrowDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

const NyaySetuApp = () => {
  const [currentPage, setCurrentPage] = useState('landing');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      if (currentPage !== 'landing') return;
      
      const sections = ['home', 'how-it-works', 'about', 'team'];
      const scrollPosition = window.scrollY + 100;

      sections.forEach((section) => {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  // Landing page components (your existing code)
  const Navbar = () => (
    <nav className="fixed w-full z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Scale className="h-8 w-8 text-yellow-400" />
            <div>
              <h1 className="text-xl font-bold text-white">NYAY SETU</h1>
              <p className="text-xs text-gray-400">न्याय सेतु</p>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {[
                { name: 'Home', id: 'home' },
                { name: 'How it Works', id: 'how-it-works' },
                { name: 'About', id: 'about' },
                { name: 'Team', id: 'team' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeSection === item.id
                      ? 'text-yellow-400 bg-yellow-400/10'
                      : 'text-gray-300 hover:text-yellow-400'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => router.push('/login')}
              className="text-gray-300 hover:text-yellow-400 px-4 py-2 rounded-md font-medium transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => router.push('/signup')}
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-6 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
            >
              <Upload className="h-4 w-4" />
              <span>Get Started</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-400 hover:text-white"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-gray-900/95 backdrop-blur-md border-t border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {[
              { name: 'Home', id: 'home' },
              { name: 'How it Works', id: 'how-it-works' },
              { name: 'About', id: 'about' },
              { name: 'Team', id: 'team' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-yellow-400 hover:bg-gray-800"
              >
                {item.name}
              </button>
            ))}
            <div className="pt-4 space-y-2">
              <button
                onClick={() => setCurrentPage('login')}
                className="block w-full text-center border border-gray-600 text-gray-300 px-3 py-2 rounded-md font-medium hover:bg-gray-800"
              >
                Sign In
              </button>
              <button
                onClick={() => setCurrentPage('signup')}
                className="block w-full text-center bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-3 py-2 rounded-md font-medium"
              >
                Get Started →
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );

  const [stepIndex, ] = useState(0);
  
  const steps = [
    {
      icon: <Scale className="h-12 w-12 text-amber-400 mx-auto" />,
      title: "Justice Made Simple",
      detail: <p className="text-gray-300 text-sm leading-relaxed">Access legal assistance and guidance with Nyay Setu - your digital bridge to justice and legal empowerment.</p>
    },
    {
      icon: <Gavel className="h-12 w-12 text-blue-400 mx-auto" />,
      title: "Legal Expertise",
      detail: <p className="text-gray-300 text-sm leading-relaxed">Connect with qualified legal professionals and get expert advice for your legal matters with confidence.</p>
    },
    {
      icon: <Shield className="h-12 w-12 text-green-400 mx-auto" />,
      title: "Rights Protected",
      detail: <p className="text-gray-300 text-sm leading-relaxed">Understand and protect your legal rights with comprehensive resources and professional support.</p>
    },
    {
      icon: <Users className="h-12 w-12 text-purple-400 mx-auto" />,
      title: "Community Support",
      detail: <p className="text-gray-300 text-sm leading-relaxed">Join a community of legal seekers and professionals working together for accessible justice.</p>
    }
  ];

  const { icon, title, detail } = steps[stepIndex];

  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const videoRef = useRef(null);

  const closeVideo = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Stop and reset video when closing
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      videoRef.current.load(); // Force reload to reset completely
    }
    setIsVideoOpen(false);
  };

  const openVideo = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsVideoOpen(true);
  };


  // const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  const handleVideoClick = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = !video.muted;
      setIsMuted(video.muted);
    }
  };

  const HeroSection = () => (
    <section id="home" className="relative min-h-screen bg-gradient-to-t from-gray-900 via-gray-800 to-gray-900 flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 bg-yellow-400/10 text-yellow-300 px-4 py-2 rounded-full text-[12px] font-medium">
                <Shield className="h-4 w-4" />
                <span>AI-Powered Legal Assistant</span>
              </div>
              
              <h1 className="text-3xl lg:text-6xl font-bold text-white leading-tight">
                <span className="text-yellow-400">Justice,</span>
                <br />
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  In Every Voice.
                </span>
              </h1>
              
              <p className="text-xl text-gray-300 max-w-2xl leading-relaxed">
                NyaySetu is your AI-powered legal buddy that explains complex documents — in your language, through your voice.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => router.push('/upload-document')}
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 group"
              >
                <Upload className="h-5 w-5" />
                <span>Try Demo</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              {/* Button */}
      <button 
        onClick={openVideo}
        type="button"
        className="border-2 border-gray-600 hover:border-yellow-400 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
      >
        <Play className="h-5 w-5" />
        <span>How to Use?</span>
      </button>

      {/* Video Overlay */}
      {isVideoOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={closeVideo}
        >
          <div 
            className="relative bg-gray-900 rounded-lg p-6 max-w-4xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeVideo}
              className="absolute top-4 right-4 text-white hover:text-yellow-400 transition-colors duration-200 z-10"
              type="button"
            >
              <X className="h-8 w-8" />
            </button>

            {/* Video Container */}
            <div className="relative">
              <video
              ref={videoRef}
            className="!border-none rounded-4xl object-cover -mb-2.5"
            autoPlay
            muted={isMuted}
            loop
            onClick={handleVideoClick}
            playsInline>
            <source src="/Nyaysetuvideo.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
            </div>

            {/* Video Title */}
            <div className="mt-4 text-center">
              <h3 className="text-xl font-semibold text-white mb-2">
                How to Use - Tutorial Video
              </h3>
              <p className="text-gray-400 text-sm">
                Watch this video to learn how to use our platform effectively
              </p>
            </div>
          </div>
        </div>
      )}
            </div>

            <div className="flex items-center space-x-8 text-gray-400 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span>Free to Use</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-blue-400" />
                <span>Multi-Language</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-yellow-400" />
                <span>AI-Powered</span>
              </div>
            </div>
          </div>

          <div className='relative'>
          <div className="relative min-h-screen flex items-center justify-end">
      {/* Legal-themed background particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-amber-400 rounded-full animate-pulse opacity-70" />
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-400 rounded-full animate-ping opacity-60" />
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce opacity-50" />
        <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-purple-400 rounded-full animate-pulse opacity-60" />
        <div className="absolute top-1/2 left-1/6 w-1 h-1 bg-amber-300 rounded-full animate-ping opacity-40" />
      </div>

      <div className="relative">
        {/* Main Nyay Setu card */}
        <div className="relative z-10 bg-gradient-to-br from-gray-800/95 via-gray-900/95 to-black/95 backdrop-blur-xl rounded-3xl p-10 border border-amber-500/30 shadow-2xl h-[380px] max-w-lg mx-auto overflow-hidden">
          {/* Justice-themed background glows */}
          <div className="absolute -top-32 -left-32 w-80 h-80 bg-gradient-to-r from-amber-400/20 to-yellow-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse delay-500" />
          
          {/* Legal pattern overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(245,158,11,0.02)_1px,transparent_1px)] bg-[length:20px_20px]" />
          
          {/* Nyay Setu branding */}
          {/* <div className="absolute top-6 left-6 z-30">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-amber-400 to-yellow-500 p-2 rounded-lg">
                <Scale className="h-5 w-5 text-gray-900" />
              </div>
              <div>
                <h1 className="text-white font-bold text-lg tracking-wide">Nyay Setu</h1>
                <p className="text-amber-400 text-xs font-medium">न्याय सेतु</p>
              </div>
            </div>
          </div> */}
          
          {/* Content container */}
          <div className="relative z-20 h-full flex flex-col justify-center pt-8">

            {/* Animated content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={stepIndex}
                initial={{ opacity: 0, scale: 0.8, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -30 }}
                transition={{ 
                  duration: 0.8,
                  ease: [0.25, 0.25, 0.25, 0.75],
                  opacity: { duration: 0.4 }
                }}
                className="space-y-6 text-center"
              >
                {/* Icon with legal styling */}
                <motion.div
                  initial={{ scale: 0.5, rotate: 0 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-blue-400/20 rounded-full blur-xl" />
                  <div className="relative bg-gradient-to-br from-white/10 to-white/5 p-4 rounded-2xl border border-amber-400/30 backdrop-blur-sm">
                    {icon}
                  </div>
                </motion.div>

                {/* Title with justice-themed gradient */}
                <motion.h3 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent font-bold text-2xl tracking-wide"
                >
                  {title}
                </motion.h3>

                {/* Detail with enhanced styling */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="max-w-sm mx-auto"
                >
                  {detail}
                </motion.div>
                {/* Step indicator dots */}
            <div className="flex justify-center space-x-2 mb-8">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === stepIndex 
                      ? 'bg-amber-400 shadow-lg shadow-amber-400/50' 
                      : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Justice-themed floating icons */}
        <motion.div 
          className="absolute -top-8 -right-6 bg-gradient-to-r from-amber-400 to-yellow-500 text-gray-900 p-5 rounded-2xl shadow-2xl z-20"
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 5, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Scale className="h-10 w-10" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full opacity-90" />
        </motion.div>

        <motion.div 
          className="absolute -bottom-8 -left-8 bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-5 rounded-2xl shadow-2xl z-20"
          animate={{ 
            y: [0, -15, 0],
            rotate: [0, -5, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        >
          <MessageCircle className="h-10 w-10" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full opacity-90" />
        </motion.div>

        {/* Additional legal-themed floating elements */}
        <motion.div
          className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-amber-400 z-10"
          animate={{ 
            y: [0, -8, 0],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Gavel className="h-6 w-6" />
        </motion.div>

        <motion.div
          className="absolute -bottom-4 right-1/4 text-green-400 z-10"
          animate={{ 
            y: [0, -12, 0],
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        >
          <Shield className="h-5 w-5" />
        </motion.div>

        <motion.div
          className="absolute top-1/4 -left-4 text-blue-400 z-10"
          animate={{ 
            y: [0, -6, 0],
            opacity: [0.4, 0.9, 0.4]
          }}
          transition={{ 
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        >
          <FileText className="h-5 w-5" />
        </motion.div>

        <motion.div
          className="absolute bottom-1/3 -right-4 text-purple-400 z-10"
          animate={{ 
            y: [0, -10, 0],
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{ 
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5
          }}
        >
          <BookOpen className="h-5 w-5" />
        </motion.div>
      </div>
    </div>
    </div>
        </div>
      </div>
    </section>
  );

  const HowItWorksSection = () => {
  const [hoveredStep, setHoveredStep] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [visibleSteps, setVisibleSteps] = useState(new Set());
  const [showSummary, setShowSummary] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);
  const [showCTA, setShowCTA] = useState(false);
  const sectionRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || !lineRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Improved scroll progress calculation
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
      const sectionBottom = sectionTop + sectionHeight;
      
      if (sectionBottom > 0 && sectionTop < windowHeight) {
        // Calculate progress based on how much of the section has been scrolled through
        // const visibleHeight = Math.min(windowHeight, sectionBottom) - Math.max(0, sectionTop);
        const totalScrollableHeight = sectionHeight + windowHeight;
        const scrolledDistance = Math.max(0, windowHeight - sectionTop);
        
        const progress = Math.max(0, Math.min(1, scrolledDistance / totalScrollableHeight));
        setScrollProgress(progress);
      }

      // Check which steps are visible with more lenient conditions
      const stepElements = sectionRef.current.querySelectorAll('[data-step]');
      const newVisibleSteps = new Set();
      
      stepElements.forEach((element) => {
        const stepRect = element.getBoundingClientRect();
        // More lenient visibility check
        if (stepRect.top < windowHeight * 0.9 && stepRect.bottom > -100) {
          newVisibleSteps.add(parseInt(element.dataset.step));
        }
      });
      
      setVisibleSteps(newVisibleSteps);

      // Check visibility for summary, features, and CTA sections
      const summaryElement = sectionRef.current.querySelector('[data-summary]');
      const featuresElement = sectionRef.current.querySelector('[data-features]');
      const ctaElement = sectionRef.current.querySelector('[data-cta]');

      if (summaryElement) {
        const summaryRect = summaryElement.getBoundingClientRect();
        setShowSummary(summaryRect.top < windowHeight * 0.8 && summaryRect.bottom > 0);
      }

      if (featuresElement) {
        const featuresRect = featuresElement.getBoundingClientRect();
        setShowFeatures(featuresRect.top < windowHeight * 0.8 && featuresRect.bottom > 0);
      }

      if (ctaElement) {
        const ctaRect = ctaElement.getBoundingClientRect();
        setShowCTA(ctaRect.top < windowHeight * 0.8 && ctaRect.bottom > 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const steps = [
    {
      icon: Upload,
      title: "Upload PDF Document",
      description: "Upload your legal document in PDF format. Our system securely processes and extracts all text content from your document.",
      step: "01",
      color: "from-yellow-400 to-yellow-500",
      bgColor: "bg-black",
      iconColor: "text-yellow-400"
    },
    {
      icon: Languages,
      title: "Choose Your Language",
      description: "Select your preferred language from English, Hindi, Marathi, Gujarati, Punjabi, and all major Indian languages for personalized assistance.",
      step: "02",
      color: "from-yellow-400 to-yellow-500",
      bgColor: "bg-black",
      iconColor: "text-yellow-400"
    },
    {
      icon: Bot,
      title: "Meet Your AI Advocate",
      description: "Our intelligent AI advocate is ready to answer your questions about the document. Ask anything you need to understand better.",
      step: "03",
      color: "from-yellow-400 to-yellow-500",
      bgColor: "bg-black",
      iconColor: "text-yellow-400"
    },
    {
      icon: MessageCircle,
      title: "Get Friendly Explanations",
      description: "Receive clear, friendly responses in your selected language. Complex legal terms are explained in simple, understandable language.",
      step: "04",
      color: "from-yellow-400 to-yellow-500",
      bgColor: "bg-black",
      iconColor: "text-yellow-400"
    }
  ];

  return (
    <div id="how-it-works" ref={sectionRef} className="py-20 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-400 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-yellow-400 px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-5 h-5 text-black" />
            <span className="text-[10px] font-semibold text-black">AI-Powered Legal Assistant</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            How It 
            <span className="text-yellow-400"> Works</span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Transform complex legal documents into clear, understandable explanations with our AI advocate in your preferred Indian language
          </p>
        </div>

        {/* Process Flow */}
        <div className="relative">
          {/* Central Process Line with Animation */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-700 transform -translate-x-1/2 hidden md:block">
            <div 
              ref={lineRef}
              className="w-full bg-gradient-to-b from-yellow-400 via-yellow-500 to-yellow-400 transition-all duration-700 ease-out"
              style={{
                height: `${Math.min(95, scrollProgress * 140)}%`, // Improved height calculation
                boxShadow: scrollProgress > 0 ? '0 0 20px rgba(250, 204, 21, 0.5)' : 'none'
              }}
            ></div>
          </div>

          {/* Steps */}
          <div className="space-y-16">
            {steps.map((item, index) => (
              <div key={index} className="relative" data-step={index + 1}>
                {/* Step Card */}
                <div className={`flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} transition-all duration-1000 ${
                  visibleSteps.has(index + 1) ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
                }`}>
                  {/* Card Content */}
                  <div className={`w-full md:w-5/12  ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                    <div 
                      className={`relative p-8 rounded-2xl border-2 transition-all duration-500 transform hover:scale-105 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 cursor-pointer ${
                        hoveredStep === index ? 'border-yellow-400 shadow-2xl shadow-yellow-400/20' : 'border-gray-800 hover:border-gray-700'
                      } ${item.bgColor} ${visibleSteps.has(index + 1) ? 'animate-pulse-once' : ''}`}
                      onMouseEnter={() => setHoveredStep(index)}
                      onMouseLeave={() => setHoveredStep(null)}
                    >
                      {/* Step number */}
                      <div className={`absolute -top-4 ${index % 2 === 0 ? '-right-4' : '-left-4'} w-12 h-12 bg-gradient-to-r ${item.color} rounded-full flex items-center justify-center shadow-lg transition-all duration-500 ${
                        visibleSteps.has(index + 1) ? 'scale-100 rotate-0' : 'scale-0 rotate-180'
                      }`}>
                        <span className="text-black font-bold text-lg">{item.step}</span>
                      </div>

                      {/* Icon */}
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 ${item.bgColor} border border-gray-800 flex items-center justify-center mb-6 transition-all duration-700 ${
                        hoveredStep === index ? 'scale-110' : ''
                      } ${visibleSteps.has(index + 1) ? 'scale-100' : 'scale-0'}`}>
                        <item.icon className={`w-8 h-8 ${item.iconColor}`} />
                      </div>

                      {/* Content */}
                      <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                      <p className="text-gray-300 leading-relaxed text-lg">{item.description}</p>

                      {/* Hover effect overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 rounded-2xl transition-opacity duration-300 ${
                        hoveredStep === index ? 'opacity-5' : ''
                      }`}></div>
                    </div>
                  </div>

                  {/* Center Circle */}
                  <div className="hidden md:flex w-2/12 justify-center">
                    <div className={`w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg z-10 transition-all duration-700 ${
                      visibleSteps.has(index + 1) ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                    }`}>
                      <item.icon className="w-8 h-8 text-black" />
                    </div>
                  </div>

                  {/* Empty space for alternating layout */}
                  <div className="hidden md:block w-5/12"></div>
                </div>

                {/* Arrow Down (except for last item) */}
                {index < steps.length-1 && (
                  <div className="flex justify-center mt-8 md:mt-12">
                    <div className={`w-12 h-12 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 border-2 border-yellow-400 rounded-full flex items-center justify-center transition-all duration-500 ${
                      visibleSteps.has(index + 1) && visibleSteps.has(index + 2) ? 'animate-bounce opacity-100' : 'opacity-30'
                    }`}>
                      <ArrowDown className="w-6 h-6 text-yellow-400" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Process Summary */}
        <div 
          data-summary
          className={`mt-20 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 border border-gray-800 rounded-3xl p-8 shadow-xl transition-all duration-1000 ${
            showSummary ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
          }`}
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-4">Complete Process Overview</h3>
            <p className="text-gray-300 text-lg">From document upload to personalized legal explanations in your language</p>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-4 text-sm">
            <div className="flex items-center space-x-2 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 px-4 py-2 rounded-full">
              <Upload className="w-4 h-4 text-yellow-400" />
              <span className="text-white">PDF Upload</span>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-600" />
            <div className="flex items-center space-x-2 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 px-4 py-2 rounded-full">
              <FileText className="w-4 h-4 text-yellow-400" />
              <span className="text-white">Text Extraction</span>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-600" />
            <div className="flex items-center space-x-2 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 px-4 py-2 rounded-full">
              <Languages className="w-4 h-4 text-yellow-400" />
              <span className="text-white">Language Selection</span>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-600" />
            <div className="flex items-center space-x-2 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 px-4 py-2 rounded-full">
              <Bot className="w-4 h-4 text-yellow-400" />
              <span className="text-white">AI Analysis (ask your question)</span>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-600" />
            <div className="flex items-center space-x-2 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 px-4 py-2 rounded-full">
              <MessageCircle className="w-4 h-4 text-yellow-400" />
              <span className="text-white">Friendly Response</span>
            </div>
          </div>
        </div>

        {/* Feature highlights */}
        <div 
          data-features
          className={`mt-12 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 border border-gray-800 rounded-3xl p-8 shadow-xl transition-all duration-1000 delay-300 ${
            showFeatures ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 border border-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-yellow-400" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Secure Processing</h4>
              <p className="text-gray-300">Your documents are processed securely with end-to-end encryption</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 border border-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-yellow-400" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Multi-Language Support</h4>
              <p className="text-gray-300">Available in English, Hindi, Marathi, Gujarati, Punjabi & more</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 border border-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bot className="w-8 h-8 text-yellow-400" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">AI Advocate</h4>
              <p className="text-gray-300">Intelligent AI that understands legal context and nuances</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div 
          data-cta
          className={`text-center mt-16 transition-all duration-1000 delay-500 ${
            showCTA ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
          }`}
        >
          <button 
            className="group bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black px-12 py-6 rounded-full font-semibold text-xl transition-all duration-300 transform hover:scale-105 inline-flex items-center space-x-3 shadow-xl hover:shadow-2xl"
          >
            <span>Start Your Legal Journey</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
          
          <p className="text-gray-400 mt-6 text-sm">
            No credit card required • Free to start • Secure & Private
          </p>
        </div>
      </div>
    </div>
  );
};

  const AboutSection = () => (
    <section id="about" className="py-20 bg-gradient-to-t from-transparent to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-white mb-6">About NyaySetu</h2>
            <div className="space-y-6 text-gray-400">
              <p className="text-lg leading-relaxed">
                NyaySetu bridges the gap between complex legal documents and common understanding. 
                Our AI-powered platform makes legal information accessible to everyone, regardless of 
                their legal background or language preference.
              </p>
              <p className="leading-relaxed">
                We believe that justice should be accessible to all. That&apos;s why we&apos;ve created an 
                innovative solution that translates legal complexity into simple, understandable 
                language, empowering individuals to make informed decisions about their legal matters.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 mt-8">
              {[
                { number: "10K+", label: "Documents Processed" },
                { number: "15+", label: "Languages Supported" },
                { number: "98%", label: "Accuracy Rate" },
                { number: "24/7", label: "AI Availability" }
              ].map((stat, index) => (
                <div key={index} className="text-center p-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-yellow-400 rounded-lg">
                  <div className="text-3xl font-bold text-yellow-500 mb-2">{stat.number}</div>
                  <div className="text-sm text-gray-200">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl p-8 shadow-2xl">
              <div className="w-full h-full overflow-hidden">
          <img
            src="/about-us.webp"
            alt="About Us"
            className="w-full h-full object-cover rounded-t-3xl"
          />
        </div>
              {/* <div className="bg-gray-800 rounded-lg p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Scale className="h-4 w-4 text-white" />
                  </div>
                  <div className="text-sm font-medium text-gray-200">Legal Document Analysis</div>
                </div>
                <div className="space-y-2">
                  <div className="bg-gray-100 h-2 rounded-full">
                    <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <div className="text-xs text-green-500">Processing: Contract Analysis</div>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-200">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Key terms identified</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-200">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Risks highlighted</span>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  const TeamSection = () => (
    <section id="team" className="py-20 bg-gradient-to-b from-transparent to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-200 mb-4">Meet Our Team</h2>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Dedicated professionals working to make legal information accessible to everyone
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
  {
    name: "Pranav",
    role: "Backend Developer",
    description: "Seasoned backend developer with over 8 years of experience in natural language processing and machine learning, especially within the legal tech domain. Adept at building scalable APIs and intelligent systems.",
    image: "/pranav.jpg"
  },
  {
    name: "Nikhil Deshmukh",
    role: "Frontend Developer",
    description: "Frontend developer with a keen eye for detail and strong legal acumen. Merges constitutional and corporate law knowledge with UI/UX expertise to build intuitive, legally-aware user interfaces.",
    image: "/nikhil.png"
  },
  {
    name: "Somala Bharath Sai",
    role: "QA Specialist",
    description: "Quality assurance expert dedicated to delivering seamless user experiences. Passionate about accessibility, usability, and building inclusive digital products that reach everyone.",
    image: "https://ui-avatars.com/api/?name=Somala+Bharath+Sai&background=2E7D32&color=fff"
  }

          ].map((member, index) => (
            <div key={index} className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:border-2 hover:border-yellow-500 transition-all duration-300 transform hover:-translate-y-2">
              <div className="relative mb-6">
                <div className="w-full h-64 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                  <img src={member.image} alt={member.name} className='w-full h-full object-cover'/>
                </div>
                {/* <div className="absolute inset-0 bg-gradient-to-t from-white/50 to-transparent rounded-lg"></div> */}
              </div>
              <h3 className="text-xl font-semibold text-gray-200 mb-2">{member.name}</h3>
              <p className="text-yellow-500 font-medium mb-3">{member.role}</p>
              <p className="text-gray-300 text-sm leading-relaxed">{member.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const Footer = () => (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Scale className="h-8 w-8 text-yellow-400" />
              <div>
                <h3 className="text-xl font-bold">NYAY SETU</h3>
                <p className="text-sm text-gray-400">न्याय सेतु</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Making legal information accessible through AI-powered document analysis and explanation.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><button onClick={() => scrollToSection('home')} className="hover:text-yellow-400 transition-colors">Home</button></li>
              <li><button onClick={() => scrollToSection('how-it-works')} className="hover:text-yellow-400 transition-colors">How It Works</button></li>
              <li><button onClick={() => scrollToSection('about')} className="hover:text-yellow-400 transition-colors">About</button></li>
              <li><button onClick={() => scrollToSection('team')} className="hover:text-yellow-400 transition-colors">Team</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Disclaimer</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Support</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <div className="space-y-3 text-gray-400">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span className="text-sm">info@nyaysetu.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span className="text-sm">+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">Mumbai, India</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© 2024 NyaySetu. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Facebook className="h-5 w-5 text-gray-400 hover:text-yellow-400 cursor-pointer transition-colors" />
            <Twitter className="h-5 w-5 text-gray-400 hover:text-yellow-400 cursor-pointer transition-colors" />
            <Linkedin className="h-5 w-5 text-gray-400 hover:text-yellow-400 cursor-pointer transition-colors" />
            <Instagram className="h-5 w-5 text-gray-400 hover:text-yellow-400 cursor-pointer transition-colors" />
          </div>
        </div>
      </div>
    </footer>
  );

  const LandingPage = () => (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <HowItWorksSection />
      <AboutSection />
      <TeamSection />
      <Footer />
    </div>
  );

  // Main App Router
  const renderPage = () => {
    switch (currentPage) {
      default:
        return <LandingPage />;
    }
  };

  return renderPage();
};

export default NyaySetuApp;