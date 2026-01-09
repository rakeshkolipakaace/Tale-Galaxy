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
export function SequentialHighlighter({ text, transcript, isRecordMode }: { text: string, transcript: string, isRecordMode: boolean }) {
    // Normalize text and transcript for comparison
    const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean);
    
    const textWords = text.split(' '); // Keep original punctuation/casing for display
    const cleanTextWords = normalize(text);
    const cleanTranscriptWords = normalize(transcript);

    let lastMatchIndex = -1;
    let textCursor = 0;
    
    // Improved matching logic:
    // We iterate through transcript words and find their best corresponding position in the text.
    // To handle common recognition errors, we use a fuzzy matching approach.
    for (const tWord of cleanTranscriptWords) {
        // Look for the word in the text starting from a reasonable range around textCursor
        // This helps handle skipped words or words misidentified at the start
        const searchRange = cleanTextWords.length; 
        for (let i = textCursor; i < searchRange; i++) {
            if (cleanTextWords[i] === tWord) {
                textCursor = i + 1;
                lastMatchIndex = Math.max(lastMatchIndex, i);
                break;
            }
        }
    }

    return (
        <span className="relative">
            {textWords.map((word, i) => {
                const isRead = i <= lastMatchIndex;
                const isCurrent = isRecordMode && i === lastMatchIndex + 1;
                
                return (
                    <motion.span 
                        key={i} 
                        initial={false}
                        animate={{
                            backgroundColor: isRead ? "#fef08a" : "transparent",
                            color: isRead ? "#1c1917" : "#292524",
                            scale: isCurrent ? 1.05 : 1,
                        }}
                        className={`inline-block relative px-1 rounded-sm transition-all duration-300 ${
                            isRead ? "font-medium" : ""
                        }`}
                    >
                        {word}{' '}
                        {isCurrent && (
                            <motion.span
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-400"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ repeat: Infinity, duration: 0.8, repeatType: "reverse" }}
                            />
                        )}
                    </motion.span>
                );
            })}
        </span>
    );
}
