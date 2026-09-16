import * as React from 'react';
import { cn } from '@/lib/utils';

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('relative h-2.5 w-full overflow-hidden rounded-full bg-[#080D1A] border border-white/10', className)}
      {...props}
    >
      <div
        className="h-full transition-all duration-500 ease-out rounded-full cortex-shimmer"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
);
Progress.displayName = 'Progress';

export { Progress };
