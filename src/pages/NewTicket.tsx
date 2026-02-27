import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthContext } from '../contexts/AuthContext';

export default function NewTicket() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    subject: '',
    category: 'general',
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    if (!formData.subject.trim() || !formData.message.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data: ticketData, error: ticketError } = await supabase
        .from('support_tickets')
        .insert({
          user_id: user.id,
          subject: formData.subject.trim(),
          category: formData.category,
          status: 'open',
          priority: 'normal',
        })
        .select()
        .maybeSingle();

      if (ticketError) throw ticketError;
      if (!ticketData) throw new Error('Failed to create ticket');

      const { error: messageError } = await supabase
        .from('support_messages')
        .insert({
          ticket_id: ticketData.id,
          sender_id: user.id,
          sender_role: 'user',
          body: formData.message.trim(),
        });

      if (messageError) throw messageError;

      navigate('/support', { state: { ticketId: ticketData.id } });
    } catch (err) {
      console.error('Error creating ticket:', err);
      setError('Failed to create support ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-brand-darkest pt-24 pb-12"
    >
      <div className="section-container max-w-2xl">
        <button
          onClick={() => navigate('/support')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Support
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="glass-card p-8"
        >
          <div className="flex items-center gap-3 mb-8">
            <MessageSquare className="w-6 h-6 text-brand-accent" />
            <h1 className="text-3xl font-bold text-white">Create Support Ticket</h1>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-white mb-2">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Briefly describe your issue"
                className="w-full bg-white/5 border border-brand-primary/20 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-white mb-2">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-white/5 border border-brand-primary/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-transparent transition-all"
              >
                <option value="general" className="bg-brand-dark">
                  General Question
                </option>
                <option value="technical" className="bg-brand-dark">
                  Technical Issue
                </option>
                <option value="billing" className="bg-brand-dark">
                  Billing Issue
                </option>
                <option value="account" className="bg-brand-dark">
                  Account Help
                </option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-white mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Provide details about your issue..."
                rows={6}
                className="w-full bg-white/5 border border-brand-primary/20 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-transparent transition-all resize-none"
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white" />
                    Creating...
                  </>
                ) : (
                  'Create Ticket'
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/support')}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
}
