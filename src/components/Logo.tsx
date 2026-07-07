import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 48, showText = true }) => {
  return (
    <div className={`flex items-center gap-2 sm:gap-3 select-none flex-shrink-0 ${className}`}>
      {/* High-Fidelity SVG Logo */}
      <div 
        className="relative flex items-center justify-center flex-shrink-0 w-9 h-9 sm:w-12 sm:h-12"
      >
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <defs>
            {/* Map pin gradient matching the logo */}
            <linearGradient id="pinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#9d4edd" />
              <stop offset="50%" stopColor="#d800a6" />
              <stop offset="100%" stopColor="#f72585" />
            </linearGradient>
            
            {/* Tail gradient */}
            <linearGradient id="tailGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f3c68f" />
              <stop offset="100%" stopColor="#ee964b" />
            </linearGradient>
          </defs>

          {/* BACKGROUND HOUSE SILHOUETTE (lower right) */}
          <path 
            d="M 125,124 L 125,110 L 148,93 L 172,110 L 172,124 Z" 
            className="fill-indigo-400/30 dark:fill-indigo-300/20" 
          />
          <polygon 
            points="136,83 148,72 160,83" 
            className="fill-indigo-400/30 dark:fill-indigo-300/20" 
          />
          <circle cx="148.5" cy="110" r="3.5" className="fill-white/80 dark:fill-slate-900/80" />
          
          {/* Base shadow beneath house */}
          <ellipse cx="150" cy="125.5" rx="20" ry="2" className="fill-indigo-400/20 dark:fill-indigo-400/10" />

          {/* DYNAMIC SIGNAL WAVE RINGS left & right */}
          <path 
            d="M 38,98 C 24,80 24,56 38,38" 
            fill="none" 
            className="stroke-purple-400/50 dark:stroke-purple-400/40" 
            strokeWidth="3.5" 
            strokeLinecap="round" 
          />
          <path 
            d="M 162,98 C 176,80 176,56 162,38" 
            fill="none" 
            className="stroke-purple-400/50 dark:stroke-purple-400/40" 
            strokeWidth="3.5" 
            strokeLinecap="round" 
          />
          
          <path 
            d="M 48,87 C 39,73 39,53 48,39" 
            fill="none" 
            className="stroke-purple-300/60 dark:stroke-purple-300/30" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
          />
          <path 
            d="M 152,87 C 143,73 143,53 152,39" 
            fill="none" 
            className="stroke-purple-300/60 dark:stroke-purple-300/30" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
          />

          {/* FLOATING HEART (left) */}
          <path 
            d="M 23,88 C 20,84 15.5,84 13.5,87 C 11.5,90 12.5,94.5 15.5,97.5 L 23,104 L 30.5,97.5 C 33.5,94.5 34.5,90 32.5,87 C 30.5,84 26,84 23,88 Z" 
            fill="#ff5c8a" 
          />

          {/* CAT TAIL curling (bottom left of pin) */}
          <path 
            d="M 68,115 C 50,115 48,95 56,88 C 60,84 66,88 64,94 C 61,101 64,106 75,106" 
            fill="none" 
            stroke="url(#tailGrad)" 
            strokeWidth="9" 
            strokeLinecap="round" 
          />

          {/* CORE MAP PIN SHAPE */}
          <path 
            d="M 100,168 C 55,124 49,91 49,69 C 49,39 72,18 100,18 C 128,18 151,39 151,69 C 151,91 145,124 100,168 Z" 
            fill="url(#pinGrad)" 
            filter="drop-shadow(0px 5px 6px rgba(0,0,0,0.2))" 
          />
          
          {/* White inner circle in pin */}
          <circle cx="100" cy="69" r="30" fill="#ffffff" />
          
          {/* Paw print inside white circle */}
          <path 
            d="M 100,67 C 93.5,67 90.5,71.5 90.5,75.5 C 90.5,79.5 93.5,82 100,82 C 106.5,82 109.5,79.5 109.5,75.5 C 109.5,71.5 106.5,67 100,67 Z" 
            fill="#ff5c8a" 
          />
          <circle cx="90" cy="60.5" r="5" fill="#ff5c8a" />
          <circle cx="96.5" cy="54" r="5" fill="#ff5c8a" />
          <circle cx="103.5" cy="54" r="5" fill="#ff5c8a" />
          <circle cx="110" cy="60.5" r="5" fill="#ff5c8a" />
          
          {/* Signal waves inside white circle (bottom) */}
          <path d="M 87,90 C 93,85 107,85 113,90" fill="none" stroke="#ff5c8a" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M 92,95.5 C 95,93 105,93 108,95.5" fill="none" stroke="#ff5c8a" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="100" cy="100" r="2" fill="#ff5c8a" />

          {/* CAT PEAKING FROM TOP */}
          {/* Ears */}
          <polygon points="71,24 62,3 84,14" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.5" /> 
          <polygon points="73,21 66,7 81,13" fill="#ff85a1" /> 
          
          <polygon points="129,24 138,3 116,14" fill="#f89e52" /> 
          <polygon points="127,21 134,7 119,13" fill="#ff85a1" /> 

          {/* Head Shape */}
          <ellipse cx="100" cy="27" rx="27" ry="20" fill="#ffffff" />
          
          {/* Orange/Ginger Patch on bicolored cat */}
          <path d="M 73,28 C 73,17 84,12 92,20 C 89,28 80,34 73,28 Z" fill="#f89e52" />
          
          {/* Eyes (Cute black round dots) */}
          <circle cx="87" cy="25.5" r="3.5" fill="#1e293b" />
          <circle cx="88.2" cy="24.2" r="1.1" fill="#ffffff" />
          
          <circle cx="113" cy="25.5" r="3.5" fill="#1e293b" />
          <circle cx="114.2" cy="24.2" r="1.1" fill="#ffffff" />

          {/* Nose */}
          <polygon points="100,29.5 97.5,27.5 102.5,27.5" fill="#ff85a1" />
          
          {/* Mouth */}
          <path d="M 96,31.5 C 98,33.5 100,32.5 100,31.5 C 100,32.5 102,33.5 104,31.5" fill="none" stroke="#1e293b" strokeWidth="1.2" strokeLinecap="round" />

          {/* Whiskers */}
          <line x1="68" y1="29" x2="55" y2="27.5" stroke="#1e293b" strokeWidth="1" />
          <line x1="68" y1="32.5" x2="53" y2="32.5" stroke="#1e293b" strokeWidth="1" />
          <line x1="68" y1="36" x2="55" y2="38.5" stroke="#1e293b" strokeWidth="1" />
          
          <line x1="132" y1="29" x2="145" y2="27.5" stroke="#1e293b" strokeWidth="1" />
          <line x1="132" y1="32.5" x2="147" y2="32.5" stroke="#1e293b" strokeWidth="1" />
          <line x1="132" y1="36" x2="145" y2="38.5" stroke="#1e293b" strokeWidth="1" />

          {/* Cute white bicolored paws draped over the top of the pin */}
          <ellipse cx="77" cy="41" rx="7" ry="5.5" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
          <ellipse cx="123" cy="41" rx="7" ry="5.5" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
          
          {/* Paw claw markings */}
          <line x1="74" y1="38" x2="74" y2="44" stroke="#cbd5e1" strokeWidth="1.2" />
          <line x1="80" y1="38" x2="80" y2="44" stroke="#cbd5e1" strokeWidth="1.2" />
          <line x1="120" y1="38" x2="120" y2="44" stroke="#cbd5e1" strokeWidth="1.2" />
          <line x1="126" y1="38" x2="126" y2="44" stroke="#cbd5e1" strokeWidth="1.2" />
        </svg>
      </div>
      
      {showText && (
        <div className="flex flex-col flex-shrink-0">
          {/* "Purr" in Dark Blue/Slate, "Signal" in Coral-Red to Orange Gradient */}
          <span className="font-extrabold tracking-tight text-base sm:text-xl leading-none flex items-center">
            <span className="text-slate-900 dark:text-white">Purr</span>
            <span className="relative ml-0.5 flex items-center">
              <span className="bg-gradient-to-r from-rose-500 to-rose-500 bg-clip-text text-transparent">S</span>
              <span className="relative inline-flex items-center text-rose-500">
                <span>i</span>
                <span className="absolute -top-1 sm:-top-1.5 left-1/2 -translate-x-1/2 text-[6px] sm:text-[8px] text-rose-500 font-bold select-none leading-none">
                  ♥
                </span>
              </span>
              <span className="bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-transparent">gnal</span>
            </span>
          </span>
          {/* Subtitle matching the exact phrase from the logo image */}
          <span className="hidden sm:flex text-[8px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase leading-none mt-1 items-center gap-0.5">
            Report. Connect. Rescue. Reunite. <span className="text-rose-500 text-[7px]">♥</span>
          </span>
        </div>
      )}
    </div>
  );
};

