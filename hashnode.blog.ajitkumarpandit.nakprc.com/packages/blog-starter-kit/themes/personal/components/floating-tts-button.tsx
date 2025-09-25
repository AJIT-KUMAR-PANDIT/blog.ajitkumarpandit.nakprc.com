import React, { useState, useEffect, useRef } from 'react';
import PlaySVG from './icons/svgs/PlaySVG';
import PauseSVG from './icons/svgs/PauseSVG';
import StopSVG from './icons/svgs/StopSVG';
import VolumeUpSVG from './icons/svgs/VolumeUpSVG';

interface FloatingTTSButtonProps {
  content: string;
  title?: string;
  className?: string;
}

export const FloatingTTSButton: React.FC<FloatingTTSButtonProps> = ({ 
  content, 
  title,
  className = '' 
}) => {
  const [isSupported, setIsSupported] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      setIsSupported(true);
    }
  }, []);

  const extractTextContent = (htmlContent: string): string => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    // Remove non-readable content
    const elementsToRemove = tempDiv.querySelectorAll('script, style, code, pre');
    elementsToRemove.forEach(el => el.remove());
    
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    return textContent.replace(/\s+/g, ' ').trim();
  };

  const handlePlay = () => {
    if (!isSupported) return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
    } else {
      const textContent = extractTextContent(content);
      const contentWithTitle = title ? `${title}. ${textContent}` : textContent;
      
      const utterance = new SpeechSynthesisUtterance(contentWithTitle);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 0.8;

      utterance.onstart = () => {
        setIsPlaying(true);
        setIsPaused(false);
      };

      utterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
      };

      utterance.onerror = () => {
        setIsPlaying(false);
        setIsPaused(false);
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handlePause = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className={`floating-tts-button ${className}`}>
      {!isPlaying && !isPaused ? (
        <button
          onClick={handlePlay}
          className="group relative flex items-center justify-center w-12 h-12 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-neutral-700/50 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110"
          title="Listen to article"
        >
          <VolumeUpSVG className="w-5 h-5 text-primary-500" />
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 -translate-x-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="px-2 py-1 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs rounded whitespace-nowrap">
              Listen to article
            </div>
          </div>
        </button>
      ) : (
        <div className="flex gap-2">
          {isPlaying ? (
            <button
              onClick={handlePause}
              className="group relative flex items-center justify-center w-12 h-12 bg-orange-500/90 backdrop-blur-sm rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110"
              title="Pause"
            >
              <PauseSVG className="w-5 h-5 text-white" />
            </button>
          ) : (
            <button
              onClick={handlePlay}
              className="group relative flex items-center justify-center w-12 h-12 bg-green-500/90 backdrop-blur-sm rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110"
              title="Resume"
            >
              <PlaySVG className="w-5 h-5 text-white ml-0.5" />
            </button>
          )}
          
          <button
            onClick={handleStop}
            className="group relative flex items-center justify-center w-10 h-10 bg-red-500/90 backdrop-blur-sm rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110"
            title="Stop"
          >
            <StopSVG className="w-4 h-4 text-white" />
          </button>
        </div>
      )}
    </div>
  );
};

export default FloatingTTSButton;