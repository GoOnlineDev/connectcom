import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-burgundy/10 pt-10 pb-6 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center mb-4">
              <Image
                src="/logo.png"
                alt="ConnectCom Logo"
                width={40}
                height={40}
                className="mr-2"
              />
              <h3 className="text-lg font-bold text-burgundy">ConnectCom</h3>
            </div>
            <p className="text-sm text-burgundy/80 mb-4">
              Connecting communities through powerful communications tools.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-burgundy hover:text-burgundy-light">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a href="#" className="text-burgundy hover:text-burgundy-light">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692h1.971v3z" />
                </svg>
              </a>
              <a href="#" className="text-burgundy hover:text-burgundy-light">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links 1 */}
          <div>
            <h4 className="text-md font-semibold text-burgundy mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-burgundy/80 hover:text-burgundy">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-burgundy/80 hover:text-burgundy">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-burgundy/80 hover:text-burgundy">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/press" className="text-burgundy/80 hover:text-burgundy">
                  Press
                </Link>
              </li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h4 className="text-md font-semibold text-burgundy mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-burgundy/80 hover:text-burgundy">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/docs" className="text-burgundy/80 hover:text-burgundy">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/tutorials" className="text-burgundy/80 hover:text-burgundy">
                  Tutorials
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-burgundy/80 hover:text-burgundy">
                  Community
                </Link>
              </li>
            </ul>
          </div>

          {/* Links 3 */}
          <div>
            <h4 className="text-md font-semibold text-burgundy mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-burgundy/80 hover:text-burgundy">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-burgundy/80 hover:text-burgundy">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-burgundy/80 hover:text-burgundy">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/compliance" className="text-burgundy/80 hover:text-burgundy">
                  Compliance
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-burgundy/10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-burgundy/80 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} ConnectCom. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="text-sm text-burgundy/80 hover:text-burgundy">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-burgundy/80 hover:text-burgundy">
              Terms
            </Link>
            <Link href="/cookies" className="text-sm text-burgundy/80 hover:text-burgundy">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
