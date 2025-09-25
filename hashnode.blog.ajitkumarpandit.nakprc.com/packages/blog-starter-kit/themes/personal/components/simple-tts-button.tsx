import React from 'react';
import { useTTS, TTSTrack } from './contexts/tts-context';
import PlaySVG from './icons/svgs/PlaySVG';
import PauseSVG from './icons/svgs/PauseSVG';
import VolumeUpSVG from './icons/svgs/VolumeUpSVG';

interface SimpleTTSButtonProps {
  track: TTSTrack;
  className?: string;
  variant?: 'compact' | 'full';
}

export const SimpleTTSButton: React.FC<SimpleTTSButtonProps> = ({ 
  track, 
  className = '',
  variant = 'full'
}) => {
  const { state, actions } = useTTS();

  const isCurrentTrack = state.currentTrack?.id === track.id;
  const isPlaying = isCurrentTrack && state.isPlaying;
  const isPaused = isCurrentTrack && state.isPaused;
  const isLoading = isCurrentTrack && state.isLoading;

  const handleClick = () => {
    if (isCurrentTrack) {
      // If this track is currently selected
      if (isPlaying) {
        actions.pause();
      } else if (isPaused) {
        actions.resume();
      } else {
        actions.play();
      }
    } else {
      // Start playing this track
      actions.playTrack(track);
    }
    // Always ensure player is visible when user interacts
    actions.showPlayer();
  };

  if (variant === 'compact') {
    return (
      <button
        onClick={handleClick}
        disabled={isLoading}
        className={`group relative flex items-center justify-center w-12 h-12 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 disabled:cursor-not-allowed ${className}`}
        title={isPlaying ? 'Pause article' : 'Listen to article'}
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : isPlaying ? (
          <PauseSVG className="w-5 h-5" />
        ) : (
          <VolumeUpSVG className="w-5 h-5" />
        )}
        
        <div className="absolute -top-2 -right-2 -translate-y-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="px-2 py-1 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs rounded whitespace-nowrap">
            {isPlaying ? 'Pause' : 'Listen'}
          </div>
        </div>
      </button>
    );
  }

  return (
    <div className={`bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-xl border border-gray-200/60 dark:border-gray-700/60 shadow-lg p-4 mb-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <VolumeUpSVG className="w-5 h-5 text-primary-500" />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              Listen to Article
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isCurrentTrack && state.totalSentences > 0 
                ? `${state.totalSentences} sentences • ~${Math.ceil(state.totalSentences * 3)} min`
                : 'Click to start listening'
              }
            </p>
          </div>
        </div>
        
        <button
          onClick={handleClick}
          disabled={isLoading}
          className="flex items-center justify-center w-12 h-12 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 disabled:cursor-not-allowed"
          title={isPlaying ? 'Pause article' : 'Listen to article'}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : isPlaying ? (
            <PauseSVG className="w-5 h-5" />
          ) : (
            <PlaySVG className="w-5 h-5 ml-0.5" />
          )}
        </button>
      </div>
      
      {/* Progress indicator for current track */}
      {isCurrentTrack && state.totalSentences > 0 && (
        <div className="mt-3">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="h-2 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-300"
              style={{ width: `${state.progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>
              {state.totalSentences > 0 
                ? `Sentence ${state.currentSentence + 1} of ${state.totalSentences}` 
                : 'Ready to play'
              }
            </span>
            <span>{Math.round(state.progress)}%</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleTTSButton;