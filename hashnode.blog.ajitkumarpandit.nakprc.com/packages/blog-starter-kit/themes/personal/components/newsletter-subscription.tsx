import React, { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import request from 'graphql-request';
import {
  SubscribeToNewsletterDocument,
  SubscribeToNewsletterMutation,
  SubscribeToNewsletterMutationVariables,
} from '../generated/graphql';
import { NewsletterSuccessModal } from './newsletter-success-modal';

interface NewsletterSubscriptionProps {
  publicationId: string;
  includeAnchor?: boolean;
}

type SubscriptionStatus = 'idle' | 'loading' | 'success' | 'error';

export const NewsletterSubscription = ({ publicationId, includeAnchor = true }: NewsletterSubscriptionProps) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<SubscriptionStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [subscribedEmail, setSubscribedEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setErrorMessage('Please enter your email address');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const data = await request<SubscribeToNewsletterMutation, SubscribeToNewsletterMutationVariables>(
        process.env.NEXT_PUBLIC_HASHNODE_GQL_ENDPOINT!,
        SubscribeToNewsletterDocument,
        {
          input: {
            email: email.trim(),
            publicationId,
          },
        }
      );

      if (data.subscribeToNewsletter.status === 'PENDING') {
        setSubscribedEmail(email.trim());
        setShowSuccessModal(true);
        setStatus('idle');
        setEmail('');
      } else {
        setStatus('error');
        setErrorMessage('Subscription failed. Please try again.');
      }
    } catch (error: any) {
      console.error('Newsletter subscription error:', error);
      setStatus('error');
      
      // Check if the error is about already being subscribed
      const errorMessage = error?.response?.errors?.[0]?.message || error?.message || '';
      if (errorMessage.toLowerCase().includes('already') || 
          errorMessage.toLowerCase().includes('subscribed')) {
        setErrorMessage('You are already subscribed to our newsletter!');
      } else {
        setErrorMessage('Something went wrong. Please try again later.');
      }
    }
  };

  const resetForm = () => {
    setStatus('idle');
    setErrorMessage('');
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    setSubscribedEmail('');
  };

  return (
    <div id={includeAnchor ? 'subscribe' : undefined} className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-2xl p-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          📧 Subscribe to Our Newsletter
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Get the latest articles and updates delivered directly to your inbox. No spam, unsubscribe anytime.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address..."
              className="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
              disabled={status === 'loading'}
            />
          </div>
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 flex items-center justify-center gap-2 whitespace-nowrap"
          >
            {status === 'loading' ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Subscribing...
              </>
            ) : (
              <>
                <FaPaperPlane className="w-4 h-4" />
                Subscribe
              </>
            )}
          </button>
        </div>

        {errorMessage && (
          <div className="text-red-600 dark:text-red-400 text-sm text-center bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
            {errorMessage}
          </div>
        )}
      </form>

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          By subscribing, you agree to receive our newsletter. You can unsubscribe at any time.
        </p>
      </div>

      {/* Success Modal */}
      <NewsletterSuccessModal 
        isOpen={showSuccessModal}
        onClose={handleCloseModal}
        email={subscribedEmail}
      />
    </div>
  );
};
