import { useState, useEffect, useCallback, useRef } from 'react';

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
        let fullStr = '';
        for (let i = 0; i < event.results.length; i++) {
          fullStr += event.results[i][0].transcript + ' ';
        }
        setTranscript(fullStr.trim());
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        // Don't auto-stop on no-speech, just keep listening
        if (event.error === 'not-allowed') {
             setIsListening(false);
        }
      };
      
      recognitionRef.current.onend = () => {
          // Only restart if explicitly still in "listening" state
          // and we haven't manually stopped it
          if (isListening && recognitionRef.current) {
             try {
                // Check if already started to avoid error
                // Unfortunately isStarted property isn't standard, so we wrap in try/catch
                recognitionRef.current.start();
             } catch (e) {
                 // Ignore "already started" errors
             }
          }
      };
    }
  }, [isListening]);

  const startListening = useCallback(() => {
    setTranscript('');
    setIsListening(true);
    try {
        // Stop first just in case
        if (recognitionRef.current) {
            try { recognitionRef.current.stop(); } catch(e) {}
            setTimeout(() => {
                 try { recognitionRef.current?.start(); } catch(e) {}
            }, 100);
        }
    } catch(e) { }
  }, []);

  const stopListening = useCallback(() => {
    setIsListening(false);
    try {
      recognitionRef.current?.stop();
    } catch(e) { }
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    // If we are listening, we might want to restart the session to clear the buffer
    if(recognitionRef.current && isListening) {
        recognitionRef.current.stop(); 
        // It will auto-restart due to onend, but let's be safe
        setTimeout(() => {
            if(isListening) recognitionRef.current.start();
        }, 100);
    }
  }, [isListening]);

  return { isListening, transcript, startListening, stopListening, resetTranscript };
}

export function useTextToSpeech({ onEnd }: { onEnd?: () => void } = {}) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Keep a ref to the onEnd callback so we can use the latest version without re-creating the utterance effect
  const onEndRef = useRef(onEnd);
  useEffect(() => { onEndRef.current = onEnd; }, [onEnd]);

  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => {
        setIsSpeaking(false);
        if (onEndRef.current) onEndRef.current();
      };
      utterance.onstart = () => setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const stop = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return { isSpeaking, speak, stop };
}
