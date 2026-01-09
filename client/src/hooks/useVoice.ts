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

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current.onend = () => {
        if (isListening) {
          try {
            recognitionRef.current.start();
          } catch (e) {
            // Already started or other error, ignore
          }
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        if (event.error === 'no-speech' || event.error === 'aborted' || event.error === 'network') {
          return; // Ignore common errors and let onend handle restart
        }
        console.error('Speech recognition error', event.error);
        if (event.error === 'not-allowed') {
          setIsListening(false);
        }
      };
    }
  }, [isListening]);

  const startListening = useCallback(() => {
    setTranscript('');
    setIsListening(true);
    try {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        setTimeout(() => {
          try {
            recognitionRef.current.start();
          } catch (e) {}
        }, 200);
      }
    } catch (e) {}
  }, []);

  const stopListening = useCallback(() => {
    setIsListening(false);
    try {
      recognitionRef.current?.stop();
    } catch (e) {}
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
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
