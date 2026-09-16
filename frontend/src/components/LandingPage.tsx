import React from 'react';
import { HeroSection } from '@/pages/landing/HeroSection';
import { CapabilitiesSection } from '@/pages/landing/CapabilitiesSection';
import { DeliverablesSection } from '@/pages/landing/DeliverablesSection';

interface LandingPageProps {
  onOpenAuth: (mode?: 'signin' | 'login') => void;
  isAuthenticated: boolean;
  onEnterStudio: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenAuth,
  isAuthenticated,
  onEnterStudio,
}) => {
  const handlePrimaryAction = () => {
    if (isAuthenticated) {
      onEnterStudio();
    } else {
      onOpenAuth('login');
    }
  };

  return (
    <div className="min-h-screen bg-[#020503] text-gray-100 font-serif">
      {/* SECTION 1: Hero (Black Background) */}
      <HeroSection
        isAuthenticated={isAuthenticated}
        onPrimaryAction={handlePrimaryAction}
      />

      {/* SECTION 2: Capabilities (Dark Green Background) */}
      <CapabilitiesSection />

      {/* SECTION 3: Deliverables (White Background) */}
      <DeliverablesSection
        isAuthenticated={isAuthenticated}
        onPrimaryAction={handlePrimaryAction}
      />
    </div>
  );
};
