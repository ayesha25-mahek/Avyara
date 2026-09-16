import React from 'react';
import { ShieldCheck, Cpu } from 'lucide-react';

const Footer: React.FC = () => (
  <footer className="border-t border-[#1B362C]/60 bg-[#030604] py-6 mt-16 relative">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Brand & Security */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs font-mono text-gray-400">
          <ShieldCheck className="w-4 h-4 text-[#00E599]" />
          <span>AUTONOMOUS SOC-GRADE CONTENT INTELLIGENCE</span>
        </div>
        <span className="text-gray-700 hidden sm:inline">•</span>
        <span className="text-xs font-mono text-gray-400 hidden sm:inline">
          AVYRA AGENTIC ENGINE v2.5
        </span>
      </div>

      {/* Model Orchestration Mesh */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 text-[10px] font-mono text-gray-400">
        <span className="text-gray-400 mr-1 flex items-center gap-1">
          <Cpu className="w-3 h-3 text-[#00E599]" /> Neural Mesh:
        </span>
        {['Gemini Pro 1.5', 'Groq LLaMA-3', 'ElevenLabs Turbo', 'Runway Gen-3', 'Cloudflare AI'].map((model) => (
          <span
            key={model}
            className="px-2 py-0.5 rounded bg-[#0E1B15] border border-[#1B362C]/60 text-gray-400"
          >
            {model}
          </span>
        ))}
      </div>
    </div>
  </footer>
);

export { Footer };
