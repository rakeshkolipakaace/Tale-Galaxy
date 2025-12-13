import { Link } from "wouter";
import { motion } from "framer-motion";
import { genres } from "@/lib/storyData";
import { MobileFrame } from "@/components/MobileFrame";
import { BookOpen, Star, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <MobileFrame orientation="portrait">
      <div className="h-full w-full bg-blue-50/50 flex flex-col relative overflow-hidden">
        
        {/* Subtle Background Blobs */}
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-100 to-transparent -z-10" />
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute top-40 -left-20 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl" />

        {/* Centered Header */}
        <header className="pt-12 pb-8 px-6 text-center relative z-10">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-center justify-center gap-2 mb-3"
          >
            <div className="bg-blue-600/10 p-2 rounded-xl">
                <Sparkles className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm font-bold tracking-[0.2em] text-blue-600 uppercase">StoryTime</span>
          </motion.div>
          
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-story font-bold text-slate-800 leading-tight"
          >
            Choose your<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Adventure</span>
          </motion.h1>
        </header>

        {/* Genre Cards Grid */}
        <div className="flex-1 overflow-y-auto px-6 pb-8 scrollbar-hide z-10">
          <div className="grid grid-cols-1 gap-6 max-w-lg mx-auto">
            {genres.map((genre, index) => (
              <Link key={genre.id} href={`/book/${genre.id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white rounded-3xl p-2 shadow-lg border border-slate-100 cursor-pointer group overflow-hidden relative"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${genre.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  <div className="flex h-32 relative z-10">
                      {/* Image Side */}
                      <div className="w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0 shadow-inner">
                          <img 
                            src={genre.image} 
                            alt={genre.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                      </div>
                      
                      {/* Text Side */}
                      <div className="flex-1 pl-5 py-2 flex flex-col justify-center">
                          <h2 className="text-2xl font-story font-bold text-slate-800 mb-1 group-hover:text-blue-900 transition-colors">{genre.title}</h2>
                          <p className="text-sm text-slate-500 font-medium mb-3">{genre.description}</p>
                          
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                              <div className="bg-slate-100 px-2 py-1 rounded-md group-hover:bg-white/50 transition-colors">
                                10 Stories
                              </div>
                          </div>
                      </div>

                      {/* Arrow Icon */}
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          <div className="w-10 h-10 rounded-full bg-slate-50 text-slate-300 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                             <BookOpen className="w-5 h-5" />
                          </div>
                      </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
          <div className="h-12" />
        </div>
      </div>
    </MobileFrame>
  );
}
