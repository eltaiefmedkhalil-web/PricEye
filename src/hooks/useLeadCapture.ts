import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const LEAD_STORAGE_KEY = 'priceye_lead_captured';

export function useLeadCapture(toolName: string) {
  const [showGate, setShowGate] = useState(false);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [toolData, setToolData] = useState<Record<string, unknown>>({});

  const isLeadCaptured = useCallback(() => {
    return localStorage.getItem(LEAD_STORAGE_KEY) === 'true';
  }, []);

  const triggerGate = useCallback((data: Record<string, unknown>) => {
    if (isLeadCaptured()) {
      setSubmitted(true);
      return false;
    }
    setToolData(data);
    setShowGate(true);
    return true;
  }, [isLeadCaptured]);

  const submitLead = useCallback(async () => {
    if (!email.trim()) {
      setError('Please enter your email address');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address');
      return false;
    }

    setSubmitting(true);
    setError('');

    const { error: dbError } = await supabase
      .from('leads')
      .insert({
        email: email.trim().toLowerCase(),
        tool_used: toolName,
        tool_data: toolData,
      });

    if (dbError) {
      setError('Something went wrong. Please try again.');
      setSubmitting(false);
      return false;
    }

    localStorage.setItem(LEAD_STORAGE_KEY, 'true');
    setSubmitting(false);
    setSubmitted(true);
    setShowGate(false);
    return true;
  }, [email, toolName, toolData]);

  const closeGate = useCallback(() => {
    setShowGate(false);
    setError('');
  }, []);

  return {
    showGate,
    email,
    setEmail,
    submitting,
    submitted,
    error,
    triggerGate,
    submitLead,
    closeGate,
    isLeadCaptured,
  };
}
