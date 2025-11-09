"use client";
import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Authenticated, Unauthenticated } from "convex/react";
import { useCurrentUser, useCart, useWishlistCount } from '@/hooks/useData';
import CustomUserButton from './user-button';
import { Button } from './ui/button';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: currentUser, isLoading: userLoading } = useCurrentUser();
  const { data: cart, isLoading: cartLoading } = useCart();
  const { data: wishlistCount, isLoading: wishlistLoading } = useWishlistCount();

  const cartCount = cart?.length || 0;

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const handleMobileLinkClick = () => {
    setIsMenuOpen(false);
  };

  const getNavButtonVariant = (href: string): "default" | "ghost" => isActive(href) ? 'default' : 'ghost';
  const getNavButtonSize = (): "pill-sm" => 'pill-sm';

  const authRedirect = useMemo(() => {
    if (!pathname) return '/';
    if (pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up')) {
      return '/';
    }
    return pathname || '/';
  }, [pathname]);

  const signInHref = `/sign-in?redirect=${encodeURIComponent(authRedirect)}`;

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
              <span className="font-bold text-xl text-burgundy-900 hidden md:block">ConnectCom</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Button 
              asChild 
              variant={getNavButtonVariant('/')} 
              size={getNavButtonSize()}
              className="text-md"
            >
              <Link href="/">Home</Link>
            </Button>
            <Button 
              asChild 
              variant={getNavButtonVariant('/shops')} 
              size={getNavButtonSize()}
              className="text-md"
            >
              <Link href="/shops">Shops</Link>
            </Button>
            <Button 
              asChild 
              variant={getNavButtonVariant('/categories')} 
              size={getNavButtonSize()}
              className="text-md"
            >
              <Link href="/categories">Categories</Link>
            </Button>
            <Button 
              asChild 
              variant={getNavButtonVariant('/about')} 
              size={getNavButtonSize()}
              className="text-md"
            >
              <Link href="/about">About</Link>
            </Button>
            <Button 
              asChild 
              variant={getNavButtonVariant('/contact')} 
              size={getNavButtonSize()}
              className="text-md"
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>

          {/* Auth Buttons / User Profile - Desktop */}
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
              <Button asChild className="px-6 py-2 w-auto text-md">
                <Link href={signInHref}>
                  Sign In
                </Link>
              </Button>
            </Unauthenticated>
          </div>

          {/* Mobile elements - Grouped in rounded card */}
          <div className="md:hidden flex items-center gap-2">
            {/* Rounded card containing cart, wishlist, and auth */}
            <div className="flex items-center gap-1 bg-burgundy-50/50 rounded-full px-2 py-1.5 border border-burgundy-100">
              <Link href="/cart" className="relative p-1.5 text-burgundy-700 hover:text-burgundy-900 hover:bg-white rounded-full transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-burgundy-600 text-white text-[9px] rounded-full h-3.5 w-3.5 flex items-center justify-center leading-none font-semibold">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>
              
              <Link href="/wishlist" className="relative p-1.5 text-burgundy-700 hover:text-burgundy-900 hover:bg-white rounded-full transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {wishlistCount !== undefined && wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-burgundy-600 text-white text-[9px] rounded-full h-3.5 w-3.5 flex items-center justify-center leading-none font-semibold">
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </span>
                )}
              </Link>

              <Unauthenticated>
                <Link
                  href={signInHref}
                  className="px-3 py-1 bg-burgundy-700 text-white text-xs rounded-full hover:bg-burgundy-800 transition-colors font-medium text-md"
                >
                  Sign In
                </Link>
              </Unauthenticated>
              
              <Authenticated>
                <div className="scale-90">
                  <CustomUserButton isMobile={true} />
                </div>
              </Authenticated>
            </div>

            {/* Menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-full text-burgundy-700 hover:text-burgundy-900 hover:bg-burgundy-50 transition-colors border border-burgundy-100"
              aria-label="Toggle menu"
            >
              <svg
                className="h-5 w-5"
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

      {/* Mobile dropdown menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 mt-2 mx-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-burgundy-100 overflow-hidden animate-slide-down">
          <div className="p-3 space-y-1">
            <Button 
              asChild 
              variant={getNavButtonVariant('/')} 
              size="pill-sm" 
              className="w-full justify-start text-md"
              onClick={handleMobileLinkClick}
            >
              <Link href="/">Home</Link>
            </Button>
            <Button 
              asChild 
              variant={getNavButtonVariant('/shops')} 
              size="pill-sm" 
              className="w-full justify-start text-md"
              onClick={handleMobileLinkClick}
            >
              <Link href="/shops">Shops</Link>
            </Button>
            <Button 
              asChild 
              variant={getNavButtonVariant('/categories')} 
              size="pill-sm" 
              className="w-full justify-start text-md"
              onClick={handleMobileLinkClick}
            >
              <Link href="/categories">Categories</Link>
            </Button>
            <Button 
              asChild 
              variant={getNavButtonVariant('/about')} 
              size="pill-sm" 
              className="w-full justify-start text-md"
              onClick={handleMobileLinkClick}
            >
              <Link href="/about">About</Link>
            </Button>
            <Button 
              asChild 
              variant={getNavButtonVariant('/contact')} 
              size="pill-sm" 
              className="w-full justify-start text-md"
              onClick={handleMobileLinkClick}
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;