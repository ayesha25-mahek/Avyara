import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cortex-green/40 disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-[#1B3E32] via-[#235041] to-[#1B3E32] text-[#E8F5EE] hover:text-white shadow-lg shadow-[#00E599]/15 hover:shadow-[#00E599]/30 hover:brightness-110 border border-[#2D6350] hover:border-[#00E599]/50',
        cortex:
          'bg-gradient-to-r from-[#1E483A] to-[#2B6652] text-white shadow-lg shadow-[#00E599]/20 hover:shadow-[#00E599]/40 hover:scale-[1.01] border border-[#00E599]/40',
        cyan:
          'bg-gradient-to-r from-[#00E599] to-[#06B6D4] text-black font-semibold shadow-lg shadow-[#00E599]/20 hover:shadow-[#00E599]/35 hover:brightness-105',
        outline:
          'border border-[#1B362C] bg-[#0A1510]/80 text-gray-200 hover:bg-[#13251E] hover:border-[#00E599]/40 hover:text-white backdrop-blur-md',
        ghost:
          'bg-transparent text-gray-300 hover:bg-white/5 hover:text-white',
        destructive:
          'bg-red-500/15 border border-red-500/30 text-red-300 hover:bg-red-500/25',
        secondary:
          'bg-[#13251E] text-gray-200 hover:bg-[#193128] border border-[#1B362C]',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        default: 'h-10 px-4 py-2 text-sm',
        lg: 'h-12 px-6 text-base',
        xl: 'h-14 px-8 text-lg font-semibold tracking-wide',
        icon: 'h-9 w-9 p-0',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  )
);
Button.displayName = 'Button';

export { Button, buttonVariants };
