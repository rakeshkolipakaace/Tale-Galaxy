import { useState, useEffect } from 'react';
import { useRoute, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { MobileFrame } from "@/components/MobileFrame";
import { stories, genres } from "@/lib/storyData";
import { useSpeechToText, useTextToSpeech } from "@/hooks/useVoice";
import { QuizInterface } from "@/components/QuizInterface";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Volume2, VolumeX, BookOpen, X, ChevronLeft, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

export default function Book() {
  const [match, params] = useRoute("/book/:genre");
  const [, setLocation] = useLocation();
  const genreId = params?.genre || 'animals';
  const story = stories['animals']; // Hardcoded for demo, normally would use genreId to find story

  // States: 'cover' | 'reading' | 'ended' | 'quiz'
  const [bookState, setBookState] = useState<'cover' | 'reading' | 'ended' | 'quiz'>('cover');
  const [pageIndex, setPageIndex] = useState(0);
  
  // Voice Hooks
  const { isListening, transcript, startListening, stopListening } = useSpeechToText();
  const { isSpeaking, speak, stop: stopSpeaking } = useTextToSpeech();
  
  // Local UI State
  const [isRecordMode, setIsRecordMode] = useState(false);
  const [isExplainMode, setIsExplainMode] = useState(false);

  // Auto-stop recording when story ends
  useEffect(() => {
    if (bookState === 'ended' || bookState === 'quiz') {
      if (isRecordMode) {
        setIsRecordMode(false);
        stopListening();
      }
      stopSpeaking();
    }
  }, [bookState]);

  // Handle Record Toggle
  const toggleRecord = () => {
    if (isRecordMode) {
      setIsRecordMode(false);
      stopListening();
    } else {
      setIsRecordMode(true);
      startListening();
    }
  };

  // Handle Explain Toggle (Auto-read current page)
  const toggleExplain = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsExplainMode(false);
    } else {
      setIsExplainMode(true);
      // Read current page text
      if (bookState === 'reading') {
        speak(story.pages[pageIndex].text);
      }
    }
  };

  // Page Navigation
  const turnPage = (direction: 'next' | 'prev') => {
    stopSpeaking(); // Stop reading if page turns
    
    if (direction === 'next') {
      if (pageIndex < story.pages.length - 1) {
        setPageIndex(p => p + 1);
      } else {
        setBookState('ended');
      }
    } else {
      if (pageIndex > 0) {
        setPageIndex(p => p - 1);
      } else {
        // Close book if going back from page 0? Or just stay?
        // Let's go back to cover
        setBookState('cover');
      }
    }
  };

  // Swipe Handler
  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.x < -50) { // Swipe Left -> Next
      if (bookState === 'cover') {
         setBookState('reading');
      } else if (bookState === 'reading') {
         turnPage('next');
      } else if (bookState === 'ended') {
         setBookState('cover'); // Close book
      }
    } else if (info.offset.x > 50) { // Swipe Right -> Prev
      if (bookState === 'reading') {
        turnPage('prev');
      }
    }
  };
  
  // Highlight logic (very basic matching)
  const highlightText = (text: string, transcript: string) => {
    if (!isRecordMode) return text;
    
    // Simple logic: if transcript contains words from the text, highlight them?
    // Actually, user asked: "Wherever he/she is reading the paragraphs the voice should be Recorded... create a highlighting color for that line"
    // Since we don't have word-level timestamps from simple WebSpeechAPI, we can just highlight the whole block if "recording" is active to show "Listen Mode"
    // OR we can try to match the last spoken words.
    
    // Let's highlight the whole paragraph in a subtle way to indicate "Active Reading Zone" 
    // and maybe highlight words that appear in the transcript if they match.
    
    const words = text.split(' ');
    return (
        <span>
            {words.map((word, i) => {
                const cleanWord = word.replace(/[^a-zA-Z]/g, '').toLowerCase();
                const cleanTranscript = transcript.toLowerCase();
                // Extremely naive matching (if word is in transcript anywhere). 
                // Better: Check if word is in the *recent* transcript.
                const isRead = cleanTranscript.includes(cleanWord) && cleanTranscript.length > 5;
                
                return (
                    <span key={i} className={isRead ? "bg-yellow-200 text-black transition-colors duration-500" : ""}>
                        {word}{' '}
                    </span>
                );
            })}
        </span>
    );
  };

  return (
    <MobileFrame orientation="landscape">
      <div className="w-full h-full flex flex-col bg-zinc-900 relative">
        
        {/* Navigation / Close */}
        <div className="absolute top-4 left-4 z-50">
           <Button variant="ghost" className="rounded-full w-10 h-10 p-0 bg-white/10 hover:bg-white/20 text-white" onClick={() => setLocation('/')}>
             <ChevronLeft className="w-6 h-6" />
           </Button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 w-full h-full relative overflow-hidden">
            <AnimatePresence mode="wait">
                
                {/* STATE: COVER */}
                {bookState === 'cover' && (
                    <motion.div 
                        key="cover"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, x: -100 }}
                        className="w-full h-full flex items-center justify-center bg-stone-800"
                    >
                         <div className="text-center space-y-6 max-w-md p-8 bg-paper rounded-2xl shadow-2xl border-4 border-stone-700">
                             <img src={story.pages[0].image} className="w-48 h-48 mx-auto rounded-full object-cover border-4 border-stone-300 shadow-inner" />
                             <h1 className="text-4xl font-story font-bold">{story.title}</h1>
                             <p className="text-stone-500">Swipe or Click Open to begin your adventure.</p>
                             <Button 
                                onClick={() => setBookState('reading')}
                                className="w-full py-6 text-xl rounded-xl bg-primary hover:bg-primary/90 text-white font-bold"
                             >
                                <BookOpen className="mr-2 w-6 h-6" /> Open Book
                             </Button>
                         </div>
                    </motion.div>
                )}

                {/* STATE: READING */}
                {bookState === 'reading' && (
                    <motion.div 
                        key={`page-${pageIndex}`}
                        initial={{ opacity: 0, x: 200, rotateY: 10 }}
                        animate={{ opacity: 1, x: 0, rotateY: 0 }}
                        exit={{ opacity: 0, x: -200, rotateY: -10 }}
                        transition={{ type: "spring", stiffness: 200, damping: 25 }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        onDragEnd={handleDragEnd}
                        className="w-full h-full flex bg-paper shadow-2xl overflow-hidden"
                    >
                        {/* Left Page: Image */}
                        <div className="w-1/2 h-full p-4 flex items-center justify-center bg-stone-100 border-r border-stone-300 relative overflow-hidden">
                           <img 
                                src={story.pages[pageIndex].image} 
                                className="w-full h-full object-contain drop-shadow-xl" 
                                alt="Story illustration" 
                           />
                           <div className="absolute bottom-4 left-4 bg-white/80 px-3 py-1 rounded-full text-xs font-bold text-stone-500">
                               Page {pageIndex + 1}
                           </div>
                        </div>

                        {/* Right Page: Text */}
                        <div className="w-1/2 h-full p-8 md:p-12 flex flex-col justify-center bg-[#fffbf0] relative">
                             {/* Paper Texture Effect */}
                             <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]"></div>
                             
                             <div className="prose prose-xl font-story leading-relaxed text-ink select-none">
                                <p className="text-2xl md:text-3xl">
                                    {highlightText(story.pages[pageIndex].text, transcript)}
                                </p>
                             </div>

                             {/* Voice Icon Animation (When Listening) */}
                             <AnimatePresence>
                                 {isRecordMode && (
                                     <motion.div 
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0 }}
                                        className="absolute bottom-6 right-6"
                                     >
                                         <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center animate-pulse">
                                             <Mic className="w-8 h-8 text-red-500" />
                                         </div>
                                     </motion.div>
                                 )}
                             </AnimatePresence>
                        </div>
                    </motion.div>
                )}

                {/* STATE: ENDED */}
                {bookState === 'ended' && (
                    <motion.div 
                        key="ended"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        drag="x"
                        onDragEnd={handleDragEnd}
                        className="w-full h-full flex bg-stone-900 text-white"
                    >
                        {/* Left: Ended Message */}
                        <div className="w-1/2 h-full flex flex-col items-center justify-center p-12 bg-stone-800 border-r border-stone-700">
                            <motion.div 
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                className="text-center"
                            >
                                <h2 className="text-5xl font-serif font-bold mb-4 text-primary">The End</h2>
                                <p className="text-stone-400 text-lg mb-8">You've finished the story!</p>
                                <div className="text-sm text-stone-500">Swipe left to close book</div>
                            </motion.div>
                        </div>

                        {/* Right: Quiz Entry */}
                        <div className="w-1/2 h-full flex flex-col items-center justify-center p-12 bg-stone-900">
                            <Card className="w-full max-w-sm p-8 bg-stone-800 border-stone-700 text-center space-y-6">
                                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                                    <Award className="w-10 h-10 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Test Your Knowledge</h3>
                                    <p className="text-stone-400">Take a quick quiz to see how much you remember!</p>
                                </div>
                                <Button 
                                    onClick={() => setBookState('quiz')}
                                    className="w-full py-6 text-lg bg-primary hover:bg-primary/90 text-white"
                                >
                                    Open Quiz
                                </Button>
                            </Card>
                        </div>
                    </motion.div>
                )}

                {/* STATE: QUIZ */}
                {bookState === 'quiz' && (
                    <motion.div 
                         key="quiz"
                         initial={{ y: "100%" }}
                         animate={{ y: 0 }}
                         className="w-full h-full bg-paper z-20 overflow-y-auto"
                    >
                         <div className="h-full flex flex-col">
                             <div className="p-4 flex justify-end">
                                 <Button variant="ghost" onClick={() => setBookState('ended')}>
                                     <X className="w-6 h-6" />
                                 </Button>
                             </div>
                             <div className="flex-1">
                                 <QuizInterface onComplete={() => {}} />
                             </div>
                         </div>
                    </motion.div>
                )}

            </AnimatePresence>
        </div>

        {/* Footer Controls (Only visible when reading) */}
        {(bookState === 'reading') && (
            <motion.div 
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                className="h-20 bg-stone-900 border-t border-stone-800 flex items-center justify-between px-12"
            >
                {/* Explain Button */}
                <div className="flex flex-col items-center gap-1">
                     <span className="text-[10px] text-stone-500 uppercase tracking-wider font-bold">Explain</span>
                     <Button 
                        variant={isExplainMode ? "default" : "outline"}
                        size="icon"
                        onClick={toggleExplain}
                        className={cn(
                            "rounded-full w-12 h-12 transition-all",
                            isExplainMode ? "bg-blue-500 hover:bg-blue-600 border-none" : "border-stone-600 text-stone-400 hover:text-white hover:bg-stone-800"
                        )}
                     >
                        {isSpeaking ? <Volume2 className="w-5 h-5 animate-pulse" /> : <Volume2 className="w-5 h-5" />}
                     </Button>
                </div>

                <div className="text-stone-600 text-sm font-medium">
                    Page {pageIndex + 1} of {story.pages.length}
                </div>

                {/* Record Button */}
                <div className="flex flex-col items-center gap-1">
                     <span className="text-[10px] text-stone-500 uppercase tracking-wider font-bold">Record</span>
                     <Button 
                        variant={isRecordMode ? "default" : "outline"}
                        size="icon"
                        onClick={toggleRecord}
                        className={cn(
                            "rounded-full w-12 h-12 transition-all",
                            isRecordMode ? "bg-red-500 hover:bg-red-600 border-none shadow-[0_0_15px_rgba(239,68,68,0.5)]" : "border-stone-600 text-stone-400 hover:text-white hover:bg-stone-800"
                        )}
                     >
                        {isRecordMode ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                     </Button>
                </div>
            </motion.div>
        )}
      </div>
    </MobileFrame>
  );
}
