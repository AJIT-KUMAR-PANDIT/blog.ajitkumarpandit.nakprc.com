import React, { useState } from 'react';
import { useTTS } from './contexts/tts-context';
import PlaySVG from './icons/svgs/PlaySVG';
import PauseSVG from './icons/svgs/PauseSVG';
import StopSVG from './icons/svgs/StopSVG';
import VolumeUpSVG from './icons/svgs/VolumeUpSVG';
import ChevronDownSVG from './icons/svgs/ChevronDownSVG';
import SettingsSVG from './icons/svgs/SettingsSVG';
import TTSSettingsPanel from './tts-settings-panel';

export const AudioPlayerBar: React.FC = () => {
  const { state, actions } = useTTS();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  if (!state.isVisible || !state.currentTrack) {
    return null;
  }

  const { currentTrack, isPlaying, isPaused, isLoading, progress, currentSentence, totalSentences } = state;

  const handlePlayPause = () => {
    if (isPlaying) {
      actions.pause();
    } else if (isPaused) {
      actions.resume();
    } else {
      actions.play();
    }
  };

  const handleClose = () => {
    actions.stop();
    actions.hidePlayer();
  };

  return (
    <>
      {/* Desktop Version */}
      <div className="hidden md:block">
        <div className="audio-player-bar fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200/60 dark:border-gray-700/60 shadow-2xl">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              {/* Track Info */}
              <div className="flex items-center space-x-4 min-w-0 flex-1">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg shadow-lg">
                  <VolumeUpSVG className="w-6 h-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {currentTrack.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {currentTrack.author && `By ${currentTrack.author} • `}
                    {totalSentences} sentences
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center space-x-4">
                {/* Progress Info */}
                <div className="hidden lg:flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
                  <span>{currentSentence + 1}/{totalSentences}</span>
                  <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                    <div 
                      className="h-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span>{Math.round(progress)}%</span>
                </div>

                {/* Play/Pause Button */}
                <button
                  onClick={handlePlayPause}
                  disabled={isLoading}
                  className="flex items-center justify-center w-10 h-10 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 disabled:cursor-not-allowed"
                  title={isPlaying ? 'Pause' : isPaused ? 'Resume' : 'Play'}
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : isPlaying ? (
                    <PauseSVG className="w-4 h-4" />
                  ) : (
                    <PlaySVG className="w-4 h-4 ml-0.5" />
                  )}
                </button>

                {/* Stop Button */}
                <button
                  onClick={actions.stop}
                  className="flex items-center justify-center w-8 h-8 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-200"
                  title="Stop"
                >
                  <StopSVG className="w-4 h-4" />
                </button>

                {/* Settings Button */}
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="flex items-center justify-center w-8 h-8 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-200"
                  title="Audio settings"
                >
                  <SettingsSVG className="w-4 h-4" />
                </button>

                {/* Close Button */}
                <button
                  onClick={handleClose}
                  className="flex items-center justify-center w-8 h-8 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-200"
                  title="Close player"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Mobile Progress Bar */}
            <div className="md:hidden mt-2">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                <div 
                  className="h-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Version */}
      <div className="md:hidden">
        <div className="fixed bottom-0 left-0 right-0 z-50">
          {/* Expandable Panel */}
          {isExpanded && (
            <div className="audio-player-expanded bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4">
              <div className="space-y-4">
                {/* Track Info */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg">
                    <VolumeUpSVG className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                      {currentTrack.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {currentTrack.author && `By ${currentTrack.author}`}
                    </p>
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="h-2 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>Sentence {currentSentence + 1} of {totalSentences}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={actions.stop}
                    className="flex items-center justify-center w-12 h-12 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-200"
                    title="Stop"
                  >
                    <StopSVG className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={handlePlayPause}
                    disabled={isLoading}
                    className="flex items-center justify-center w-16 h-16 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 disabled:cursor-not-allowed"
                    title={isPlaying ? 'Pause' : isPaused ? 'Resume' : 'Play'}
                  >
                    {isLoading ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : isPlaying ? (
                      <PauseSVG className="w-6 h-6" />
                    ) : (
                      <PlaySVG className="w-6 h-6 ml-1" />
                    )}
                  </button>

                  <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="flex items-center justify-center w-12 h-12 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-200"
                    title="Audio settings"
                  >
                    <SettingsSVG className="w-5 h-5" />
                  </button>

                  <button
                    onClick={handleClose}
                    className="flex items-center justify-center w-12 h-12 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-200"
                    title="Close player"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Mini Player Bar */}
          <div className="audio-player-bar bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200/60 dark:border-gray-700/60 shadow-2xl">
            <div className="px-4 py-3">
              <div className="flex items-center justify-between">
                {/* Track Info & Expand Button */}
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex items-center space-x-3 min-w-0 flex-1 text-left"
                >
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg shadow-lg">
                    <VolumeUpSVG className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                      {currentTrack.title}
                    </h3>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 mt-1">
                      <div 
                        className="h-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                  <ChevronDownSVG 
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Quick Controls */}
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={handlePlayPause}
                    disabled={isLoading}
                    className="flex items-center justify-center w-10 h-10 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 disabled:cursor-not-allowed"
                    title={isPlaying ? 'Pause' : isPaused ? 'Resume' : 'Play'}
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : isPlaying ? (
                      <PauseSVG className="w-4 h-4" />
                    ) : (
                      <PlaySVG className="w-4 h-4 ml-0.5" />
                    )}
                  </button>

                  <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="flex items-center justify-center w-8 h-8 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-200"
                    title="Audio settings"
                  >
                    <SettingsSVG className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleClose}
                    className="flex items-center justify-center w-8 h-8 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-200"
                    title="Close player"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Settings Panel */}
      <TTSSettingsPanel 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </>
  );
};

export default AudioPlayerBar;