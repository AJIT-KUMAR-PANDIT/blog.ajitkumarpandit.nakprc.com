import React, { useState, useEffect, useRef, useCallback } from 'react';
import PlaySVG from './icons/svgs/PlaySVG';
import PauseSVG from './icons/svgs/PauseSVG';
import StopSVG from './icons/svgs/StopSVG';
import VolumeUpSVG from './icons/svgs/VolumeUpSVG';
import ChevronDownSVG from './icons/svgs/ChevronDownSVG';

interface TextToSpeechProps {
  content: string;
  title?: string;
  className?: string;
}

interface SpeechSettings {
  rate: number;
  pitch: number;
  volume: number;
  voiceIndex: number;
}

export const TextToSpeech: React.FC<TextToSpeechProps> = ({ 
  content, 
  title,
  className = '' 
}) => {
  const [isSupported, setIsSupported] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentSentence, setCurrentSentence] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [settings, setSettings] = useState<SpeechSettings>({
    rate: 1,
    pitch: 1,
    volume: 0.8,
    voiceIndex: 0
  });

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const sentences = useRef<string[]>([]);
  const currentSentenceIndex = useRef(0);

  // Check for browser support and load voices
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      setIsSupported(true);
      
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
        
        // Try to find a good default voice (English)
        const englishVoice = availableVoices.findIndex(voice => 
          voice.lang.startsWith('en') && voice.localService
        );
        if (englishVoice !== -1) {
          setSettings(prev => ({ ...prev, voiceIndex: englishVoice }));
        }
      };

      // Load voices immediately if available
      loadVoices();
      
      // Set up event listener for when voices are loaded
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }

      // Load saved settings
      const savedSettings = localStorage.getItem('tts-settings');
      if (savedSettings) {
        try {
          setSettings(JSON.parse(savedSettings));
        } catch (e) {
          console.warn('Failed to parse saved TTS settings');
        }
      }
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('tts-settings', JSON.stringify(settings));
  }, [settings]);

  // Extract text content from HTML
  const extractTextContent = useCallback((htmlContent: string): string => {
    // Create a temporary div to parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    // Remove code blocks, script tags, and other non-readable content
    const elementsToRemove = tempDiv.querySelectorAll('script, style, code, pre');
    elementsToRemove.forEach(el => el.remove());
    
    // Get clean text content
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    
    // Clean up the text
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

  // Prepare content for speech
  useEffect(() => {
    if (content) {
      const textContent = extractTextContent(content);
      const contentWithTitle = title ? `${title}. ${textContent}` : textContent;
      sentences.current = splitIntoSentences(contentWithTitle);
    }
  }, [content, title, extractTextContent, splitIntoSentences]);

  const speakSentence = useCallback((sentenceIndex: number) => {
    if (!isSupported || sentenceIndex >= sentences.current.length) {
      return;
    }

    const sentence = sentences.current[sentenceIndex];
    const utterance = new SpeechSynthesisUtterance(sentence);
    
    // Apply settings
    utterance.rate = settings.rate;
    utterance.pitch = settings.pitch;
    utterance.volume = settings.volume;
    
    if (voices[settings.voiceIndex]) {
      utterance.voice = voices[settings.voiceIndex];
    }

    utterance.onstart = () => {
      setCurrentSentence(sentenceIndex);
      setProgress((sentenceIndex / sentences.current.length) * 100);
    };

    utterance.onend = () => {
      if (sentenceIndex < sentences.current.length - 1) {
        currentSentenceIndex.current = sentenceIndex + 1;
        setTimeout(() => speakSentence(sentenceIndex + 1), 100);
      } else {
        // Finished reading
        setIsPlaying(false);
        setIsPaused(false);
        setProgress(100);
        currentSentenceIndex.current = 0;
      }
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsPlaying(false);
      setIsPaused(false);
      setIsLoading(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [isSupported, settings, voices]);

  const handlePlay = () => {
    if (!isSupported || sentences.current.length === 0) return;

    setIsLoading(true);
    
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
    } else {
      setIsPlaying(true);
      setIsPaused(false);
      currentSentenceIndex.current = 0;
      setProgress(0);
      speakSentence(0);
    }
    
    setIsLoading(false);
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
    setProgress(0);
    setCurrentSentence(0);
    currentSentenceIndex.current = 0;
  };

  const handleSettingChange = (key: keyof SpeechSettings, value: number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className={`text-to-speech ${className}`}>
      {/* Main Controls */}
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-xl border border-gray-200/60 dark:border-gray-700/60 shadow-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <VolumeUpSVG className="w-5 h-5 text-primary-500" />
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              Listen to Article
            </h3>
          </div>
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Voice Settings"
          >
            <ChevronDownSVG 
              className={`w-4 h-4 text-gray-500 transition-transform ${
                showSettings ? 'rotate-180' : ''
              }`} 
            />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <div 
              className="progress-bar h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-300 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>{sentences.current.length > 0 ? `${currentSentence + 1}/${sentences.current.length} sentences` : 'Ready to play'}</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="control-buttons flex items-center gap-3">
          {!isPlaying && !isPaused && (
            <button
              onClick={handlePlay}
              disabled={isLoading || sentences.current.length === 0}
              className="flex items-center justify-center w-12 h-12 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 disabled:cursor-not-allowed"
              title="Play article"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <PlaySVG className="w-5 h-5 ml-0.5" />
              )}
            </button>
          )}
          
          {isPlaying && (
            <button
              onClick={handlePause}
              className="flex items-center justify-center w-12 h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
              title="Pause"
            >
              <PauseSVG className="w-5 h-5" />
            </button>
          )}
          
          {isPaused && (
            <button
              onClick={handlePlay}
              className="flex items-center justify-center w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
              title="Resume"
            >
              <PlaySVG className="w-5 h-5 ml-0.5" />
            </button>
          )}
          
          {(isPlaying || isPaused) && (
            <button
              onClick={handleStop}
              className="flex items-center justify-center w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
              title="Stop"
            >
              <StopSVG className="w-4 h-4" />
            </button>
          )}
          
          <div className="text-info ml-auto text-sm text-gray-600 dark:text-gray-400">
            {sentences.current.length} sentences • ~{Math.ceil(sentences.current.length * 3)} min
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="settings-grid grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Voice Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Voice
                </label>
                <select
                  value={settings.voiceIndex}
                  onChange={(e) => handleSettingChange('voiceIndex', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                >
                  {voices.map((voice, index) => (
                    <option key={index} value={index}>
                      {voice.name} ({voice.lang})
                    </option>
                  ))}
                </select>
              </div>

              {/* Speed */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Speed: {settings.rate}x
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={settings.rate}
                  onChange={(e) => handleSettingChange('rate', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Pitch */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Pitch: {settings.pitch}
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={settings.pitch}
                  onChange={(e) => handleSettingChange('pitch', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Volume */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Volume: {Math.round(settings.volume * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={settings.volume}
                  onChange={(e) => handleSettingChange('volume', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextToSpeech;