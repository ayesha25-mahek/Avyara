import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  label?: string;
}

const Select: React.FC<SelectProps> = ({
  value,
  onValueChange,
  options,
  placeholder = 'Select…',
  className,
  label,
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-[11px] font-mono uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-cortex-green/60" />
          {label}
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          className={cn(
            'w-full appearance-none rounded-lg border border-[#1B362C] bg-[#0E1B15]/80',
            'px-3.5 py-2.5 pr-9 text-sm text-[#E8F5EE] font-medium',
            'focus:outline-none focus:ring-1 focus:ring-cortex-green/50 focus:border-cortex-green/60',
            'hover:border-[#1B362C]/80 cursor-pointer transition-all duration-150 backdrop-blur-sm shadow-inner',
            className
          )}
        >
          {placeholder && (
            <option value="" disabled className="bg-[#0A1510] text-gray-400">
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#0A1510] text-[#E8F5EE]">
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
};

export { Select };
export type { SelectOption };
