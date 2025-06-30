import React from 'react';
import Link from 'next/link';
import { Store, Mail, Phone, MapPin, Heart } from 'lucide-react';

export default function DashboardFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-burgundy/20 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-burgundy rounded-lg flex items-center justify-center">
                  <Store className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-burgundy">ConnectCom</span>
              </div>
              <p className="text-burgundy/80 text-sm mb-4 max-w-md">
                Connecting communities through local commerce. Empowering individuals and businesses 
                to create their own online shops and showcase their products and services.
              </p>
              <div className="flex items-center space-x-4 text-sm text-burgundy/70">
                <div className="flex items-center space-x-1">
                  <Mail className="w-4 h-4" />
                  <span>support@connectcom.com</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Phone className="w-4 h-4" />
                  <span>+1 (555) 123-4567</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-semibold text-burgundy mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link 
                    href="/" 
                    className="text-burgundy/70 hover:text-burgundy transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/shops" 
                    className="text-burgundy/70 hover:text-burgundy transition-colors"
                  >
                    Browse Shops
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/categories" 
                    className="text-burgundy/70 hover:text-burgundy transition-colors"
                  >
                    Categories
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/onboarding/shop" 
                    className="text-burgundy/70 hover:text-burgundy transition-colors"
                  >
                    Create Shop
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h3 className="text-sm font-semibold text-burgundy mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link 
                    href="/about" 
                    className="text-burgundy/70 hover:text-burgundy transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/contact" 
                    className="text-burgundy/70 hover:text-burgundy transition-colors"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/terms" 
                    className="text-burgundy/70 hover:text-burgundy transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/policy" 
                    className="text-burgundy/70 hover:text-burgundy transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-burgundy/20 pt-6 mt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <div className="text-sm text-burgundy/70">
                © {currentYear} ConnectCom. All rights reserved.
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-burgundy/70">
                <span>Made with</span>
                <Heart className="w-4 h-4 text-red-500 fill-current" />
                <span>for local communities</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
