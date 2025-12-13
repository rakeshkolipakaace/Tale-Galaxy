import { useState, useEffect, useRef } from 'react';

export function useSpeechToText() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            setTranscript(prev => prev + ' ' + event.results[i][0].transcript);
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        // We could use interimTranscript for real-time highlighting if we wanted to be fancy
        setTranscript(prev => {
             // Simple deduping strategy or just append
             return prev; 
        });
        // Actually, for this simpler implementation, let's just expose the latest transcript chunk
        if(event.results[event.results.length - 1][0].transcript) {
            setTranscript(event.results[event.results.length - 1][0].transcript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
          // Auto-restart if it stops but we think we are listening (unless manually stopped)
          if (isListening) {
             try {
                recognitionRef.current.start();
             } catch (e) {
                 // ignore
             }
          }
      };
    }
  }, [isListening]);

  const startListening = () => {
    setTranscript('');
    setIsListening(true);
    try {
      recognitionRef.current?.start();
    } catch(e) {
      console.error(e);
    }
  };

  const stopListening = () => {
    setIsListening(false);
    try {
      recognitionRef.current?.stop();
    } catch(e) {
      console.error(e);
    }
  };

  return { isListening, transcript, startListening, stopListening };
}

export function useTextToSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any current speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onstart = () => setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const stop = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return { isSpeaking, speak, stop };
}
