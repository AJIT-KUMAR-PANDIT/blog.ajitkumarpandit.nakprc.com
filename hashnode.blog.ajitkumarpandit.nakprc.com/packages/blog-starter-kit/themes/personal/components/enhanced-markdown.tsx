import { useEmbeds } from '@starter-kit/utils/renderer/hooks/useEmbeds';
import { markdownToHtml } from '@starter-kit/utils/renderer/markdownToHtml';
import { memo, useEffect, useRef } from 'react';
import { CodeBlock, InlineCode } from './code-block';
import hljs from 'highlight.js/lib/common';

type Props = {
  contentMarkdown: string;
};

const _EnhancedMarkdown = ({ contentMarkdown }: Props) => {
  const content = markdownToHtml(contentMarkdown);
  const contentRef = useRef<HTMLDivElement>(null);
  useEmbeds({ enabled: true });

  useEffect(() => {
    if (contentRef.current) {
      // First apply syntax highlighting to all code blocks
      const codeBlocks = contentRef.current.querySelectorAll('pre code');
      codeBlocks.forEach((block) => {
        const htmlBlock = block as HTMLElement;
        if (!htmlBlock.dataset.highlighted) {
          hljs.highlightElement(htmlBlock);
          htmlBlock.dataset.highlighted = 'true';
        }
      });
      
      // Wait a bit for highlighting to complete, then apply custom styling
      setTimeout(() => {
        // Find all pre elements and replace with custom code blocks
        const preElements = contentRef.current?.querySelectorAll('pre');
        if (!preElements) return;
      
        preElements.forEach((pre) => {
        const codeElement = pre.querySelector('code');
        if (codeElement) {
          const codeText = codeElement.textContent || '';
          const className = codeElement.className || '';
          
          // Create wrapper div with vibrant gradient
          const wrapper = document.createElement('div');
          wrapper.className = 'relative group my-6 rounded-xl overflow-hidden border border-purple-500/30 shadow-2xl';
          wrapper.style.background = 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)';
          wrapper.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 30px rgba(139, 69, 193, 0.1)';
          
          // Create header with vibrant gradient
          const header = document.createElement('div');
          header.className = 'flex items-center justify-between px-4 py-3 border-b border-purple-500/20';
          header.style.background = 'linear-gradient(90deg, #1a1a2e 0%, #16213e 100%)';
          header.style.backdropFilter = 'blur(10px)';
          
          // Language indicator and dots
          const leftSection = document.createElement('div');
          leftSection.className = 'flex items-center gap-2';
          
          const dots = document.createElement('div');
          dots.className = 'flex items-center gap-1.5';
          dots.innerHTML = `
            <div class="w-3 h-3 rounded-full bg-red-400 shadow-lg shadow-red-400/50 animate-pulse"></div>
            <div class="w-3 h-3 rounded-full bg-yellow-400 shadow-lg shadow-yellow-400/50 animate-pulse" style="animation-delay: 0.2s"></div>
            <div class="w-3 h-3 rounded-full bg-green-400 shadow-lg shadow-green-400/50 animate-pulse" style="animation-delay: 0.4s"></div>
          `;
          leftSection.appendChild(dots);
          
          // Detect language
          let language = 'text';
          if (className.includes('language-')) {
            language = className.replace('language-', '').replace('hljs', '').trim();
          }
          
          if (language && language !== 'text') {
            const langSpan = document.createElement('span');
            langSpan.className = 'ml-3 text-xs font-mono text-cyan-300 bg-gradient-to-r from-purple-600/50 to-blue-600/50 px-3 py-1 rounded-full uppercase tracking-wide font-semibold border border-cyan-400/30';
            langSpan.textContent = language;
            langSpan.style.textShadow = '0 0 10px rgba(0, 212, 255, 0.5)';
            leftSection.appendChild(langSpan);
          }
          
          header.appendChild(leftSection);
          
          // Copy button with explicit vibrant styling
          const copyButton = document.createElement('button');
          copyButton.className = 'flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 focus:outline-none font-semibold';
          
          // Set explicit styles for visibility
          copyButton.style.color = '#00d4ff';
          copyButton.style.background = 'linear-gradient(135deg, rgba(139, 69, 193, 0.8), rgba(219, 39, 119, 0.8))';
          copyButton.style.border = '1px solid rgba(0, 212, 255, 0.5)';
          copyButton.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
          copyButton.style.textShadow = '0 0 8px rgba(0, 212, 255, 0.5)';
          
          // Hover effects
          copyButton.addEventListener('mouseenter', () => {
            copyButton.style.color = '#ffffff';
            copyButton.style.background = 'linear-gradient(135deg, #8b45c1, #db2777)';
            copyButton.style.transform = 'scale(1.05)';
            copyButton.style.boxShadow = '0 6px 16px rgba(0, 212, 255, 0.4)';
          });
          
          copyButton.addEventListener('mouseleave', () => {
            copyButton.style.color = '#00d4ff';
            copyButton.style.background = 'linear-gradient(135deg, rgba(139, 69, 193, 0.8), rgba(219, 39, 119, 0.8))';
            copyButton.style.transform = 'scale(1)';
            copyButton.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
          });
          copyButton.innerHTML = `
            <svg style="width: 12px; height: 12px; color: #00d4ff;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
            <span style="color: #00d4ff; margin-left: 4px;">Copy</span>
          `;
          
          // Copy functionality
          copyButton.addEventListener('click', async () => {
            try {
              await navigator.clipboard.writeText(codeText);
              copyButton.innerHTML = `
                <svg style="width: 12px; height: 12px; color: #50fa7b;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span style="color: #50fa7b; margin-left: 4px;">Copied!</span>
              `;
              copyButton.style.color = '#50fa7b';
              copyButton.style.background = 'linear-gradient(135deg, rgba(80, 250, 123, 0.2), rgba(139, 233, 253, 0.2))';
              copyButton.style.border = '1px solid rgba(80, 250, 123, 0.5)';
              
              setTimeout(() => {
                copyButton.innerHTML = `
                  <svg style="width: 12px; height: 12px; color: #00d4ff;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                  </svg>
                  <span style="color: #00d4ff; margin-left: 4px;">Copy</span>
                `;
                copyButton.style.color = '#00d4ff';
                copyButton.style.background = 'linear-gradient(135deg, rgba(139, 69, 193, 0.8), rgba(219, 39, 119, 0.8))';
                copyButton.style.border = '1px solid rgba(0, 212, 255, 0.5)';
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
          
          // Create new pre element with vibrant styling
          const newPre = document.createElement('pre');
          newPre.className = 'overflow-x-auto p-4 text-sm leading-relaxed scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-transparent m-0';
          newPre.style.background = 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)';
          newPre.style.color = '#f8f8f2';
          
          // Create new code element with enhanced styling while preserving hljs classes
          const newCodeElement = document.createElement('code');
          newCodeElement.style.background = 'transparent';
          newCodeElement.style.color = '#f8f8f2';
          newCodeElement.className = `block text-gray-100 font-mono ${className}`;
          newCodeElement.innerHTML = codeElement.innerHTML; // Preserve highlighted HTML instead of plain text
          newCodeElement.style.textShadow = '0 0 5px rgba(248, 248, 242, 0.1)';
          
          newPre.appendChild(newCodeElement);
          contentDiv.appendChild(newPre);
          wrapper.appendChild(contentDiv);
          
          // Replace original pre with wrapper
          pre.parentNode?.replaceChild(wrapper, pre);
        }
        });
      
        // Handle inline code elements with vibrant styling
        const inlineCodeElements = contentRef.current?.querySelectorAll('code:not(pre code)');
        inlineCodeElements?.forEach((code) => {
          code.className = 'px-3 py-1 text-sm font-mono rounded-md border font-semibold';
          (code as HTMLElement).style.background = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)';
          (code as HTMLElement).style.color = '#00d4ff';
          (code as HTMLElement).style.border = '1px solid rgba(0, 212, 255, 0.3)';
          (code as HTMLElement).style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 212, 255, 0.1)';
          (code as HTMLElement).style.textShadow = '0 0 8px rgba(0, 212, 255, 0.3)';
        });

        // Handle images in markdown content
        const imageElements = contentRef.current?.querySelectorAll('img');
        imageElements?.forEach((img) => {
          // Skip if image already processed
          if ((img as HTMLElement).dataset.processed === 'true') {
            return;
          }

          // Mark as processed and style the image
          (img as HTMLElement).dataset.processed = 'true';
          img.className = 'w-full h-auto rounded-lg my-4 max-w-full';
          (img as HTMLImageElement).loading = 'lazy';
        });
      }, 100); // Small delay to ensure highlighting is complete
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