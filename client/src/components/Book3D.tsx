import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Book3DProps {
  children: React.ReactNode;
  onFlip?: (direction: 'next' | 'prev') => void;
}

// This component manages the 3D flipping container
export function Book3D({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative w-full h-full perspective-2000 transform-style-3d">
            {children}
        </div>
    );
}

// Individual Page Component that handles the flip animation
export function FlipPage({ 
    children, 
    zIndex, 
    direction = 0, // 0 = static, 1 = flipping to next (right to left), -1 = flipping to prev (left to right)
    onFlipComplete 
}: { 
    children: React.ReactNode, 
    zIndex: number, 
    direction?: number,
    onFlipComplete?: () => void
}) {
    // Rotation logic:
    // If direction is 1 (Next): Start at 0, rotate Y to -180
    // If direction is -1 (Prev): Start at -180, rotate Y to 0
    // If direction is 0: Static at 0
    
    // Actually, for a book:
    // Right pages sit at 0deg. Left pages (flipped) sit at -180deg.
    // When we flip NEXT: The current Right page rotates from 0 to -180.
    // When we flip PREV: The current Left page rotates from -180 to 0.

    return (
        <motion.div
            className="absolute inset-0 w-full h-full bg-paper backface-hidden origin-left shadow-xl"
            style={{ 
                zIndex,
                transformStyle: 'preserve-3d',
            }}
            initial={direction === 1 ? { rotateY: 0 } : direction === -1 ? { rotateY: -180 } : { rotateY: 0 }}
            animate={direction === 1 ? { rotateY: -180 } : direction === -1 ? { rotateY: 0 } : { rotateY: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            onAnimationComplete={onFlipComplete}
        >
            {children}
        </motion.div>
    );
}

// Helper to highlight text sequentially
export function SequentialHighlighter({ text, transcript, isRecordMode, isExplainMode }: { text: string, transcript: string, isRecordMode: boolean, isExplainMode: boolean }) {
    // Normalize text and transcript for comparison
    const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean);
    
    const textWords = text.split(' '); // Keep original punctuation/casing for display
    const cleanTextWords = normalize(text);
    const cleanTranscriptWords = normalize(transcript);

    let currentWordIndex = -1;
    let textCursor = 0;
    
    // Improved matching logic:
    // Maintain a currentWordIndex based on strictly sequential matches
    for (const tWord of cleanTranscriptWords) {
        // Look for the word in the text starting from current cursor
        // We only move forward (strictly in order)
        for (let i = textCursor; i < cleanTextWords.length; i++) {
            if (cleanTextWords[i] === tWord) {
                textCursor = i + 1;
                currentWordIndex = i;
                break;
            }
        }
    }

    return (
        <span className="relative">
            {textWords.map((word, i) => {
                const isActive = i === currentWordIndex;
                const shouldHighlight = (isRecordMode && isActive) || (isExplainMode && isActive);
                
                return (
                    <motion.span 
                        key={i} 
                        initial={false}
                        animate={{
                            backgroundColor: shouldHighlight ? "#fb923c" : "rgba(251, 146, 60, 0)",
                            scale: isActive ? 1.05 : 1,
                        }}
                        transition={{
                            duration: 0.2,
                            ease: "easeInOut"
                        }}
                        className={`inline-block relative px-1 rounded-[4px] transition-all duration-200 ${
                            isActive ? "z-20 shadow-sm" : ""
                        }`}
                        style={{
                            color: shouldHighlight ? "#ffffff" : "inherit"
                        }}
                    >
                        {word}{' '}
                    </motion.span>
                );
            })}
        </span>
    );
}
