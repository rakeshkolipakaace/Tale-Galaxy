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
    if (!isRecordMode) return <span>{text}</span>;

    // Normalize text and transcript for comparison
    const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean);
    
    const textWords = text.split(' '); // Keep original punctuation/casing for display
    const cleanTextWords = normalize(text);
    const cleanTranscriptWords = normalize(transcript);

    // Find the furthest matching index
    // We assume the user reads somewhat sequentially.
    // We look for the last matched word from the transcript in the text.
    
    let lastMatchIndex = -1;
    
    // Optimization: Just check how many words from the start match
    // Or simpler: Find the last occurrence of the transcript's last few words in the text sequence
    // Let's iterate through the text words and see if they have been "covered" by the transcript
    
    // Naive but effective "Karaoke" pointer:
    // If transcript has N words, we assume they matched the first N words of text approximately?
    // No, transcript might have errors.
    
    // Robust approach:
    // Iterate through transcript words. Find them in text words. 
    // Maintain a "cursor" in text. Only move cursor forward.
    
    let textCursor = 0;
    for (const tWord of cleanTranscriptWords) {
        // Look ahead in text (limit lookahead to avoid jumping too far)
        for (let i = textCursor; i < Math.min(textCursor + 5, cleanTextWords.length); i++) {
            if (cleanTextWords[i] === tWord) {
                textCursor = i + 1;
                lastMatchIndex = i;
                break;
            }
        }
    }

    return (
        <span>
            {textWords.map((word, i) => (
                <span 
                    key={i} 
                    className={`transition-colors duration-200 ${
                        i <= lastMatchIndex 
                            ? "bg-yellow-300 text-black px-0.5 rounded-sm" // Read words
                            : i === lastMatchIndex + 1 
                                ? "bg-yellow-100 border-b-2 border-red-400" // Next word hint
                                : ""
                    }`}
                >
                    {word}{' '}
                </span>
            ))}
        </span>
    );
}
