import * as React from 'react';
import { cn } from '@/lib/utils';

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'flex min-h-[120px] w-full rounded-md border border-[#163022] bg-[#040906]',
        'px-4 py-3.5 text-sm text-[#E8F5EE] placeholder:text-gray-500 font-serif',
        'focus:outline-none focus:border-[#00D084]/80',
        'disabled:cursor-not-allowed disabled:opacity-50 resize-none transition-all duration-150',
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = 'Textarea';

export { Textarea };
