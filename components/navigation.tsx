"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SignInButton, useAuth } from "@clerk/nextjs";
import { usePathname } from 'next/navigation';
import { Authenticated, Unauthenticated } from "convex/react";
import { useCurrentUser, useCart, useWishlistCount } from '@/hooks/useData';
import CustomUserButton from './user-button';
import { Button } from './ui/button';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const { isSignedIn } = useAuth();
  const { data: currentUser, isLoading: userLoading } = useCurrentUser();
  const { data: cart, isLoading: cartLoading } = useCart();
  const { data: wishlistCount, isLoading: wishlistLoading } = useWishlistCount();

  // Calculate cart count
  const cartCount = cart?.length || 0;

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const handleMobileLinkClick = () => {
    setIsMenuOpen(false);
  };

  const baseLinkClasses = "px-4 py-2 rounded-full transition-colors";
  const desktopLinkClasses = (href: string) =>
    `${baseLinkClasses} ${isActive(href) ? 'bg-burgundy-900 text-white' : 'text-burgundy-700 hover:text-burgundy-900 hover:bg-beige-50'}`;
  const mobileLinkClasses = (href: string) =>
    `block px-3 py-2 rounded-full ${isActive(href) ? 'bg-burgundy-900 text-white' : 'text-burgundy-700 hover:bg-beige-50 hover:text-burgundy-900'}`;

  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 w-[95%] max-w-7xl z-50 transition-all duration-300 rounded-full bg-white/90 backdrop-blur-md shadow-lg border border-burgundy-100">
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
              {/* Only show title on desktop and hide on mobile */}
              <span className="font-bold text-xl text-burgundy-900 hidden md:block">ConnectCom</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link href="/" className={desktopLinkClasses('/')}>
              Home
            </Link>
            <Link href="/shops" className={desktopLinkClasses('/shops')}>
              Shops
            </Link>
            <Link href="/categories" className={desktopLinkClasses('/categories')}>
              Categories
            </Link>
            <Link href="/about" className={desktopLinkClasses('/about')}>
              About
            </Link>
            <Link href="/contact" className={desktopLinkClasses('/contact')}>
              Contact Us
            </Link>
          </div>

          {/* Auth Buttons / User Profile */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/cart" className="relative p-2 text-burgundy-700 hover:text-burgundy-900 hover:bg-burgundy-50 rounded-full transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-burgundy-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>
            <Link href="/wishlist" className="relative p-2 text-burgundy-700 hover:text-burgundy-900 hover:bg-burgundy-50 rounded-full transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlistCount !== undefined && wishlistCount > 0 && (
                <span className="absolute top-0 right-0 bg-burgundy-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
              )}
            </Link>
            <Authenticated>
              <CustomUserButton />
            </Authenticated>
            <Unauthenticated>
              <SignInButton mode="modal">
                <Button className="px-6 py-2 w-auto">
                  Sign In
                </Button>
              </SignInButton>
            </Unauthenticated>
          </div>

          {/* Mobile elements */}
          <div className="md:hidden flex items-center">
            <Link href="/cart" className="relative mr-1 text-burgundy-700 hover:text-burgundy-900">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-burgundy-600 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center leading-none">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>
            <Link href="/wishlist" className="relative mr-1 text-burgundy-700 hover:text-burgundy-900">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlistCount !== undefined && wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-burgundy-600 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center leading-none">
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
              )}
            </Link>
            <Unauthenticated>
              <SignInButton mode="modal">
                <Button className="mx-1 px-3 py-1 text-sm rounded-full text-xs w-auto">
                  Sign In
                </Button>
              </SignInButton>
            </Unauthenticated>
            <Authenticated>
              <CustomUserButton isMobile={true} />
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
            <Link href="/" className={mobileLinkClasses('/')} onClick={handleMobileLinkClick}>
              Home
            </Link>
            <Link href="/shops" className={mobileLinkClasses('/shops')} onClick={handleMobileLinkClick}>
              Shops
            </Link>
            <Link href="/categories" className={mobileLinkClasses('/categories')} onClick={handleMobileLinkClick}>
              Categories
            </Link>
            <Link href="/about" className={mobileLinkClasses('/about')} onClick={handleMobileLinkClick}>
              About
            </Link>
            <Link href="/contact" className={mobileLinkClasses('/contact')} onClick={handleMobileLinkClick}>
              Contact Us
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
