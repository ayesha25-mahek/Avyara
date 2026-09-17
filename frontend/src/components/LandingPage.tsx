import React from 'react';
import { HeroSection } from '@/pages/landing/HeroSection';
import { CapabilitiesSection } from '@/pages/landing/CapabilitiesSection';
import { DeliverablesSection } from '@/pages/landing/DeliverablesSection';
import { EnterpriseSection } from '@/pages/landing/EnterpriseSection';
import { CtaSection } from '@/pages/landing/CtaSection';

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
    <div className="min-h-screen bg-[#0A0F0D] text-[#F0F5F2]">
      {/* 1. HERO: Black / charcoal-gray background */}
      <HeroSection
        isAuthenticated={isAuthenticated}
        onPrimaryAction={handlePrimaryAction}
      />

      {/* 2. NEXT SECTION: Dark green background */}
      <CapabilitiesSection />

      {/* 3. NEXT SECTION: White / very light gray background */}
      <DeliverablesSection />

      {/* 4. NEXT SECTION: Black background with clean white typography & muted green UI elements */}
      <EnterpriseSection />

      {/* 5. FINAL CTA: Dark green background with simple, clean layout */}
      <CtaSection
        isAuthenticated={isAuthenticated}
        onPrimaryAction={handlePrimaryAction}
      />
    </div>
  );
};
