import React from "react";
import { Link } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaGithub } from "react-icons/fa";
import { MdEmail, MdLocationOn, MdPhone } from "react-icons/md";
import Logo from "../../../components/ui/Logo";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1: About */}
          <div className="space-y-6">
            <Logo withLink={true} className="shadow-glow" />
            
            <p className="text-gray-400 text-[0.9rem] leading-relaxed">
              Revolutionizing content creation with powerful AI tools. Create, optimize, and 
              manage your content effortlessly with ContentCrafter.
            </p>

            <div className="flex space-x-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-full hover:bg-gradient-to-r hover:from-blue-500 hover:to-teal-400 transition duration-300"
                aria-label="Twitter"
              >
                <FaTwitter size={18} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-full hover:bg-gradient-to-r hover:from-blue-500 hover:to-teal-400 transition duration-300"
                aria-label="Instagram"
              >
                <FaInstagram size={18} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-full hover:bg-gradient-to-r hover:from-blue-500 hover:to-teal-400 transition duration-300"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={18} />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-full hover:bg-gradient-to-r hover:from-blue-500 hover:to-teal-400 transition duration-300"
                aria-label="GitHub"
              >
                <FaGithub size={18} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/user-dashboard"
                  className="text-gray-300 text-sm hover:text-teal-400 transition duration-300 flex items-center"
                >
                  <span className="mr-2">›</span> Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/user-dashboard"
                  className="text-gray-300 text-sm hover:text-teal-400 transition duration-300 flex items-center"
                >
                  <span className="mr-2">›</span> Features
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/documentation"
                  className="text-gray-300 text-sm hover:text-teal-400 transition duration-300 flex items-center"
                >
                  <span className="mr-2">›</span> Documentation
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-gray-300 text-sm hover:text-teal-400 transition duration-300 flex items-center"
                >
                  <span className="mr-2">›</span> Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <MdEmail className="text-teal-400 flex-shrink-0" size={18} />
                <a
                  href="mailto:contentcrafter@gmail.com"
                  className="text-gray-300 text-sm hover:text-teal-400 transition duration-300"
                >
                  contentcrafter@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-10"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <div>
            &copy; {new Date().getFullYear()} ContentCrafter. All rights reserved.
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-x-6 gap-y-2 justify-center">
            <Link to="/privacy" className="hover:text-teal-400 transition duration-300">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-teal-400 transition duration-300">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;