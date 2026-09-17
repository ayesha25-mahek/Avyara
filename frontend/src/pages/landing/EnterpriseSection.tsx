import React from 'react';
import { Shield, Key, Eye } from 'lucide-react';

export const EnterpriseSection: React.FC = () => {
  return (
    <section className="py-24 bg-[#0A0F0D] border-b border-[#1A2820] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
        {/* Header */}
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#132219] border border-[#20402E] text-[#52B788] text-xs font-semibold tracking-wide">
            ENTERPRISE COMPLIANCE & PRIVACY
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight font-heading text-white">
            Built for security-conscious enterprise teams.
          </h2>
          <p className="text-base text-[#9EB3A8] leading-relaxed">
            Avyra operates with zero third-party data leakage. Customer prompts and uploaded documentation are strictly scoped to authenticated sessions.
          </p>
        </div>

        {/* 3 Figma SaaS Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Shield,
              title: 'Row-Level Access Isolation',
              desc: 'Database queries run under strict Supabase Row-Level Security policies. Team members only access their authorized workspace records.',
            },
            {
              icon: Key,
              title: 'Zero Public Password Exposure',
              desc: 'Authentication uses salted PBKDF2 hashing on protected backend endpoints. Passwords never appear in client bundles or public API responses.',
            },
            {
              icon: Eye,
              title: 'Complete Audit Trail',
              desc: 'Every generation, deliverable export, and prompt modification is permanently logged with timestamps and actor emails for compliance reporting.',
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="rounded-xl border border-[#1E2F26] bg-[#0E1712] p-6 space-y-4 hover:border-[#2D4338] transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-[#14261D] border border-[#203D2E] flex items-center justify-center text-[#52B788]">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-white tracking-tight">
                  {item.title}
                </h3>
                <p className="text-xs text-[#9EB3A8] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
