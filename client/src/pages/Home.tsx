import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { genres, ageGroups } from "@/lib/storyData";
import { BookOpen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const [selectedAge, setSelectedAge] = useState<string>("3-5");

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col relative overflow-auto">
      
      {/* Subtle Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-200/20 rounded-full blur-3xl -z-10" />

      {/* Header */}
      <header className="pt-8 pb-6 px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-center justify-between mb-4"
          >
            {/* Left Spacer for balance */}
            <div className="w-32 hidden sm:block" />
            
            {/* Center Logo */}
            <div className="flex items-center justify-center gap-2">
              <div className="bg-blue-600/10 p-2 rounded-xl">
                <Sparkles className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-lg font-bold tracking-[0.2em] text-blue-600 uppercase">
                StoryTime
              </span>
            </div>
            
            {/* Right Side - Age Selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-600 hidden sm:inline">Age:</span>
              <Select value={selectedAge} onValueChange={setSelectedAge}>
                <SelectTrigger 
                  className="w-32 bg-white border-blue-200 hover:border-blue-300 transition-colors"
                  data-testid="select-age"
                >
                  <SelectValue placeholder="Select age" />
                </SelectTrigger>
                <SelectContent>
                  {ageGroups.map((age) => (
                    <SelectItem 
                      key={age.value} 
                      value={age.value}
                      data-testid={`age-option-${age.value}`}
                    >
                      {age.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>
          
          {/* Main Title */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-story font-bold text-slate-800 leading-tight mb-2">
              Choose your
            </h1>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-story font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500 leading-tight">
              Adventure
            </h1>
          </motion.div>
        </div>
      </header>

      {/* Genre Cards Grid */}
      <div className="flex-1 px-4 sm:px-6 lg:px-8 pb-12 z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {genres.map((genre, index) => (
              <Link 
                key={genre.id} 
                href={`/book/${genre.id}?age=${selectedAge}`}
                data-testid={`genre-card-${genre.id}`}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card className="overflow-hidden border-blue-100 shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer bg-white">
                    <CardContent className="p-0">
                      <div className="relative">
                        {/* Genre Image */}
                        <div className="w-full aspect-[4/3] overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50">
                          <img 
                            src={genre.image} 
                            alt={genre.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        
                        {/* Overlay gradient on hover */}
                        <div className={`absolute inset-0 bg-gradient-to-t ${genre.color} opacity-0 group-hover:opacity-30 transition-opacity duration-300`} />
                        
                        {/* Content */}
                        <div className="p-5">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h2 className="text-2xl font-story font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                              {genre.title}
                            </h2>
                            <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors flex-shrink-0">
                              <BookOpen className="w-5 h-5" />
                            </div>
                          </div>
                          
                          <p className="text-sm text-slate-500 mb-3 line-clamp-2">
                            {genre.description}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="bg-blue-50 px-3 py-1.5 rounded-full text-xs font-semibold text-blue-600">
                              10 Stories
                            </div>
                            <span className="text-xs font-medium text-slate-400 group-hover:text-blue-500 transition-colors">
                              Explore →
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
