import { useState, useEffect } from 'react';
import { useRoute, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { MobileFrame } from "@/components/MobileFrame";
import { stories } from "@/lib/storyData";
import { useSpeechToText, useTextToSpeech } from "@/hooks/useVoice";
import { Book3D, SequentialHighlighter } from "@/components/Book3D";
import { QuizInterface } from "@/components/QuizInterface";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Volume2, BookOpen, X, ChevronLeft, Award, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

export default function Book() {
  const [match, params] = useRoute("/read/:genre/:storyId");
  const [, setLocation] = useLocation();
  const genreId = params?.genre || 'animals';
  const storyId = params?.storyId;
  
  // Find the specific story
  const genreStories = stories[genreId] || [];
  const story = genreStories.find(s => s.id === storyId) || genreStories[0];

  // States: 'cover' | 'reading' | 'ended' | 'quiz'
  const [bookState, setBookState] = useState<'cover' | 'reading' | 'ended' | 'quiz'>('cover');
  const [pageIndex, setPageIndex] = useState(0);
  
  // Controls automatic page turning
  const [autoTurnTrigger, setAutoTurnTrigger] = useState(0);

  // Turn page logic (hoisted for use in TTS callback)
  const turnPage = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      if (pageIndex < story.pages.length - 1) {
        setPageIndex(p => p + 1);
        resetTranscript(); // Clear karaoke transcript on page turn
      } else {
        setBookState('ended');
      }
    } else {
      if (pageIndex > 0) {
        setPageIndex(p => p - 1);
        resetTranscript();
      } else {
        setBookState('cover');
      }
    }
  };

  // Voice Hooks
  const { isListening, transcript, startListening, stopListening, resetTranscript } = useSpeechToText();
  
  // TTS Hook with Auto-Turn Callback
  const { isSpeaking, speak, stop: stopSpeaking } = useTextToSpeech({
      onEnd: () => {
          // Only auto-turn if we are still in "Explain" mode and not at the end
          // We use a small timeout to make it feel natural
          setTimeout(() => {
              // We need to check a ref or state to see if we should continue
              // For simplicity, we trigger a state change that the Effect will catch
              setAutoTurnTrigger(t => t + 1);
          }, 1000);
      }
  });
  
  // Local UI State
  const [isRecordMode, setIsRecordMode] = useState(false);
  const [isExplainMode, setIsExplainMode] = useState(false);

  // Effect: Handle Auto-Turn Trigger
  useEffect(() => {
      if (autoTurnTrigger > 0 && isExplainMode && bookState === 'reading') {
          if (pageIndex < story.pages.length - 1) {
              turnPage('next');
          } else {
              // End of book, stop explaining
              setIsExplainMode(false);
              setBookState('ended');
          }
      }
  }, [autoTurnTrigger]);

  // Effect: Auto-read new page if Explain Mode is ON
  useEffect(() => {
      if (isExplainMode && bookState === 'reading') {
          // Small delay to allow page flip animation to start/finish roughly
          const timer = setTimeout(() => {
              speak(story.pages[pageIndex].text);
          }, 800);
          return () => clearTimeout(timer);
      }
  }, [pageIndex, isExplainMode, bookState]);


  // Auto-stop recording/speaking when story ends
  useEffect(() => {
    if (bookState === 'ended' || bookState === 'quiz') {
      setIsRecordMode(false);
      stopListening();
      stopSpeaking();
      setIsExplainMode(false);
    }
  }, [bookState]);

  // Handle Record Toggle
  const toggleRecord = () => {
    if (isRecordMode) {
      setIsRecordMode(false);
      stopListening();
    } else {
      setIsRecordMode(true);
      setIsExplainMode(false); // Mutually exclusive
      stopSpeaking();
      startListening();
    }
  };

  // Handle Explain Toggle 
  const toggleExplain = () => {
    if (isExplainMode) {
      setIsExplainMode(false);
      stopSpeaking();
    } else {
      setIsExplainMode(true);
      setIsRecordMode(false); // Mutually exclusive
      stopListening();
      // Effect will pick this up and start speaking
    }
  };

  // Swipe Handler
  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.x < -50) { // Swipe Left -> Next
        turnPage('next');
    } else if (info.offset.x > 50) { // Swipe Right -> Prev
        turnPage('prev');
    }
  };

  return (
    <MobileFrame orientation="landscape">
      <div className="w-full h-full flex flex-col bg-zinc-900 relative perspective-2000">
        
        {/* Navigation / Close */}
        <div className="absolute top-4 left-4 z-50">
           <Button variant="ghost" className="rounded-full w-10 h-10 p-0 bg-black/20 hover:bg-black/40 text-white backdrop-blur-md" onClick={() => setLocation(`/book/${genreId}`)}>
             <ChevronLeft className="w-6 h-6" />
           </Button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 w-full h-full relative overflow-hidden flex items-center justify-center p-4 md:p-8">
            <AnimatePresence mode="wait">
                
                {/* STATE: COVER */}
                {bookState === 'cover' && (
                    <motion.div 
                        key="cover"
                        initial={{ opacity: 0, rotateY: -90 }}
                        animate={{ opacity: 1, rotateY: 0 }}
                        exit={{ opacity: 0, rotateY: 90 }}
                        transition={{ duration: 0.6 }}
                        className="w-full max-w-4xl h-full flex items-center justify-center"
                    >
                         <div className="text-center space-y-6 max-w-lg w-full p-8 md:p-12 bg-white rounded-[40px] shadow-[0_30px_60px_rgba(0,0,0,0.5)] border-r-[12px] border-stone-200 relative overflow-hidden group">
                             {/* Book Spine Effect */}
                             <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-stone-300 to-stone-100 border-r border-stone-300"></div>
                             
                             <motion.img 
                                layoutId={`image-${story.title}`}
                                src={story.pages[0].image} 
                                className="w-48 h-48 md:w-64 md:h-64 mx-auto rounded-full object-cover border-8 border-stone-100 shadow-2xl" 
                             />
                             
                             <div className="relative z-10">
                                <h1 className="text-4xl md:text-6xl font-story font-bold text-stone-800 mb-2">{story.title}</h1>
                                <p className="text-stone-500 text-lg">Swipe to open the book</p>
                             </div>

                             <Button 
                                onClick={() => setBookState('reading')}
                                className="w-full py-8 text-2xl rounded-2xl bg-stone-800 hover:bg-black text-white font-bold shadow-xl transition-all hover:scale-105"
                             >
                                <BookOpen className="mr-3 w-8 h-8" /> Start Reading
                             </Button>
                         </div>
                    </motion.div>
                )}

                {/* STATE: READING */}
                {bookState === 'reading' && (
                    <motion.div 
                        key="book-spread"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-6xl h-full aspect-[3/2] relative perspective-2000"
                    >
                         {/* The Book Container */}
                         <div className="w-full h-full flex bg-white rounded-[20px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden relative border border-stone-200">
                             
                             {/* Left Page (Image) */}
                             <div className="w-1/2 h-full bg-stone-50 border-r border-stone-300 relative overflow-hidden p-6 flex items-center justify-center">
                                 <motion.div
                                    key={`img-${pageIndex}`}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                    className="w-full h-full relative"
                                 >
                                     <img 
                                        src={story.pages[pageIndex].image} 
                                        className="w-full h-full object-contain drop-shadow-2xl" 
                                     />
                                 </motion.div>
                                 <div className="absolute bottom-6 left-6 font-story text-stone-400">Page {pageIndex + 1}</div>
                             </div>

                             {/* Right Page (Text) */}
                             <div className="w-1/2 h-full bg-[#fffbf0] relative overflow-hidden flex flex-col p-8 md:p-16">
                                  {/* Paper Texture */}
                                  <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] pointer-events-none" />
                                  
                                  {/* Page Turn Overlay (Simulated 3D Flip) */}
                                  <AnimatePresence>
                                      <motion.div
                                        key={`overlay-${pageIndex}`}
                                        initial={{ opacity: 0, rotateY: -10, transformOrigin: "left" }}
                                        animate={{ opacity: 0, rotateY: 0 }}
                                        exit={{ opacity: [0, 1, 0], rotateY: -90, x: -500 }}
                                        transition={{ duration: 0.6 }}
                                        className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent pointer-events-none z-50"
                                      />
                                  </AnimatePresence>

                                  <div className="prose prose-lg md:prose-2xl font-story leading-loose text-stone-800 flex-1 overflow-y-auto z-10 scrollbar-hide">
                                      <p>
                                        <SequentialHighlighter 
                                            text={story.pages[pageIndex].text} 
                                            transcript={transcript} 
                                            isRecordMode={isRecordMode} 
                                        />
                                      </p>
                                  </div>

                                  {/* Interaction Hints */}
                                  <div className="mt-4 flex justify-between items-center text-stone-400 text-sm font-bold uppercase tracking-widest">
                                      <span onClick={() => turnPage('prev')} className="cursor-pointer hover:text-stone-600">Previous</span>
                                      <span onClick={() => turnPage('next')} className="cursor-pointer hover:text-stone-600">Next</span>
                                  </div>
                             </div>

                             {/* Center Spine Shadow */}
                             <div className="absolute left-1/2 top-0 bottom-0 w-16 -ml-8 bg-gradient-to-r from-black/5 via-transparent to-black/5 pointer-events-none z-20" />
                         </div>
                    </motion.div>
                )}

                {/* STATE: ENDED */}
                {bookState === 'ended' && (
                    <motion.div 
                        key="ended"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full h-full flex items-center justify-center"
                    >
                         <Card className="w-full max-w-2xl bg-white/95 backdrop-blur-xl border-none shadow-2xl p-12 text-center rounded-[40px]">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", delay: 0.2 }}
                                className="w-32 h-32 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-8"
                            >
                                <Award className="w-16 h-16 text-yellow-500" />
                            </motion.div>
                            <h2 className="text-6xl font-story font-bold mb-6 text-stone-800">The End</h2>
                            <p className="text-2xl text-stone-500 mb-12">You've completed the story!</p>
                            
                            <div className="grid grid-cols-2 gap-6">
                                <Button 
                                    onClick={() => setBookState('quiz')}
                                    className="h-20 text-xl rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold"
                                >
                                    Start Quiz
                                </Button>
                                <Button 
                                    variant="outline"
                                    onClick={() => setLocation(`/book/${genreId}`)}
                                    className="h-20 text-xl rounded-2xl border-4 border-stone-200 hover:bg-stone-100"
                                >
                                    Back to Stories
                                </Button>
                            </div>
                         </Card>
                    </motion.div>
                )}

                {/* STATE: QUIZ */}
                {bookState === 'quiz' && (
                    <motion.div 
                         key="quiz"
                         initial={{ y: "100%" }}
                         animate={{ y: 0 }}
                         exit={{ y: "100%" }}
                         transition={{ type: "spring", damping: 25 }}
                         className="absolute inset-0 bg-white z-50 overflow-y-auto"
                    >
                         <div className="min-h-full flex flex-col max-w-3xl mx-auto p-4 md:p-8">
                             <div className="flex justify-end mb-4">
                                 <Button variant="ghost" size="icon" className="rounded-full w-12 h-12 bg-stone-100" onClick={() => setBookState('ended')}>
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
                className="h-24 bg-white/10 backdrop-blur-xl border-t border-white/10 flex items-center justify-center gap-12 px-8 z-40 shadow-2xl"
            >
                {/* Explain Button */}
                <div className="flex flex-col items-center gap-2 group cursor-pointer" onClick={toggleExplain}>
                     <div className={cn(
                        "w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg",
                        isExplainMode ? "bg-blue-500 text-white scale-110" : "bg-white text-stone-400 hover:bg-blue-50 hover:text-blue-500"
                     )}>
                        {isSpeaking ? <Volume2 className="w-6 h-6 animate-pulse" /> : <PlayCircle className="w-6 h-6" />}
                     </div>
                     <span className="text-[10px] font-bold uppercase tracking-widest text-white/60 group-hover:text-white">Explain</span>
                </div>

                {/* Record Button */}
                <div className="flex flex-col items-center gap-2 group cursor-pointer" onClick={toggleRecord}>
                     <div className={cn(
                        "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl border-4",
                        isRecordMode ? "bg-red-500 border-red-400 text-white scale-110 animate-pulse" : "bg-white border-transparent text-stone-400 hover:bg-red-50 hover:text-red-500"
                     )}>
                        {isRecordMode ? <Mic className="w-8 h-8" /> : <MicOff className="w-8 h-8" />}
                     </div>
                     <span className="text-[10px] font-bold uppercase tracking-widest text-white/60 group-hover:text-white">Record</span>
                </div>
            </motion.div>
        )}
      </div>
    </MobileFrame>
  );
}
