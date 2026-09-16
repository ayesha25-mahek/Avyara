import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-[#00E599]/15 text-[#34D399] border border-[#00E599]/30',
        cortex: 'bg-gradient-to-r from-[#00E599]/20 to-[#059669]/20 text-[#00E599] border border-[#00E599]/40 shadow-[0_0_10px_rgba(0,229,153,0.15)]',
        cyan: 'bg-[#06B6D4]/15 text-[#06B6D4] border border-[#06B6D4]/30 shadow-[0_0_10px_rgba(6,182,212,0.15)]',
        success: 'bg-[#00E599]/15 text-[#00E599] border border-[#00E599]/30 shadow-[0_0_10px_rgba(0,229,153,0.15)]',
        warning: 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
        destructive: 'bg-red-500/15 text-red-300 border border-red-500/30',
        outline: 'border border-white/20 text-gray-300 bg-white/5',
        blue: 'bg-blue-500/15 text-blue-300 border border-blue-500/30',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
