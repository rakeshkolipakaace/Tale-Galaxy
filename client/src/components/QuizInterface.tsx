import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function QuizInterface({ onComplete }: { onComplete?: () => void }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const questions = [
    {
      q: "Who is the main character?",
      options: ["A Wolf", "A Rabbit", "A Bear", "A Fox"],
      correct: 1
    },
    {
      q: "What did the rabbit do when he saw the wolf?",
      options: ["Ran away", "Hid in a hole", "Thumped his foot", "Cried"],
      correct: 2
    },
    {
      q: "What does the rabbit like to smell?",
      options: ["Pizza", "Wildflowers", "Carrots", "Rain"],
      correct: 1
    },
    {
      q: "Where does the story take place?",
      options: ["In a city", "On a boat", "In a sunny forest", "In a castle"],
      correct: 2
    },
    {
      q: "What is the lesson of the story?",
      options: ["Run fast", "Eat vegetables", "Be brave even when scared", "Sleep all day"],
      correct: 2
    }
  ];

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
  };

  const submitAnswer = () => {
    if (selectedAnswer === null) return;
    
    if (selectedAnswer === questions[currentQuestion].correct) {
      setScore(s => s + 1);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(q => q + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
      if (onComplete) onComplete();
    }
  };

  if (showResult) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 space-y-6 text-center animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
          <Award className="w-12 h-12 text-yellow-600" />
        </div>
        <h2 className="text-3xl font-story font-bold text-ink">Quiz Complete!</h2>
        <p className="text-xl">You scored {score} out of {questions.length}</p>
        <div className="w-full bg-stone-200 rounded-full h-4 mt-4 overflow-hidden">
          <div 
            className="bg-green-500 h-full transition-all duration-1000" 
            style={{ width: `${(score / questions.length) * 100}%` }}
          />
        </div>
        <p className="text-stone-500 italic mt-4">
            {score === 5 ? "Perfect Score! You're a reading master!" : "Great job! Keep reading!"}
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-6 max-w-lg mx-auto w-full">
      <div className="mb-6 flex justify-between items-center">
        <span className="text-sm font-bold text-stone-400 uppercase tracking-widest">Question {currentQuestion + 1}/{questions.length}</span>
        <span className="text-sm font-bold text-primary">Score: {score}</span>
      </div>

      <h3 className="text-2xl font-story font-bold text-ink mb-8 leading-relaxed">
        {questions[currentQuestion].q}
      </h3>

      <div className="space-y-3 flex-1">
        {questions[currentQuestion].options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handleAnswer(idx)}
            className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 flex items-center justify-between group
              ${selectedAnswer === idx 
                ? 'border-primary bg-primary/10 text-primary-dark' 
                : 'border-stone-200 hover:border-primary/50 hover:bg-stone-50'
              }`}
          >
            <span className="font-medium">{opt}</span>
            {selectedAnswer === idx && <Check className="w-5 h-5 text-primary" />}
          </button>
        ))}
      </div>

      <Button 
        onClick={submitAnswer}
        disabled={selectedAnswer === null}
        className="mt-8 w-full py-6 text-lg rounded-xl shadow-lg bg-primary hover:bg-primary/90 text-white font-bold tracking-wide"
      >
        {currentQuestion === questions.length - 1 ? "Finish Quiz" : "Next Question"}
      </Button>
    </div>
  );
}
