import React from 'react';
import { Link } from 'react-router-dom';

const Logo = ({ variant = 'default', withLink = true, className = '' }) => {
  // Configure sizes based on variant
  const getConfig = () => {
    switch (variant) {

      case 'medium':
        return {
          container: 'w-10 h-10',
          text: 'text-2xl',
          logoText: 'CC',
          showText: true,
        };
      case 'icon-only':
        return {
          container: 'w-10 h-10',
          text: 'text-xl',
          logoText: 'CC',
          showText: false,
        };
      default:
        return {
          container: 'w-10 h-10',
          text: 'text-2xl',
          logoText: 'CC',
          showText: true,
        };
    }
  };

  const { container, text, logoText, showText } = getConfig();

  const LogoContent = () => (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className={`${container} relative group`}>
        {/* Base circle with gradient background */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-600 to-teal-500 group-hover:from-blue-500 group-hover:to-teal-400 animate-pulse-slow"></div>
        
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-teal-300 opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-300"></div>
        
        {/* Main circle */}
        <div className="absolute inset-0.5 rounded-full bg-gradient-to-br from-blue-500 to-teal-400 group-hover:from-blue-400 group-hover:to-teal-300 flex items-center justify-center shadow-lg z-10 transition-all duration-300">
          {/* Inner shadow/highlight */}
          <div className="absolute top-0 left-1/4 w-1/2 h-1/3 bg-white opacity-20 rounded-full blur-sm"></div>
          
          {/* Logo text */}
          <span className="relative text-white font-bold text-xl drop-shadow-md">{logoText}</span>
        </div>
        
        {/* Subtle ring */}
        <div className="absolute -inset-0.5 rounded-full border border-white/20 group-hover:border-white/30 transition-colors duration-300"></div>
      </div>
      
      {showText && (
        <div className={`${text} font-extrabold relative`}>
          <span className="bg-gradient-to-r from-blue-400 via-teal-400 to-green-400 bg-clip-text text-transparent inline-block group-hover:scale-105 transition-transform duration-300">
            Content<span className="text-white/90">Crafter</span>
          </span>
          <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400/0 via-teal-400/40 to-green-400/0"></div>
        </div>
      )}
    </div>
  );

  // Return the logo without link wrapper
  return <LogoContent />;
};

export default Logo;
