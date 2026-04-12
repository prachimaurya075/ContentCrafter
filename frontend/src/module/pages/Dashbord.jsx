import React, { useState, useEffect, useRef } from "react";
import { auth } from "../services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import hero1 from "../../assets/hero1.jpg";
import hero2 from "../../assets/hero2.jpg";
import hero3 from "../../assets/hero3.jpg";
import genre1 from "../../assets/genre1.jpg"
import chat from "../../assets/chat.jpg";
import trending from "../../assets/trendytopics.jpg";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const [activeModal, setActiveModal] = useState(null);
  const navigate = useNavigate();
  const featuresRef = useRef(null);
  const aboutRef = useRef(null);
  const modalRef = useRef(null);

  const heroImages = [hero1, hero2, hero3];

  // Feature details for modals
  const featureDetails = {
    genre: {
      title: "Genre-Based Content Creation",
      description: "Our genre-based approach uses specialized AI models trained on specific content styles to deliver tailored results that match the exact tone, style, and format your audience expects.",
      benefits: [
        "Industry-specific vocabulary and terminology",
        "Appropriate tone and style for your genre",
        "Follows best practices for your content category",
        "Optimized for engagement in your specific field"
      ],
      usage: "Simply select your content genre, specify key parameters, and our AI will generate content that feels authentic and resonates with your target audience.",
      image: genre1
    },
    chat: {
      title: "Chat-Based Content Prompting",
      description: "The chat-based approach gives you maximum control through interactive prompting. Have a conversation with our AI and guide it to create exactly what you need through natural dialog.",
      benefits: [
        "Completely customizable outputs through conversation",
        "Iterate and refine content through multiple exchanges",
        "Explain complex requirements conversationally",
        "Get suggestions and improvements as you work"
      ],
      usage: "Start with a general prompt, then refine through follow-up instructions. The AI learns from each interaction to produce increasingly tailored content.",
      image: chat
    },
    trending: {
      title: "Trending Topics Analysis",
      description: "Stay relevant with our trending topics feature that analyzes current events, social media trends, and popular conversations to help you create timely, engaging content.",
      benefits: [
        "Real-time analysis of trending conversations",
        "Content ideas that capitalize on current interests",
        "Data-driven insights on audience engagement",
        "Predictive recommendations for upcoming trends"
      ],
      usage: "Browse our curated list of trending topics or enter your industry to see what's hot. Select a trend to generate relevant content that connects with the current conversation.",
      image: trending
    }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    return () => unsub();
  }, []);

  const handleGetStarted = () => {
    if (user) {
      navigate("/user-dashboard");
    } else {
      navigate("/login");
    }
  };

  // Auto-scroll functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Intersection Observer for animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.2,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(prev => ({
            ...prev,
            [entry.target.id]: true
          }));
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    if (featuresRef.current) observer.observe(featuresRef.current);
    if (aboutRef.current) observer.observe(aboutRef.current);

    return () => {
      if (featuresRef.current) observer.unobserve(featuresRef.current);
      if (aboutRef.current) observer.unobserve(aboutRef.current);
    };
  }, []);

  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setActiveModal(null);
      }
    };

    if (activeModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeModal]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const openFeatureModal = (feature) => {
    setActiveModal(feature);
  };

  return (
    <div className="bg-gray-900 text-gray-200 font-Poppins">
      <Header />

      {/*  Hero Section */}
      <section id="home" className="relative h-screen overflow-hidden">
        {/* Improved Background with Gradient Overlay */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="relative h-full w-full">
            {/* Animated Slider */}
            <div className="absolute top-0 left-0 w-full h-full flex transition-transform duration-1000 ease-in-out" 
                 style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
              {heroImages.map((image, index) => (
                <div key={index} className="w-full h-full flex-shrink-0 relative">
                  <img
                    src={image}
                    alt={`Hero Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {/* Enhanced image overlay with depth */}
                  <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/50 to-gray-900/90"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Hero Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 px-4">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-400 to-green-400">
              
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-teal-400 mx-auto mb-8"></div>
            <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              Leverage the power of AI to create engaging, persuasive, and conversion-focused content for any audience, in any industry, at unprecedented speed.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={handleGetStarted}
                className="px-8 py-4 font-semibold bg-gradient-to-r from-blue-600 to-teal-500 rounded-lg hover:from-teal-500 hover:to-blue-600 text-white transition duration-300 ease-in-out transform hover:scale-105 shadow-lg flex items-center gap-2 w-full sm:w-auto"
              >
                <span>Get Started Now</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <button 
                className="px-8 py-4 font-semibold border border-gray-600 rounded-lg hover:bg-gray-800 text-white transition duration-300 ease-in-out flex items-center gap-2 w-full sm:w-auto"
                onClick={() => featuresRef.current.scrollIntoView({ behavior: "smooth" })}
              >
                <span>Explore Features</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          {/* Enhanced Navigation Dots */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentSlide === index 
                    ? "bg-teal-400 w-8" 
                    : "bg-gray-500 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              ></button>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - UPDATED HEADING */}
      <section 
        id="features-section" 
        ref={featuresRef}
        className="py-20 bg-gradient-to-b from-gray-900 to-gray-800"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center mb-16">
            <h2 className="text-4xl font-bold text-center mb-4">Advanced Content Creation</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-teal-400"></div>
            <p className="mt-6 text-gray-300 max-w-2xl text-center">
              Choose from multiple content generation approaches tailored to your specific needs
            </p>
          </div>
          
          <div className={`grid md:grid-cols-3 gap-8 text-center transition-all duration-1000 ${
            isVisible['features-section'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            {/* Feature Card 1 - Enhanced with Depth and Animation */}
            <div className="group cursor-pointer bg-gray-750 rounded-xl shadow-xl hover:shadow-2xl transition duration-300 overflow-hidden border border-gray-700 hover:border-blue-500">
              <div className="relative h-56 overflow-hidden">
                <img
                  src={genre1}
                  alt="Genre-Based Content"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1 bg-blue-600/80 text-xs rounded-full text-white backdrop-blur-sm">
                    Most Popular
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3 text-blue-300 group-hover:text-blue-400 transition">
                  Genre-Based Content
                </h3>
                <p className="text-gray-300 mb-4">
                  Select a genre and let AI craft tailored content for your specific audience and purpose.
                </p>
                <button 
                  onClick={() => openFeatureModal('genre')}
                  className="flex items-center justify-center w-full py-2 px-4 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 rounded-lg transition-all duration-300 text-blue-400 font-medium group"
                >
                  <span>Learn more</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Feature Card 2 */}
            <div className="group cursor-pointer bg-gray-750 rounded-xl shadow-xl hover:shadow-2xl transition duration-300 overflow-hidden border border-gray-700 hover:border-purple-500">
              <div className="relative h-56 overflow-hidden">
                <img
                  src={chat}
                  alt="Chat-Based Prompting"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1 bg-purple-600/80 text-xs rounded-full text-white backdrop-blur-sm">
                    Most Flexible
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3 text-purple-300 group-hover:text-purple-400 transition">
                  Chat-Based Prompting
                </h3>
                <p className="text-gray-300 mb-4">
                  Enter custom prompts and guide the AI to generate exactly the content you need.
                </p>
                <button 
                  onClick={() => openFeatureModal('chat')}
                  className="flex items-center justify-center w-full py-2 px-4 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 rounded-lg transition-all duration-300 text-purple-400 font-medium group"
                >
                  <span>Learn more</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Feature Card 3 */}
            <div className="group cursor-pointer bg-gray-750 rounded-xl shadow-xl hover:shadow-2xl transition duration-300 overflow-hidden border border-gray-700 hover:border-green-500">
              <div className="relative h-56 overflow-hidden">
                <img
                  src={trending}
                  alt="Trending Topics"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1 bg-green-600/80 text-xs rounded-full text-white backdrop-blur-sm">
                    Updated Daily
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3 text-green-300 group-hover:text-green-400 transition">
                  Trending Topics
                </h3>
                <p className="text-gray-300 mb-4">
                  Explore current trends and generate fresh, relevant content that resonates with today's audience.
                </p>
                <button 
                  onClick={() => openFeatureModal('trending')}
                  className="flex items-center justify-center w-full py-2 px-4 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 rounded-lg transition-all duration-300 text-green-400 font-medium group"
                >
                  <span>Learn more</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section - REMOVED CONNECTING LINE */}
      <section className="py-20 px-6 bg-gray-800/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center mb-16">
            <h2 className="text-4xl font-bold text-center mb-4">How ContentCrafter Works</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-teal-400"></div>
            <p className="mt-6 text-gray-300 max-w-2xl text-center">
              From idea to published content in minutes, not hours
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-gray-750 rounded-xl p-8 border border-gray-700 relative z-10 transform transition-transform hover:-translate-y-2 duration-300 hover:border-blue-500 hover:shadow-xl">
              <div className="bg-blue-500/20 w-12 h-12 rounded-full flex items-center justify-center mb-6 mx-auto border border-blue-500">
                <span className="text-2xl font-bold text-blue-400">1</span>
              </div>
              <h3 className="text-xl font-bold text-center mb-4 text-blue-300">Choose Your Method</h3>
              <p className="text-gray-300 text-center">
                Select from genre-based, chat prompts, or trending topics for your content.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="bg-gray-750 rounded-xl p-8 border border-gray-700 relative z-10 transform transition-transform hover:-translate-y-2 duration-300 hover:border-teal-500 hover:shadow-xl">
              <div className="bg-teal-500/20 w-12 h-12 rounded-full flex items-center justify-center mb-6 mx-auto border border-teal-500">
                <span className="text-2xl font-bold text-teal-400">2</span>
              </div>
              <h3 className="text-xl font-bold text-center mb-4 text-teal-300">Customize Parameters</h3>
              <p className="text-gray-300 text-center">
                Define your content style, tone, length, and specific requirements.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="bg-gray-750 rounded-xl p-8 border border-gray-700 relative z-10 transform transition-transform hover:-translate-y-2 duration-300 hover:border-green-500 hover:shadow-xl">
              <div className="bg-green-500/20 w-12 h-12 rounded-full flex items-center justify-center mb-6 mx-auto border border-green-500">
                <span className="text-2xl font-bold text-green-400">3</span>
              </div>
              <h3 className="text-xl font-bold text-center mb-4 text-green-300">Generate Content</h3>
              <p className="text-gray-300 text-center">
                Our AI engine crafts high-quality, original content based on your inputs.
              </p>
            </div>
            
            {/* Step 4 */}
            <div className="bg-gray-750 rounded-xl p-8 border border-gray-700 relative z-10 transform transition-transform hover:-translate-y-2 duration-300 hover:border-purple-500 hover:shadow-xl">
              <div className="bg-purple-500/20 w-12 h-12 rounded-full flex items-center justify-center mb-6 mx-auto border border-purple-500">
                <span className="text-2xl font-bold text-purple-400">4</span>
              </div>
              <h3 className="text-xl font-bold text-center mb-4 text-purple-300">Review & Export</h3>
              <p className="text-gray-300 text-center">
                Edit if needed, then save, share, or export your content in multiple formats.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section - Enhanced with design and animation */}
      <section 
        id="about-section" 
        ref={aboutRef}
        className="py-20 bg-gradient-to-b from-gray-800 to-gray-900"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className={`transition-all duration-1000 ${
              isVisible['about-section'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            }`}>
              <span className="inline-block px-3 py-1 bg-blue-900/60 text-blue-300 rounded-full text-sm font-medium mb-4">About ContentCrafter</span>
              <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
                The Future of Content Creation
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-teal-400 mb-6"></div>
              <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                ContentCrafter is not just a tool — it's your creative intelligence engine. Designed for the fast-paced digital world, we help creators, marketers, and businesses automate the mundane and amplify the meaningful.
              </p>
              <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                With AI-powered insights, smart templates, and collaborative workflows, your content creation becomes faster, smarter, and more impactful.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-md bg-blue-500/20 flex items-center justify-center mt-1">
                    <svg className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-md font-semibold text-gray-200">Time Efficiency</h4>
                    <p className="mt-1 text-sm text-gray-400">Create in minutes what used to take hours</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-md bg-teal-500/20 flex items-center justify-center mt-1">
                    <svg className="h-4 w-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-md font-semibold text-gray-200">AI-Powered</h4>
                    <p className="mt-1 text-sm text-gray-400">Leveraging cutting-edge language models</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-md bg-green-500/20 flex items-center justify-center mt-1">
                    <svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-md font-semibold text-gray-200">Customizable</h4>
                    <p className="mt-1 text-sm text-gray-400">Tailored to your brand voice and style</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-md bg-purple-500/20 flex items-center justify-center mt-1">
                    <svg className="h-4 w-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-md font-semibold text-gray-200">Multi-Format</h4>
                    <p className="mt-1 text-sm text-gray-400">Blogs, social media, ads, and more</p>
                  </div>
                </div>
              </div>
            </div>
            <div className={`relative transition-all duration-1000 ${
              isVisible['about-section'] ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}>
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-teal-500/10 rounded-full blur-2xl"></div>
              <div className="bg-gray-800 p-3.5 rounded-2xl shadow-2xl border border-gray-700 relative z-10 transform hover:scale-[1.02] transition-transform duration-500">
                <video
                  className="w-full h-auto rounded-xl"
                  autoPlay
                  loop
                  muted
                  playsInline
                  poster="https://images.unsplash.com/photo-1522542550221-31fd19575a2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80"
                >
                  <source src="https://assets.mixkit.co/videos/preview/mixkit-typing-on-a-mechanical-keyboard-close-up-shots-28143-large.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent rounded-xl opacity-60"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Added New Company Overview Section */}
      <section className="py-20 px-6 bg-gray-850 bg-opacity-80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center mb-16">
            <h2 className="text-4xl font-bold text-center mb-4">Our Vision</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-teal-400"></div>
            <p className="mt-6 text-gray-300 max-w-2xl text-center">
              Redefining content creation for the AI-powered future
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5">
              <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/30">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-blue-300">Innovation Focus</h3>
              <p className="text-gray-400 leading-relaxed">
                We keep improving ContentCrafter step by step. New ideas are tested in real use, and only the features that truly help creators stay in the product.
              </p>
            </div>
            
            <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 hover:border-teal-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/5">
              <div className="w-14 h-14 rounded-full bg-teal-500/10 flex items-center justify-center mb-6 border border-teal-500/30">
                <svg className="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-teal-300">User-Centric Design</h3>
              <p className="text-gray-400 leading-relaxed">
                We design the app so anyone can use it. Clear buttons, short steps, and readable screens help you focus on writing, not on learning a complex tool.
              </p>
            </div>
            
            <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/5">
              <div className="w-14 h-14 rounded-full bg-purple-500/10 flex items-center justify-center mb-6 border border-purple-500/30">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-purple-300">Ethical AI Commitment</h3>
              <p className="text-gray-400 leading-relaxed">
                We want AI to be safe and fair. ContentCrafter is built to avoid harmful use, protect your data, and keep you in control of what finally gets published.
              </p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <button 
              onClick={() => aboutRef.current.scrollIntoView({ behavior: "smooth" })}
              className="px-6 py-3 font-medium bg-transparent border border-gray-600 hover:border-teal-500 text-gray-300 hover:text-teal-300 rounded-lg transition-all duration-300"
            >
              Learn More About Us
            </button>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-blue-900/20 to-teal-900/20 p-12 rounded-2xl border border-gray-800 relative overflow-hidden">
          {/* Enhanced background elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-purple-500/5 rounded-full blur-xl"></div>
            <div className="absolute bottom-1/3 right-1/3 w-16 h-16 bg-green-500/5 rounded-full blur-xl"></div>
          </div>
          
          <div className="relative z-10 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-400 to-green-400 mb-6">
              Ready to Transform Your Content?
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
              Join thousands of creators, marketers, and businesses who are leveraging AI to create better content, faster.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <button 
                onClick={handleGetStarted}
                className="px-8 py-4 font-semibold bg-gradient-to-r from-blue-600 to-teal-500 rounded-lg hover:from-teal-500 hover:to-blue-600 text-white transition duration-300 ease-in-out transform hover:scale-105 shadow-lg flex items-center gap-2 w-full sm:w-auto"
              >
                <span>Get Started Free</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Detail Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity duration-300">
          <div 
            ref={modalRef}
            className="relative bg-gray-800 rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl border border-gray-700 transform transition-all duration-300 animate-fadeIn"
          >
            <div className="relative h-64 overflow-hidden">
              <img 
                src={featureDetails[activeModal].image} 
                alt={featureDetails[activeModal].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>
              <button 
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm transition-all duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="absolute bottom-6 left-6">
                <h2 className="text-3xl font-bold text-white">{featureDetails[activeModal].title}</h2>
              </div>
            </div>
            
            <div className="p-8">
              <div className="prose prose-invert max-w-none">
                <p className="text-lg text-gray-300 mb-6">{featureDetails[activeModal].description}</p>
                
                <h3 className="text-xl font-semibold text-white mb-4">Key Benefits</h3>
                <ul className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {featureDetails[activeModal].benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-md bg-blue-500/20 flex items-center justify-center mt-1 mr-3">
                        <svg className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                      <span className="text-gray-300">{benefit}</span>
                    </li>
                  ))}
                </ul>
                
                <h3 className="text-xl font-semibold text-white mb-4">How to Use</h3>
                <p className="text-gray-300 mb-8">{featureDetails[activeModal].usage}</p>
                
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={handleGetStarted}
                    className="px-8 py-4 font-semibold bg-gradient-to-r from-blue-600 to-teal-500 rounded-lg hover:from-teal-500 hover:to-blue-600 text-white transition duration-300 ease-in-out transform hover:scale-105 shadow-lg flex items-center gap-2"
                  >
                    <span>Try It Now</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Dashboard;