import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MobileFrameProps {
  children: ReactNode;
  orientation?: 'portrait' | 'landscape';
}

export function MobileFrame({ children, orientation = 'portrait' }: MobileFrameProps) {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-zinc-900 p-4 md:p-8 perspective-1000">
      <motion.div
        layout
        initial={false}
        animate={{
          rotate: orientation === 'landscape' ? 0 : 0, // We handle visual rotation via width/height swap in CSS mostly, but could do transform
          width: orientation === 'landscape' ? 'min(850px, 95vw)' : 'min(375px, 95vw)',
          height: orientation === 'landscape' ? 'min(400px, 90vw)' : 'min(812px, 95vh)',
        }}
        transition={{ type: "spring", stiffness: 60, damping: 20 }}
        className={cn(
          "mobile-frame relative bg-paper overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border-zinc-800",
          "border-[8px] md:border-[12px] rounded-[30px] md:rounded-[45px]",
          orientation === 'landscape' ? 'flex flex-row' : 'flex flex-col'
        )}
      >
        {/* Notch / Camera (Mock) */}
        <div className={cn(
            "absolute bg-black z-50 pointer-events-none rounded-full",
             orientation === 'portrait' 
                ? "top-0 left-1/2 -translate-x-1/2 w-32 h-6 rounded-b-2xl" 
                : "left-0 top-1/2 -translate-y-1/2 h-32 w-6 rounded-r-2xl"
        )} />
        
        {/* Screen Content */}
        <div className="w-full h-full overflow-hidden relative">
            {children}
        </div>

        {/* Home Bar Indicator */}
        <div className={cn(
            "absolute bg-zinc-300/30 rounded-full pointer-events-none z-50",
            orientation === 'portrait'
                ? "bottom-2 left-1/2 -translate-x-1/2 w-32 h-1"
                : "bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 opacity-0" // Hide in landscape usually or keep at bottom
        )} />
      </motion.div>
    </div>
  );
}
