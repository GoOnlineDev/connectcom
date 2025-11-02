import React from 'react';
import Link from 'next/link';
import { Mail, Phone } from 'lucide-react';

export default function DashboardFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-burgundy/20 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0 text-sm">
            <div className="text-burgundy/70">
              © {currentYear} ConnectCom. All rights reserved.
            </div>
            
            <div className="flex items-center space-x-4 text-burgundy/70">
              <Link 
                href="/contact" 
                className="flex items-center space-x-1 hover:text-burgundy transition-colors"
              >
                <Mail className="w-3 h-3" />
                <span>connectcom256@gmail.com</span>
              </Link>
              <div className="flex items-center space-x-1">
                <Phone className="w-3 h-3" />
                <span>+256 783 618441</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
