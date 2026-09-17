import React from 'react';
import { Twitter, Linkedin } from 'lucide-react';

const Footer: React.FC = () => (
  <footer className="bg-[#0A0F0D] border-t border-[#1E2F26] py-6 mt-16 relative">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <span>© 2024 Avyra</span>
        <a href="/terms" className="hover:text-[#00E599]">Terms of Service</a>
        <a href="/privacy" className="hover:text-[#00E599]">Privacy Policy</a>
        <Twitter className="w-4 h-4 text-[#00E599]" />
        <Linkedin className="w-4 h-4 text-[#00E599]" />
      </div>
    </div>
  </footer>
);

export { Footer };
