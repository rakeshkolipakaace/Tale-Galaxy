import { useRoute, useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import { stories, genres } from "@/lib/storyData";
import { ChevronLeft, BookOpen, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function StorySelection() {
  const [match, params] = useRoute("/book/:genre");
  const [, setLocation] = useLocation();
  const genreId = params?.genre || 'animals';
  
  // Get age from URL query parameter
  const searchParams = new URLSearchParams(window.location.search);
  const selectedAge = searchParams.get('age') || '3-5';
  
  // Get genre details and filter stories by age
  const genre = genres.find(g => g.id === genreId);
  const allGenreStories = stories[genreId] || [];
  const genreStories = allGenreStories.filter(story => story.ageGroup === selectedAge);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col relative overflow-auto">
      
      {/* Subtle Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-200/20 rounded-full blur-3xl -z-10" />
      
      {/* Header with Genre Theme */}
      <div className={`pt-8 pb-12 px-6 sm:px-8 bg-gradient-to-br ${genre?.color || 'from-blue-100 to-white'} rounded-b-[40px] shadow-md z-10 relative overflow-hidden`}>
         {/* Background Elements */}
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/30 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
         
         <div className="max-w-5xl mx-auto relative z-10">
             <Button 
               variant="ghost" 
               className="rounded-full w-10 h-10 p-0 hover:bg-white/40 -ml-2 mb-4" 
               onClick={() => setLocation('/')}
               data-testid="button-back"
             >
               <ChevronLeft className="w-6 h-6 text-slate-700" />
             </Button>
             
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4"
             >
                 <div>
                     <span className="text-sm font-bold tracking-widest uppercase text-slate-500 mb-1 block">Genre</span>
                     <h1 className="text-4xl sm:text-5xl font-story font-bold text-slate-800">{genre?.title}</h1>
                     <p className="text-slate-600 mt-2">{genreStories.length} stories for ages {selectedAge}</p>
                 </div>
                 <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white shadow-lg overflow-hidden p-1 rotate-3">
                     <img src={genre?.image} className="w-full h-full object-cover rounded-xl" alt={genre?.title} />
                 </div>
             </motion.div>
         </div>
      </div>

      {/* Story Grid */}
      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8 z-10">
          <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {genreStories.map((story, index) => (
                      <Link key={story.id} href={`/read/${genreId}/${story.id}`}>
                          <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              whileHover={{ y: -6, transition: { duration: 0.2 } }}
                              whileTap={{ scale: 0.98 }}
                              data-testid={`story-card-${story.id}`}
                          >
                              <Card className="overflow-hidden border-blue-100 shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer bg-white h-full">
                                  <CardContent className="p-0">
                                      {/* Cover Image */}
                                      <div className="w-full aspect-[3/4] overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50">
                                          <img 
                                              src={story.coverImage} 
                                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                              alt={story.title}
                                          />
                                      </div>
                                      
                                      {/* Content */}
                                      <div className="p-4">
                                          <h3 className="font-story font-bold text-xl text-slate-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                                              {story.title}
                                          </h3>
                                          <p className="text-sm text-slate-500 line-clamp-2 mb-3">
                                              {story.description}
                                          </p>
                                          
                                          <div className="flex items-center justify-between">
                                              <div className="flex items-center gap-3 text-xs font-medium text-slate-400">
                                                  <div className="flex items-center gap-1">
                                                      <Clock className="w-3 h-3" />
                                                      <span>5 min</span>
                                                  </div>
                                                  <div className="flex items-center gap-1">
                                                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                                      <span>4.8</span>
                                                  </div>
                                              </div>
                                              
                                              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                  <BookOpen className="w-4 h-4" />
                                              </div>
                                          </div>
                                      </div>
                                  </CardContent>
                              </Card>
                          </motion.div>
                      </Link>
                  ))}
              </div>
              
              {genreStories.length === 0 && (
                  <div className="text-center py-12">
                      <p className="text-slate-500 text-lg">No stories available for this age group yet.</p>
                  </div>
              )}
          </div>
      </div>
    </div>
  );
}
