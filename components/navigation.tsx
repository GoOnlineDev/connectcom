"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SignInButton, useAuth } from "@clerk/nextjs";
import { Authenticated, Unauthenticated, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import CustomUserButton from './user-button';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { isSignedIn } = useAuth();
  const createOrGetUser = useMutation(api.users.createOrGetUser);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isSignedIn) {
      createOrGetUser();
    }
  }, [isSignedIn, createOrGetUser]);

  return (
    <nav className={`fixed top-4 left-1/2 transform -translate-x-1/2 w-[95%] max-w-7xl z-50 transition-all duration-300 rounded-full ${
      isScrolled ? 'bg-white/90 backdrop-blur-md shadow-lg border border-burgundy-100' : 'bg-transparent'
    }`}>
      <div className="px-6 py-3">
        <div className="flex justify-between items-center">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="ConnectCom Logo"
                width={40}
                height={40}
                className="mr-2 animate-scale"
              />
              <span className="font-bold text-xl text-burgundy-900 md:block hidden">ConnectCom</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link href="/" className="px-4 py-2 text-burgundy-700 hover:text-burgundy-900 hover:bg-burgundy-50 rounded-full transition-colors">
              Home
            </Link>
            <Link href="/shops" className="px-4 py-2 text-burgundy-700 hover:text-burgundy-900 hover:bg-burgundy-50 rounded-full transition-colors">
              Shops
            </Link>
            <Link href="/categories" className="px-4 py-2 text-burgundy-700 hover:text-burgundy-900 hover:bg-burgundy-50 rounded-full transition-colors">
              Categories
            </Link>
            <Link href="/about" className="px-4 py-2 text-burgundy-700 hover:text-burgundy-900 hover:bg-burgundy-50 rounded-full transition-colors">
              About
            </Link>
            <Link href="/contact" className="px-4 py-2 text-burgundy-700 hover:text-burgundy-900 hover:bg-burgundy-50 rounded-full transition-colors">
              Contact Us
            </Link>
          </div>

          {/* Auth Buttons / User Profile */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/cart" className="relative p-2 text-burgundy-700 hover:text-burgundy-900 hover:bg-burgundy-50 rounded-full transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="absolute top-0 right-0 bg-burgundy-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">0</span>
            </Link>
            <Authenticated>
              <CustomUserButton />
            </Authenticated>
            <Unauthenticated>
              <SignInButton mode="modal">
                <button className="px-6 py-2 text-burgundy-700 border border-burgundy-600 hover:bg-burgundy-50 hover:text-burgundy-900 transition-colors rounded-full">
                  Sign In
                </button>
              </SignInButton>
            </Unauthenticated>
          </div>

          {/* Mobile elements */}
          <div className="md:hidden flex items-center">
            <Link href="/cart" className="relative mr-1 text-burgundy-700 hover:text-burgundy-900">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </Link>
            <Unauthenticated>
              <SignInButton mode="modal">
                <button className="mx-1 px-3 py-1 text-burgundy-700 border border-burgundy-600 text-sm rounded-full text-xs hover:bg-burgundy-50">
                  Sign In
                </button>
              </SignInButton>
            </Unauthenticated>
            <Authenticated>
              <CustomUserButton />
            </Authenticated>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="ml-1 p-1 rounded-full text-burgundy-700 hover:text-burgundy-900 hover:bg-burgundy-50"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-sm rounded-b-3xl shadow-lg animate-slide-down border border-burgundy-100">
          <div className="px-4 pt-2 pb-4 space-y-1">
            <Link href="/" className="block px-3 py-2 rounded-full text-burgundy-700 hover:bg-burgundy-50 hover:text-burgundy-900">
              Home
            </Link>
            <Link href="/shops" className="block px-3 py-2 rounded-full text-burgundy-700 hover:bg-burgundy-50 hover:text-burgundy-900">
              Shops
            </Link>
            <Link href="/categories" className="block px-3 py-2 rounded-full text-burgundy-700 hover:bg-burgundy-50 hover:text-burgundy-900">
              Categories
            </Link>
            <Link href="/about" className="block px-3 py-2 rounded-full text-burgundy-700 hover:bg-burgundy-50 hover:text-burgundy-900">
              About
            </Link>
            <Link href="/contact" className="block px-3 py-2 rounded-full text-burgundy-700 hover:bg-burgundy-50 hover:text-burgundy-900">
              Contact Us
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
