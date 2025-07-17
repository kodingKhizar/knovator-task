"use client";

import Link from "next/link";
import { useState } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="text-indigo-700 text-3xl font-bold tracking-wide transition-transform hover:scale-105"
          >
            Scalable job import system
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-indigo-600 transition-colors duration-200 font-medium text-lg"
            >
              Imports
            </Link>
            <Link
              href="/all"
              className="text-gray-700 hover:text-indigo-600 transition-colors duration-200 font-medium text-lg"
            >
              Jobs
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-800 focus:outline-none transition-transform duration-300 hover:scale-110"
            aria-label="Toggle menu"
          >
            <svg
              className={`h-7 w-7 transition-transform duration-300 ${
                menuOpen ? "rotate-90" : "rotate-0"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col bg-white px-4 pb-4 pt-2 shadow-inner space-y-2 animate-fadeIn">
          <Link
            href="/"
            className="text-gray-700 hover:bg-indigo-100 px-3 py-2 rounded-md text-base font-medium transition duration-200"
            onClick={() => setMenuOpen(false)}
          >
            Imports
          </Link>
          <Link
            href="/all"
            className="text-gray-700 hover:bg-indigo-100 px-3 py-2 rounded-md text-base font-medium transition duration-200"
            onClick={() => setMenuOpen(false)}
          >
            Jobs
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
