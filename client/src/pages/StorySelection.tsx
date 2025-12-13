import { useRoute, useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import { MobileFrame } from "@/components/MobileFrame";
import { stories, genres } from "@/lib/storyData";
import { ChevronLeft, BookOpen, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StorySelection() {
  const [match, params] = useRoute("/book/:genre");
  const [, setLocation] = useLocation();
  const genreId = params?.genre || 'animals';
  
  // Get genre details and stories
  const genre = genres.find(g => g.id === genreId);
  const genreStories = stories[genreId] || [];

  return (
    <MobileFrame orientation="portrait">
      <div className="h-full w-full bg-slate-50 flex flex-col relative overflow-hidden">
        
        {/* Header with Genre Theme */}
        <div className={`pt-8 pb-12 px-8 bg-gradient-to-br ${genre?.color || 'from-blue-100 to-white'} rounded-b-[40px] shadow-lg z-10 relative overflow-hidden`}>
           {/* Background Elements */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
           
           <div className="relative z-10">
               <Button 
                 variant="ghost" 
                 className="rounded-full w-10 h-10 p-0 hover:bg-white/40 -ml-2 mb-4" 
                 onClick={() => setLocation('/')}
               >
                 <ChevronLeft className="w-6 h-6 text-slate-700" />
               </Button>
               
               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="flex items-end justify-between"
               >
                   <div>
                       <span className="text-sm font-bold tracking-widest uppercase text-slate-500 mb-1 block">Genre</span>
                       <h1 className="text-4xl font-story font-bold text-slate-800">{genre?.title}</h1>
                   </div>
                   <div className="w-16 h-16 rounded-2xl bg-white shadow-lg overflow-hidden p-1 rotate-3">
                       <img src={genre?.image} className="w-full h-full object-cover rounded-xl" />
                   </div>
               </motion.div>
           </div>
        </div>

        {/* Story List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 -mt-6 z-20 relative">
            {genreStories.map((story, index) => (
                <Link key={story.id} href={`/read/${genreId}/${story.id}`}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex gap-4 cursor-pointer hover:shadow-md transition-all group"
                    >
                        {/* Cover Thumbnail */}
                        <div className="w-20 h-24 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 relative">
                            <img src={story.coverImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 flex flex-col justify-center">
                            <h3 className="font-story font-bold text-xl text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">{story.title}</h3>
                            <p className="text-sm text-slate-400 line-clamp-2 mb-2">{story.description}</p>
                            
                            <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
                                <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    <span>5 min</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                    <span>4.8</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Action Icon */}
                        <div className="flex items-center justify-center pr-2">
                             <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                 <BookOpen className="w-4 h-4" />
                             </div>
                        </div>
                    </motion.div>
                </Link>
            ))}
            <div className="h-12" />
        </div>
      </div>
    </MobileFrame>
  );
}
