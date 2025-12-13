import { Link } from "wouter";
import { motion } from "framer-motion";
import { genres } from "@/lib/storyData";
import { MobileFrame } from "@/components/MobileFrame";
import { BookOpen, Star, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <MobileFrame orientation="portrait">
      <div className="h-full w-full bg-paper flex flex-col">
        {/* Header */}
        <header className="pt-12 pb-6 px-8 bg-white/50 backdrop-blur-sm sticky top-0 z-10 border-b border-stone-100">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-center gap-2 mb-2"
          >
            <Sparkles className="w-5 h-5 text-yellow-500" />
            <span className="text-xs font-bold tracking-widest text-stone-400 uppercase">StoryTime</span>
          </motion.div>
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-story font-bold text-ink leading-tight"
          >
            Choose your<br/>Genres
          </motion.h1>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
          {genres.map((genre, index) => (
            <Link key={genre.id} href={`/book/${genre.id}`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  relative h-48 w-full rounded-[32px] overflow-hidden shadow-lg cursor-pointer group
                  ${genre.color}
                `}
              >
                {/* Background Image */}
                <img 
                  src={genre.image} 
                  alt={genre.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <div className="flex justify-between items-end">
                    <div>
                      <h2 className="text-3xl font-story font-bold text-white mb-1">{genre.title}</h2>
                      <div className="flex items-center gap-2 text-white/90 text-sm font-medium">
                        <BookOpen className="w-4 h-4" />
                        <span>3 Stories</span>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-white group-hover:text-primary transition-colors">
                      <Star className="w-5 h-5 fill-current" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
          <div className="h-12" /> {/* Spacer */}
        </div>
      </div>
    </MobileFrame>
  );
}
