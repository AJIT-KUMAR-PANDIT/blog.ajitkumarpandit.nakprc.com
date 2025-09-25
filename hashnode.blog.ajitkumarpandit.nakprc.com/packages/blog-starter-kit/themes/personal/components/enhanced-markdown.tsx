import { useEmbeds } from '@starter-kit/utils/renderer/hooks/useEmbeds';
import { markdownToHtml } from '@starter-kit/utils/renderer/markdownToHtml';
import { memo, useEffect, useRef } from 'react';
import { CodeBlock, InlineCode } from './code-block';

type Props = {
  contentMarkdown: string;
};

const _EnhancedMarkdown = ({ contentMarkdown }: Props) => {
  const content = markdownToHtml(contentMarkdown);
  const contentRef = useRef<HTMLDivElement>(null);
  useEmbeds({ enabled: true });

  useEffect(() => {
    if (contentRef.current) {
      // Find all pre elements and replace with custom code blocks
      const preElements = contentRef.current.querySelectorAll('pre');
      
      preElements.forEach((pre) => {
        const codeElement = pre.querySelector('code');
        if (codeElement) {
          const codeText = codeElement.textContent || '';
          const className = codeElement.className || '';
          
          // Create wrapper div
          const wrapper = document.createElement('div');
          wrapper.className = 'relative group my-6 rounded-lg overflow-hidden border border-neutral-700 bg-neutral-900 shadow-2xl';
          
          // Create header with copy button
          const header = document.createElement('div');
          header.className = 'flex items-center justify-between px-4 py-3 bg-neutral-800 border-b border-neutral-700';
          
          // Language indicator and dots
          const leftSection = document.createElement('div');
          leftSection.className = 'flex items-center gap-2';
          
          const dots = document.createElement('div');
          dots.className = 'flex items-center gap-1.5';
          dots.innerHTML = `
            <div class="w-3 h-3 rounded-full bg-red-500"></div>
            <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div class="w-3 h-3 rounded-full bg-green-500"></div>
          `;
          leftSection.appendChild(dots);
          
          // Detect language
          let language = 'text';
          if (className.includes('language-')) {
            language = className.replace('language-', '').replace('hljs', '').trim();
          }
          
          if (language && language !== 'text') {
            const langSpan = document.createElement('span');
            langSpan.className = 'ml-3 text-xs font-mono text-neutral-400 bg-neutral-700 px-2 py-1 rounded uppercase tracking-wide';
            langSpan.textContent = language;
            leftSection.appendChild(langSpan);
          }
          
          header.appendChild(leftSection);
          
          // Copy button
          const copyButton = document.createElement('button');
          copyButton.className = 'flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-700 hover:bg-neutral-600 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-neutral-800';
          copyButton.innerHTML = `
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
            <span>Copy</span>
          `;
          
          // Copy functionality
          copyButton.addEventListener('click', async () => {
            try {
              await navigator.clipboard.writeText(codeText);
              copyButton.innerHTML = `
                <svg class="w-3 h-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span class="text-green-400">Copied!</span>
              `;
              setTimeout(() => {
                copyButton.innerHTML = `
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                  </svg>
                  <span>Copy</span>
                `;
              }, 2000);
            } catch (err) {
              console.error('Failed to copy text: ', err);
            }
          });
          
          header.appendChild(copyButton);
          wrapper.appendChild(header);
          
          // Create content div
          const contentDiv = document.createElement('div');
          contentDiv.className = 'relative';
          
          // Create new pre element to avoid circular reference
          const newPre = document.createElement('pre');
          newPre.className = 'overflow-x-auto p-4 bg-neutral-900 text-sm leading-relaxed scrollbar-thin scrollbar-thumb-neutral-600 scrollbar-track-neutral-800 m-0';
          
          // Create new code element
          const newCodeElement = document.createElement('code');
          newCodeElement.style.background = 'transparent';
          newCodeElement.style.color = '#f1f5f9';
          newCodeElement.className = `block text-neutral-100 font-mono ${className}`;
          newCodeElement.textContent = codeText;
          
          newPre.appendChild(newCodeElement);
          contentDiv.appendChild(newPre);
          wrapper.appendChild(contentDiv);
          
          // Replace original pre with wrapper
          pre.parentNode?.replaceChild(wrapper, pre);
        }
      });
      
      // Handle inline code elements (not inside pre tags)
      const inlineCodeElements = contentRef.current.querySelectorAll('code:not(pre code)');
      inlineCodeElements.forEach((code) => {
        code.className = 'px-2 py-1 text-sm font-mono bg-neutral-800 text-neutral-100 rounded border border-neutral-700';
        (code as HTMLElement).style.background = '#262626';
        (code as HTMLElement).style.color = '#f1f5f9';
        (code as HTMLElement).style.border = '1px solid #404040';
      });
    }
  }, [content]);

  return (
    <div
      ref={contentRef}
      className="hashnode-content-style mx-auto w-full px-5 md:max-w-screen-md"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export const EnhancedMarkdown = memo(_EnhancedMarkdown);