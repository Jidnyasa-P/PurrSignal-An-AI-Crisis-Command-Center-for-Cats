import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 32, showText = true }) => {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <div 
        className="relative flex items-center justify-center bg-gradient-to-tr from-rose-600 to-amber-500 rounded-xl p-1.5 shadow-md shadow-rose-500/20"
        style={{ width: size, height: size }}
      >
        {/* Animated radar rings (signal waves) in the background */}
        <div className="absolute inset-0 rounded-xl bg-rose-500/20 animate-ping opacity-60" />
        
        {/* Beautiful custom vector logo combining Cat and Signal bars */}
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="text-white w-full h-full"
        >
          {/* Feline Silhouette with integrated signal bars inside ears or tail */}
          {/* Cat head */}
          <path d="M12 21c-4.5 0-8-3.5-8-8 0-3.5 2-6 4-7.5l2 3h4l2-3c2 1.5 4 4 4 7.5 0 4.5-3.5 8-8 8z" />
          {/* Left ear */}
          <path d="M6 5.5l-2-2.5 1.5 4" />
          {/* Right ear */}
          <path d="M18 5.5l2-2.5-1.5 4" />
          {/* Cat Nose and whiskers */}
          <path d="M12 13v1" strokeWidth="3" />
          <path d="M9 13.5h-2M15 13.5h2" />
          <path d="M10 11.5a2 2 0 0 1 4 0" />
        </svg>
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <span className="font-extrabold tracking-tight text-slate-900 dark:text-white text-lg leading-none flex items-center gap-1">
            Purr<span className="text-rose-600 dark:text-rose-400">Signal</span>
          </span>
          <span className="text-[9px] font-mono tracking-widest text-slate-400 dark:text-slate-500 uppercase leading-none mt-0.5">
            Feline AI Tactical Net
          </span>
        </div>
      )}
    </div>
  );
};
