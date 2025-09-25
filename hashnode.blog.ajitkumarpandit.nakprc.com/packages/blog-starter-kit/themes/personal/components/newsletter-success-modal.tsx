import React from 'react';
import { FaCheckCircle, FaTimes } from 'react-icons/fa';

interface NewsletterSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

export const NewsletterSuccessModal = ({ isOpen, onClose, email }: NewsletterSuccessModalProps) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-x-0 bottom-0 z-50 sm:inset-0 sm:flex sm:items-center sm:justify-center p-4">
        <div 
          className="bg-white dark:bg-neutral-900 rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-md mx-auto transform transition-transform duration-300 ease-out sm:transform-none max-h-[90vh] overflow-hidden flex flex-col"
          style={{
            animation: 'slideUp 0.3s ease-out',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-neutral-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Welcome to Our Newsletter! 🎉
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-colors duration-200"
            >
              <FaTimes className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 overflow-y-auto flex-1">
            {/* Success Icon */}
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <FaCheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>

            {/* Main Message */}
            <div className="text-center space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Almost there! Check your email
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                We&apos;ve sent a confirmation email to:
              </p>
              <div className="bg-gray-50 dark:bg-neutral-800 rounded-lg px-4 py-3">
                <p className="text-primary-600 dark:text-primary-400 font-medium break-all">
                  {email}
                </p>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                What&apos;s next?
              </h4>
              <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                <div className="flex items-start space-x-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                    1
                  </span>
                  <span>Check your inbox (and spam folder just in case)</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                    2
                  </span>
                  <span>Click the confirmation link in the email</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                    3
                  </span>
                  <span>Start receiving our latest articles and updates!</span>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 dark:text-white">
                What you&apos;ll get:
              </h4>
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <span className="text-gray-600 dark:text-gray-300">New article notifications</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <span className="text-gray-600 dark:text-gray-300">Exclusive content and tips</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <span className="text-gray-600 dark:text-gray-300">Behind-the-scenes insights</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 dark:border-neutral-700">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200 text-center"
              >
                Got it!
              </button>
              <button
                onClick={() => {
                  // Open email client
                  window.location.href = 'mailto:';
                }}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800 font-medium rounded-lg transition-colors duration-200 text-center"
              >
                Open Email App
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
              Don&apos;t see the email? Check your spam folder or contact support.
            </p>
          </div>
        </div>
      </div>

      {/* CSS for mobile slide-up animation */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};