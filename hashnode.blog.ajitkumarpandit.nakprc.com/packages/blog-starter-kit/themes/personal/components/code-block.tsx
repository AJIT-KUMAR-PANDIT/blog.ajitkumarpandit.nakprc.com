import React, { useState, useRef, useEffect } from 'react';
import { FiCopy, FiCheck } from 'react-icons/fi';

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
  language?: string;
}

export const CodeBlock = ({ children, className, language }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLElement>(null);
  const [codeText, setCodeText] = useState('');

  useEffect(() => {
    if (codeRef.current) {
      const text = codeRef.current.textContent || '';
      setCodeText(text);
    }
  }, [children]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const detectLanguage = (className: string) => {
    if (className && className.includes('language-')) {
      return className.replace('language-', '').replace('hljs', '').trim();
    }
    return 'text';
  };

  const displayLanguage = language || detectLanguage(className || '');

  return (
    <div className="relative group my-6 rounded-lg overflow-hidden border border-neutral-700 bg-neutral-900 shadow-2xl">
      {/* Header with language indicator and copy button */}
      <div className="flex items-center justify-between px-4 py-3 bg-neutral-800 border-b border-neutral-700">
        <div className="flex items-center gap-2">
          {/* Dots */}
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          
          {/* Language indicator */}
          {displayLanguage && displayLanguage !== 'text' && (
            <span className="ml-3 text-xs font-mono text-neutral-400 bg-neutral-700 px-2 py-1 rounded uppercase tracking-wide">
              {displayLanguage}
            </span>
          )}
        </div>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-700 hover:bg-neutral-600 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-neutral-800"
          aria-label={copied ? 'Copied!' : 'Copy code'}
        >
          {copied ? (
            <>
              <FiCheck className="w-3 h-3 text-green-400" />
              <span className="text-green-400">Copied!</span>
            </>
          ) : (
            <>
              <FiCopy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code content */}
      <div className="relative">
        <pre className="overflow-x-auto p-4 bg-neutral-900 text-sm leading-relaxed scrollbar-thin scrollbar-thumb-neutral-600 scrollbar-track-neutral-800">
          <code
            ref={codeRef}
            className={`block text-neutral-100 font-mono ${className || ''}`}
            style={{
              background: 'transparent !important',
              color: '#f1f5f9 !important',
            }}
          >
            {children}
          </code>
        </pre>
        
        {/* Copy overlay - appears on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neutral-900/10 to-transparent"></div>
        </div>
      </div>
    </div>
  );
};

// Inline code component
interface InlineCodeProps {
  children: React.ReactNode;
}

export const InlineCode = ({ children }: InlineCodeProps) => {
  return (
    <code className="px-2 py-1 text-sm font-mono bg-neutral-800 text-neutral-100 rounded border border-neutral-700">
      {children}
    </code>
  );
};