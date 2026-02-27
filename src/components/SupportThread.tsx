import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Send, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthContext } from '../contexts/AuthContext';

interface Message {
  id: string;
  sender_id: string;
  sender_role: string;
  body: string;
  created_at: string;
}

interface Ticket {
  id: string;
  subject: string;
  status: string;
  category: string;
}

export default function SupportThread({
  ticket,
  onBack,
}: {
  ticket: Ticket;
  onBack: () => void;
}) {
  const { user } = useAuthContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    fetchMessages();
  }, [ticket.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const channel = supabase
      .channel(`ticket_${ticket.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'support_messages',
          filter: `ticket_id=eq.${ticket.id}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [ticket.id]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('support_messages')
        .select('*')
        .eq('ticket_id', ticket.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    setSending(true);
    try {
      const { error } = await supabase.from('support_messages').insert({
        ticket_id: ticket.id,
        sender_id: user.id,
        sender_role: 'user',
        body: newMessage.trim(),
      });

      if (error) throw error;
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setSending(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
      case 'in_progress':
        return 'bg-brand-accent/10 border-brand-accent/30 text-brand-accent';
      case 'closed':
        return 'bg-red-500/10 border-red-500/30 text-red-400';
      case 'open':
      default:
        return 'bg-slate-500/10 border-slate-500/30 text-slate-400';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'billing':
        return 'bg-blue-500/20 text-blue-400';
      case 'technical':
        return 'bg-purple-500/20 text-purple-400';
      case 'account':
        return 'bg-cyan-500/20 text-cyan-400';
      case 'general':
      default:
        return 'bg-slate-500/20 text-slate-400';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full flex flex-col bg-brand-darkest rounded-2xl border border-brand-primary/20"
    >
      <div className="p-6 border-b border-brand-primary/10 flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
            title="Back to tickets"
          >
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </button>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-white mb-2">
              {ticket.subject}
            </h2>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs px-3 py-1 rounded-full border ${getCategoryColor(
                  ticket.category
                )}`}
              >
                {ticket.category}
              </span>
              <span
                className={`text-xs px-3 py-1 rounded-full border ${getStatusColor(
                  ticket.status
                )}`}
              >
                {ticket.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-accent" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <div>
              <p className="text-slate-400">No messages yet</p>
              <p className="text-sm text-slate-500 mt-1">
                Start the conversation by sending your first message
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => {
            const isUser = message.sender_role === 'user';
            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                    isUser
                      ? 'bg-brand-primary/20 border border-brand-accent/30'
                      : 'bg-brand-dark/50 border border-brand-primary/20'
                  }`}
                >
                  {!isUser && (
                    <p className="text-xs font-semibold text-brand-accent mb-1">
                      Support Team
                    </p>
                  )}
                  <p className="text-sm text-white break-words">
                    {message.body}
                  </p>
                  <p className="text-xs text-slate-500 mt-2 text-right">
                    {formatTime(message.created_at)}
                  </p>
                </div>
              </motion.div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-6 border-t border-brand-primary/10">
        <div className="flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Type your message..."
            className="flex-1 bg-white/5 border border-brand-primary/20 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-transparent transition-all"
            disabled={sending}
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || sending}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            title="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
