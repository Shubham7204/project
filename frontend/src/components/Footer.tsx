import { Github, Twitter, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t-4 border-black mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-black mb-4">ContentAI</h3>
            <p className="text-gray-600 font-medium">
              Intelligent content analysis and categorization powered by AI
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="text-gray-600 hover:text-black font-medium">About</a>
              </li>
              <li>
                <a href="/privacy" className="text-gray-600 hover:text-black font-medium">Privacy Policy</a>
              </li>
              <li>
                <a href="/terms" className="text-gray-600 hover:text-black font-medium">Terms of Service</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-black">
                <Github className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-600 hover:text-black">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-600 hover:text-black">
                <Mail className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-600 font-medium">
            © {new Date().getFullYear()} ContentAI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
} 