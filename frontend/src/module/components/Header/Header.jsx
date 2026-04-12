import React, { useState, useEffect } from "react";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-scroll";
import { useAuth } from "../../context/AuthContext";
import Logo from "../../../components/ui/Logo";

const Header = () => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isHomePage = location.pathname === "/" || location.pathname === "/dashboard";

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 50);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when navigating
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const onLogoutClick = async () => {
    try {
      await logout();
      window.location.href = "/dashboard";
      setUserMenuOpen(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const toggleMobileMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  return (
    <header className={`fixed top-0 w-full z-40 transition-all duration-300 ${
      scrolled 
        ? "py-2 backdrop-blur-lg bg-gray-900/90 shadow-lg" 
        : "py-4 bg-gradient-to-r from-gray-900 via-black to-gray-900"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
    
          <div className="flex-shrink-0 flex items-center animate-fade-in">
            <Logo  />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {isHomePage ? (
              /* Smooth scroll links for homepage */
              <>
                <Link
                  to="home"
                  spy={true}
                  smooth={true}
                  offset={-70}
                  duration={500}
                  className="text-gray-300 hover:text-teal-400 transition duration-300 cursor-pointer px-3 py-2 text-sm font-medium"
                  activeClass="text-teal-400 border-b-2 border-teal-400"
                >
                  Home
                </Link>
                <Link
                  to="features-section"
                  spy={true}
                  smooth={true}
                  offset={-70}
                  duration={500}
                  className="text-gray-300 hover:text-teal-400 transition duration-300 cursor-pointer px-3 py-2 text-sm font-medium"
                  activeClass="text-teal-400 border-b-2 border-teal-400"
                >
                  Features
                </Link>
                <Link
                  to="about-section"
                  spy={true}
                  smooth={true}
                  offset={-70}
                  duration={500}
                  className="text-gray-300 hover:text-teal-400 transition duration-300 cursor-pointer px-3 py-2 text-sm font-medium"
                  activeClass="text-teal-400 border-b-2 border-teal-400"
                >
                  About
                </Link>
              </>
            ) : (
              /* Regular links for other pages */
              <>
                <RouterLink
                  to="/dashboard"
                  className="text-gray-300 hover:text-teal-400 transition duration-300 px-3 py-2 text-sm font-medium"
                >
                  Home
                </RouterLink>
                <RouterLink
                  to="/pricing"
                  className="text-gray-300 hover:text-teal-400 transition duration-300 px-3 py-2 text-sm font-medium"
                >
                  Use Cases
                </RouterLink>
                <RouterLink
                  to="/content-studio"
                  className="text-gray-300 hover:text-teal-400 transition duration-300 px-3 py-2 text-sm font-medium"
                >
                  Content Studio
                </RouterLink>
              </>
            )}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center">
            {/* User section or auth buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {!isAuthenticated ? (
                /* Auth buttons and dark mode toggle */
                <div className="flex items-center space-x-3">
                  <RouterLink
                    to="/login"
                    className="text-white px-3 py-1.5 text-sm rounded-md hover:bg-gray-800 transition"
                  >
                    Log in
                  </RouterLink>
                  <RouterLink
                    to="/signup"
                    className="bg-gradient-to-r from-blue-500 to-teal-400 text-white px-4 py-1.5 rounded-md text-sm font-medium shadow-md hover:shadow-lg hover:from-blue-600 hover:to-teal-500 transition duration-300 transform hover:scale-105"
                  >
                    Sign up
                  </RouterLink>
                </div>
              ) : (
                /* Simplified user profile dropdown - just username and signout */
                <div className="relative ml-3">
                  <div>
                    <button
                      onClick={toggleUserMenu}
                      className="flex items-center space-x-2 bg-gray-800 p-1.5 px-3 rounded-full hover:bg-gray-700 transition"
                    >
                      <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 flex items-center justify-center">
                        <span className="text-white text-xs font-semibold">
                          {currentUser.displayName 
                            ? currentUser.displayName.charAt(0).toUpperCase() 
                            : currentUser.email.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm text-gray-300">
                        {currentUser.displayName || currentUser.email.split('@')[0]}
                      </span>
                      <svg 
                        className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Simplified user dropdown menu - only signout */}
                  {userMenuOpen && (
                    <div
                      className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-gray-800 border border-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none z-50 dropdown-fade-in"
                    >
                      <button
                        onClick={onLogoutClick}
                        className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 transition"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              )}
              
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              {isAuthenticated && (
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center mr-4 bg-gray-800 p-1 rounded-full"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 flex items-center justify-center">
                    <span className="text-white text-xs font-semibold">
                      {currentUser.displayName 
                        ? currentUser.displayName.charAt(0).toUpperCase() 
                        : currentUser.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </button>
              )}
              
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
              >
                <span className="sr-only">Open main menu</span>
                {isOpen ? (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu with CSS transition */}
      {isOpen && (
        <div
          className="md:hidden bg-gray-800/95 backdrop-blur-sm mobile-menu-fade-in"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-700">
            {isHomePage ? (
              /* Smooth scroll links for mobile */
              <>
                <Link
                  to="home"
                  spy={true}
                  smooth={true}
                  offset={-70}
                  duration={500}
                  className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700 hover:text-teal-400 transition"
                  activeClass="bg-gray-700 text-teal-400"
                >
                  Home
                </Link>
                <Link
                  to="features-section"
                  spy={true}
                  smooth={true}
                  offset={-70}
                  duration={500}
                  className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700 hover:text-teal-400 transition"
                  activeClass="bg-gray-700 text-teal-400"
                >
                  Features
                </Link>
                <Link
                  to="about-section"
                  spy={true}
                  smooth={true}
                  offset={-70}
                  duration={500}
                  className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700 hover:text-teal-400 transition"
                  activeClass="bg-gray-700 text-teal-400"
                >
                  About
                </Link>
              </>
            ) : (
              /* Regular links for mobile */
              <>
                <RouterLink
                  to="/dashboard"
                  className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700 hover:text-teal-400 transition"
                >
                  Home
                </RouterLink>
                <RouterLink
                  to="/pricing"
                  className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700 hover:text-teal-400 transition"
                >
                  Use Cases
                </RouterLink>
                <RouterLink
                  to="/content-studio"
                  className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700 hover:text-teal-400 transition"
                >
                  Content Studio
                </RouterLink>
              </>
            )}
            
            {/* Mobile auth buttons */}
            {!isAuthenticated ? (
              <div className="mt-4 pt-4 border-t border-gray-700">
                <RouterLink
                  to="/login"
                  className="block w-full text-center px-5 py-3 bg-gray-700 rounded-md text-base font-medium text-teal-400 mb-2"
                >
                  Log in
                </RouterLink>
                <RouterLink
                  to="/signup"
                  className="block w-full text-center px-5 py-3 bg-gradient-to-r from-blue-500 to-teal-400 rounded-md text-base font-medium text-white"
                >
                  Sign up
                </RouterLink>
              </div>
            ) : (
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex items-center px-3 py-2">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {currentUser.displayName 
                          ? currentUser.displayName.charAt(0).toUpperCase() 
                          : currentUser.email.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-white">
                      {currentUser.displayName || currentUser.email.split('@')[0]}
                    </div>
                    <div className="text-sm font-medium text-gray-400 truncate max-w-[200px]">{currentUser.email}</div>
                  </div>
                </div>
                <button
                  onClick={onLogoutClick}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-gray-700 transition mt-1"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Simplified mobile user menu - only sign out option */}
      {userMenuOpen && isAuthenticated && (
        <div
          className="md:hidden absolute right-0 mt-2 w-full px-4 z-50 dropdown-fade-in"
        >
          <div className="rounded-lg shadow-lg bg-gray-800 border border-gray-700 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-700">
              <p className="text-sm font-medium text-gray-200 truncate">{currentUser.email}</p>
            </div>
            <div className="py-1">
              <button
                onClick={onLogoutClick}
                className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;