import { Link } from "wouter";
import { motion } from "framer-motion";
import { genres } from "@/lib/storyData";
import { MobileFrame } from "@/components/MobileFrame";
import { BookOpen, Star, Sparkles, Wand2, Music, Mountain } from "lucide-react";

export default function Home() {
  return (
    <MobileFrame orientation="portrait">
      <div className="h-full w-full bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 flex flex-col relative overflow-hidden">
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute bg-white/10 rounded-full blur-xl"
                    initial={{ 
                        x: Math.random() * 1000, 
                        y: Math.random() * 1000, 
                        scale: Math.random() * 0.5 + 0.5 
                    }}
                    animate={{ 
                        y: [null, Math.random() * -100],
                        x: [null, Math.random() * 50 - 25],
                    }}
                    transition={{ 
                        duration: Math.random() * 10 + 10, 
                        repeat: Infinity, 
                        ease: "linear" 
                    }}
                    style={{
                        width: Math.random() * 200 + 50,
                        height: Math.random() * 200 + 50,
                    }}
                />
            ))}
        </div>

        {/* Header */}
        <header className="pt-8 pb-4 px-8 sticky top-0 z-10 backdrop-blur-sm bg-black/20 border-b border-white/10">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-center gap-2 mb-2"
          >
            <div className="bg-yellow-400/20 p-2 rounded-lg">
                <Sparkles className="w-6 h-6 text-yellow-400" />
            </div>
            <span className="text-sm font-bold tracking-[0.2em] text-blue-200 uppercase">StoryTime</span>
          </motion.div>
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-story font-bold text-white leading-tight drop-shadow-lg"
          >
            Choose your<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Adventure</span>
          </motion.h1>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide z-10 perspective-1000">
          {genres.map((genre, index) => (
            <Link key={genre.id} href={`/book/${genre.id}`}>
              <motion.div
                initial={{ opacity: 0, rotateX: 20, y: 50 }}
                animate={{ opacity: 1, rotateX: 0, y: 0 }}
                transition={{ delay: index * 0.15 + 0.3, type: "spring" }}
                whileHover={{ scale: 1.05, rotateX: 5, zIndex: 10 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  relative h-56 md:h-64 w-full rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] cursor-pointer group
                  border border-white/10 transform-style-3d
                `}
              >
                {/* Background Image */}
                <img 
                  src={genre.image} 
                  alt={genre.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-125"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />

                {/* 3D Floating Content */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end transform-style-3d">
                  <motion.div 
                    className="translate-z-10"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                      <div className="flex justify-between items-end">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                             <span className={`px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md text-white border border-white/20 uppercase tracking-wider`}>
                                {genre.id}
                             </span>
                          </div>
                          <h2 className="text-4xl font-story font-bold text-white mb-2 drop-shadow-md">{genre.title}</h2>
                        </div>
                        
                        <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:bg-white group-hover:text-purple-600 transition-all duration-300 shadow-lg group-hover:scale-110">
                          <BookOpen className="w-6 h-6 fill-current" />
                        </div>
                      </div>
                  </motion.div>
                </div>
              </motion.div>
            </Link>
          ))}
          <div className="h-20" /> {/* Spacer */}
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent z-20 pointer-events-none">
             <div className="text-center text-white/40 text-xs font-medium uppercase tracking-widest">
                 Swipe to explore
             </div>
        </div>
      </div>
    </MobileFrame>
  );
}
