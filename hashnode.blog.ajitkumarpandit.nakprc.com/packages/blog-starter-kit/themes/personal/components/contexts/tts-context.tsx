import React, { createContext, useContext, useState, useRef, useCallback } from 'react';

interface TTSTrack {
  id: string;
  title: string;
  content: string;
  author?: string;
  publishedAt?: string;
  url?: string;
}

interface TTSState {
  currentTrack: TTSTrack | null;
  isPlaying: boolean;
  isPaused: boolean;
  isLoading: boolean;
  progress: number;
  currentSentence: number;
  totalSentences: number;
  isVisible: boolean;
  settings: {
    rate: number;
    pitch: number;
    volume: number;
    voiceIndex: number;
  };
}

interface TTSContextType {
  state: TTSState;
  actions: {
    playTrack: (track: TTSTrack) => void;
    play: () => void;
    pause: () => void;
    stop: () => void;
    resume: () => void;
    updateSettings: (settings: Partial<TTSState['settings']>) => void;
    setProgress: (progress: number, sentence: number) => void;
    hidePlayer: () => void;
    showPlayer: () => void;
  };
}

const TTSContext = createContext<TTSContextType | null>(null);

interface TTSProviderProps {
  children: React.ReactNode;
}

export const TTSProvider: React.FC<TTSProviderProps> = ({ children }) => {
  const [state, setState] = useState<TTSState>({
    currentTrack: null,
    isPlaying: false,
    isPaused: false,
    isLoading: false,
    progress: 0,
    currentSentence: 0,
    totalSentences: 0,
    isVisible: false,
    settings: {
      rate: 1,
      pitch: 1,
      volume: 0.8,
      voiceIndex: 0,
    },
  });

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const sentencesRef = useRef<string[]>([]);
  const currentSentenceIndexRef = useRef(0);

  // Extract text content from HTML
  const extractTextContent = useCallback((htmlContent: string): string => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    // Remove code blocks, script tags, and other non-readable content
    const elementsToRemove = tempDiv.querySelectorAll('script, style, code, pre');
    elementsToRemove.forEach(el => el.remove());
    
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    
    return textContent
      .replace(/\s+/g, ' ')
      .replace(/\n+/g, ' ')
      .trim();
  }, []);

  // Split text into sentences
  const splitIntoSentences = useCallback((text: string): string[] => {
    return text
      .split(/[.!?]+/)
      .map(sentence => sentence.trim())
      .filter(sentence => sentence.length > 0)
      .map(sentence => sentence + '.');
  }, []);

  // Speak a sentence
  const speakSentence = useCallback((sentenceIndex: number) => {
    if (!window.speechSynthesis || sentenceIndex >= sentencesRef.current.length) {
      return;
    }

    const sentence = sentencesRef.current[sentenceIndex];
    const utterance = new SpeechSynthesisUtterance(sentence);
    
    // Apply settings
    utterance.rate = state.settings.rate;
    utterance.pitch = state.settings.pitch;
    utterance.volume = state.settings.volume;

    // Set voice if available
    const voices = window.speechSynthesis.getVoices();
    if (voices[state.settings.voiceIndex]) {
      utterance.voice = voices[state.settings.voiceIndex];
    }

    utterance.onstart = () => {
      setState(prev => ({
        ...prev,
        currentSentence: sentenceIndex,
        progress: (sentenceIndex / sentencesRef.current.length) * 100,
      }));
    };

    utterance.onend = () => {
      if (sentenceIndex < sentencesRef.current.length - 1) {
        currentSentenceIndexRef.current = sentenceIndex + 1;
        setTimeout(() => speakSentence(sentenceIndex + 1), 100);
      } else {
        // Finished reading
        setState(prev => ({
          ...prev,
          isPlaying: false,
          isPaused: false,
          progress: 100,
          currentSentence: 0,
        }));
        currentSentenceIndexRef.current = 0;
      }
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setState(prev => ({
        ...prev,
        isPlaying: false,
        isPaused: false,
        isLoading: false,
      }));
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [state.settings]);

  const actions = {
    playTrack: (track: TTSTrack) => {
      try {
        // Stop any current playback
        window.speechSynthesis.cancel();
        
        // Prepare content
        const textContent = extractTextContent(track.content);
        const contentWithTitle = `${track.title}. ${textContent}`;
        sentencesRef.current = splitIntoSentences(contentWithTitle);
        
        setState(prev => ({
          ...prev,
          currentTrack: track,
          isLoading: true,
          totalSentences: sentencesRef.current.length,
          progress: 0,
          currentSentence: 0,
          isVisible: true,
        }));

        // Start playback
        currentSentenceIndexRef.current = 0;
        speakSentence(0);
        
        setState(prev => ({
          ...prev,
          isPlaying: true,
          isPaused: false,
          isLoading: false,
        }));
      } catch (error) {
        console.error('Failed to play track:', error);
        setState(prev => ({
          ...prev,
          isPlaying: false,
          isPaused: false,
          isLoading: false,
        }));
      }
    },

    play: () => {
      if (state.currentTrack && sentencesRef.current.length > 0) {
        try {
          setState(prev => ({ ...prev, isLoading: true }));
          currentSentenceIndexRef.current = 0;
          speakSentence(0);
          setState(prev => ({
            ...prev,
            isPlaying: true,
            isPaused: false,
            isLoading: false,
            progress: 0,
            currentSentence: 0,
          }));
        } catch (error) {
          console.error('Failed to play:', error);
          setState(prev => ({
            ...prev,
            isPlaying: false,
            isLoading: false,
          }));
        }
      }
    },

    pause: () => {
      try {
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.pause();
          setState(prev => ({
            ...prev,
            isPaused: true,
            isPlaying: false,
          }));
        }
      } catch (error) {
        console.error('Failed to pause:', error);
      }
    },

    resume: () => {
      try {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
          setState(prev => ({
            ...prev,
            isPaused: false,
            isPlaying: true,
          }));
        }
      } catch (error) {
        console.error('Failed to resume:', error);
      }
    },

    stop: () => {
      try {
        window.speechSynthesis.cancel();
        setState(prev => ({
          ...prev,
          isPlaying: false,
          isPaused: false,
          progress: 0,
          currentSentence: 0,
        }));
        currentSentenceIndexRef.current = 0;
      } catch (error) {
        console.error('Failed to stop:', error);
      }
    },

    updateSettings: (newSettings: Partial<TTSState['settings']>) => {
      setState(prev => ({
        ...prev,
        settings: { ...prev.settings, ...newSettings },
      }));
    },

    setProgress: (progress: number, sentence: number) => {
      setState(prev => ({
        ...prev,
        progress,
        currentSentence: sentence,
      }));
    },

    hidePlayer: () => {
      setState(prev => ({ ...prev, isVisible: false }));
    },

    showPlayer: () => {
      setState(prev => ({ ...prev, isVisible: true }));
    },
  };

  return (
    <TTSContext.Provider value={{ state, actions }}>
      {children}
    </TTSContext.Provider>
  );
};

export const useTTS = (): TTSContextType => {
  const context = useContext(TTSContext);
  if (!context) {
    throw new Error('useTTS must be used within a TTSProvider');
  }
  return context;
};

export type { TTSTrack };