import * as React from 'react';
import { cn } from '@/lib/utils';

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'flex min-h-[120px] w-full rounded-lg border border-[#1A402D] bg-[#0F261B]',
        'px-4 py-3.5 text-sm text-[#E8F5EE] placeholder:text-[#688A78] font-serif',
        'focus:outline-none focus:border-[#74C69D]',
        'disabled:cursor-not-allowed disabled:opacity-50 resize-none transition-colors duration-150',
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = 'Textarea';

export { Textarea };
