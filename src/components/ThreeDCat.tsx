import React, { useState, useEffect, useRef } from 'react';

interface ThreeDCatProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  interactive?: boolean;
}

export const ThreeDCat: React.FC<ThreeDCatProps> = ({ 
  className = '', 
  size = 'md',
  interactive = true 
}) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse tracking logic for 3D tilt effect
  useEffect(() => {
    if (!interactive) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || !isHovered) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within the element
      const y = e.clientY - rect.top;  // y position within the element
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate tilt angles based on cursor distance from center
      const tiltY = ((x - centerX) / centerX) * 20;  // max 20 degrees
      const tiltX = -((y - centerY) / centerY) * 15; // max 15 degrees

      setRotateX(tiltX);
      setRotateY(tiltY);
    };

    const handleMouseLeave = () => {
      setRotateX(0);
      setRotateY(0);
      setIsHovered(false);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [interactive, isHovered]);

  const sizeClasses = {
    xs: 'w-10 h-10',
    sm: 'w-16 h-16',
    md: 'w-32 h-32',
    lg: 'w-48 h-48',
    xl: 'w-64 h-64'
  };

  return (
    <div 
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      className={`relative select-none flex items-center justify-center cursor-pointer ${sizeClasses[size]} ${className}`}
      style={{ perspective: '800px' }}
    >
      {/* 3D Cat Container */}
      <div 
        className="relative w-full h-full transition-transform duration-200 ease-out"
        style={{ 
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${isHovered ? 1.08 : 1})`,
        }}
      >
        {/* Ground shadow - shifts with rotation for depth */}
        <div 
          className="absolute bottom-1 left-[10%] right-[10%] h-[12%] bg-black/20 rounded-full blur-md transition-opacity duration-300"
          style={{ 
            transform: 'translateZ(-20px) rotateX(90deg)',
            opacity: isHovered ? 0.4 : 0.25 
          }}
        />

        {/* Cat Tail (Back of 3D stack) */}
        <div 
          className="absolute right-[15%] bottom-[30%] w-[12%] h-[40%] bg-gradient-to-t from-amber-600 to-amber-500 rounded-full origin-bottom"
          style={{ 
            transform: 'translateZ(-10px) rotate(15deg)',
            animation: 'tailWag 3s ease-in-out infinite alternate'
          }}
        />

        {/* Cat Body Layer (Middle of 3D stack) */}
        <div 
          className="absolute bottom-[15%] left-[20%] right-[20%] h-[55%] bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-400 rounded-[45%] border-b-4 border-amber-700 shadow-lg"
          style={{ 
            transform: 'translateZ(10px)',
          }}
        >
          {/* Swirly Tiger Stripes */}
          <div className="absolute top-1/4 left-0 w-1/3 h-2 bg-amber-700/30 rounded-r-full" />
          <div className="absolute top-2/4 left-0 w-5/12 h-2.5 bg-amber-700/30 rounded-r-full" />
          <div className="absolute top-1/3 right-0 w-1/3 h-2 bg-amber-700/30 rounded-l-full" />
          <div className="absolute top-[55%] right-0 w-5/12 h-2.5 bg-amber-700/30 rounded-l-full" />

          {/* Fluffy white chest/bib */}
          <div className="absolute top-0 left-1/4 right-1/4 h-[40%] bg-white rounded-b-[50%] shadow-inner" />
        </div>

        {/* Collar and Tag */}
        <div 
          className="absolute bottom-[60%] left-[28%] right-[28%] h-[6%] bg-rose-600 rounded-full flex items-center justify-center"
          style={{ 
            transform: 'translateZ(25px) rotateX(10deg)',
          }}
        >
          {/* Gold Bell/Tag */}
          <div className="absolute top-full w-3.5 h-3.5 bg-gradient-to-tr from-yellow-500 to-yellow-300 rounded-full border border-yellow-600 animate-bounce" />
        </div>

        {/* Cat Head Layer (Front of 3D stack) */}
        <div 
          className="absolute top-[10%] left-[22%] right-[22%] h-[48%] bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-300 rounded-[44%] border-b-2 border-amber-600/80 shadow-md flex flex-col items-center justify-center"
          style={{ 
            transform: 'translateZ(35px)',
          }}
        >
          {/* Left Ear */}
          <div 
            className="absolute -top-[18%] -left-[5%] w-[40%] h-[40%] bg-gradient-to-tr from-amber-600 to-amber-500 rounded-tr-[70%] rounded-bl-[20%] origin-bottom-right"
            style={{ transform: 'rotate(-20deg) translateZ(-5px)' }}
          >
            <div className="absolute inset-[15%] bg-rose-200 dark:bg-rose-300 rounded-tr-[60%] rounded-bl-[25%]" />
          </div>

          {/* Right Ear */}
          <div 
            className="absolute -top-[18%] -right-[5%] w-[40%] h-[40%] bg-gradient-to-tl from-amber-600 to-amber-500 rounded-tl-[70%] rounded-br-[20%] origin-bottom-left"
            style={{ transform: 'rotate(20deg) translateZ(-5px)' }}
          >
            <div className="absolute inset-[15%] bg-rose-200 dark:bg-rose-300 rounded-tl-[60%] rounded-br-[25%]" />
          </div>

          {/* Eyes Container - looks at cursor slightly */}
          <div className="flex gap-6 mt-1 w-full justify-center px-4">
            {/* Left Eye */}
            <div className="w-5 h-5 bg-emerald-400 rounded-full border border-slate-900 flex items-center justify-center shadow-inner relative overflow-hidden">
              <div 
                className="w-2.5 h-4 bg-slate-950 rounded-full transition-transform duration-100"
                style={{ 
                  transform: `translate(${rotateY * 0.1}px, ${-rotateX * 0.1}px) scaleY(${isHovered ? 1.2 : 1})`
                }}
              />
              {/* Highlight */}
              <div className="absolute top-1 right-1 w-1 h-1 bg-white rounded-full" />
            </div>

            {/* Right Eye */}
            <div className="w-5 h-5 bg-emerald-400 rounded-full border border-slate-900 flex items-center justify-center shadow-inner relative overflow-hidden">
              <div 
                className="w-2.5 h-4 bg-slate-950 rounded-full transition-transform duration-100"
                style={{ 
                  transform: `translate(${rotateY * 0.1}px, ${-rotateX * 0.1}px) scaleY(${isHovered ? 1.2 : 1})`
                }}
              />
              {/* Highlight */}
              <div className="absolute top-1 right-1 w-1 h-1 bg-white rounded-full" />
            </div>
          </div>

          {/* Nose & Whiskers */}
          <div className="relative mt-1.5 flex flex-col items-center">
            {/* Pink Nose */}
            <div className="w-2.5 h-2 bg-rose-400 rounded-b-md" />
            {/* Mouth */}
            <div className="w-4 h-2 border-b-2 border-amber-800 rounded-b-full opacity-60 mt-0.5" />

            {/* Whiskers (Left) */}
            <div className="absolute -left-12 top-0 space-y-1.5 opacity-60">
              <div className="w-8 h-[1px] bg-white origin-right rotate-[8deg]" />
              <div className="w-9 h-[1px] bg-white origin-right rotate-[0deg]" />
              <div className="w-8 h-[1px] bg-white origin-right -rotate-[8deg]" />
            </div>

            {/* Whiskers (Right) */}
            <div className="absolute -right-12 top-0 space-y-1.5 opacity-60">
              <div className="w-8 h-[1px] bg-white origin-left -rotate-[8deg]" />
              <div className="w-9 h-[1px] bg-white origin-left rotate-[0deg]" />
              <div className="w-8 h-[1px] bg-white origin-left rotate-[8deg]" />
            </div>
          </div>

          {/* Freckles/Cheeks */}
          <div className="absolute bottom-2.5 left-5 w-1.5 h-1.5 bg-rose-400/30 rounded-full blur-[1px]" />
          <div className="absolute bottom-2.5 right-5 w-1.5 h-1.5 bg-rose-400/30 rounded-full blur-[1px]" />
        </div>

        {/* Front Paws Layer (Very front of 3D stack) */}
        <div 
          className="absolute bottom-[8%] left-[28%] right-[28%] h-[15%] flex justify-between"
          style={{ 
            transform: 'translateZ(45px)',
          }}
        >
          {/* Left Paw */}
          <div 
            className="w-[35%] h-full bg-gradient-to-t from-amber-600 to-amber-400 rounded-t-xl rounded-b-lg border-b-2 border-amber-700 shadow-md transition-transform"
            style={{ 
              transform: isHovered ? 'translateY(-4px)' : 'none',
              animation: isHovered ? 'pawTap 0.6s infinite alternate' : 'none'
            }}
          />
          {/* Right Paw */}
          <div 
            className="w-[35%] h-full bg-gradient-to-t from-amber-600 to-amber-400 rounded-t-xl rounded-b-lg border-b-2 border-amber-700 shadow-md transition-transform"
            style={{ 
              transform: isHovered ? 'translateY(-2px)' : 'none',
              animation: isHovered ? 'pawTap 0.6s infinite alternate 0.3s' : 'none'
            }}
          />
        </div>
      </div>

      {/* Embedded CSS for custom keyframe animations */}
      <style>{`
        @keyframes tailWag {
          0% { transform: translateZ(-10px) rotate(15deg); }
          100% { transform: translateZ(-10px) rotate(-15deg); }
        }
        @keyframes pawTap {
          0% { transform: translateY(0); }
          100% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
};
