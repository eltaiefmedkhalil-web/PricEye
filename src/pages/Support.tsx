import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, MessageSquare } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthContext } from '../contexts/AuthContext';
import SupportThread from '../components/SupportThread';

interface Ticket {
  id: string;
  subject: string;
  status: string;
  category: string;
  created_at: string;
  updated_at: string;
}

export default function Support() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchTickets();
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`user_tickets_${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'support_tickets',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setTickets((prev) => [payload.new as Ticket, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setTickets((prev) =>
              prev.map((t) => (t.id === payload.new.id ? (payload.new as Ticket) : t))
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchTickets = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (err) {
      console.error('Error fetching tickets:', err);
    } finally {
      setLoading(false);
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

  const filteredTickets = filterStatus
    ? tickets.filter((t) => t.status === filterStatus)
    : tickets;

  const statuses = ['open', 'in_progress', 'resolved', 'closed'];

  if (selectedTicket) {
    return (
      <div className="min-h-screen bg-brand-darkest pt-24 pb-12">
        <div className="section-container">
          <SupportThread
            ticket={selectedTicket}
            onBack={() => setSelectedTicket(null)}
          />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-brand-darkest pt-24 pb-12"
    >
      <div className="section-container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Support</h1>
            <p className="text-slate-400">
              Manage your support tickets and get help
            </p>
          </div>
          <Link to="/support/new" className="btn-primary">
            <Plus className="w-5 h-5" />
            New Ticket
          </Link>
        </div>

        <div className="mb-8 flex gap-2 flex-wrap">
          <button
            onClick={() => setFilterStatus(null)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filterStatus === null
                ? 'btn-primary'
                : 'btn-secondary'
            }`}
          >
            All
          </button>
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                filterStatus === status
                  ? 'btn-primary'
                  : 'btn-secondary'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-accent" />
          </div>
        ) : filteredTickets.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="glass-card p-12 text-center"
          >
            <MessageSquare className="w-16 h-16 text-slate-400 mx-auto mb-4 opacity-50" />
            <h2 className="text-xl font-semibold text-white mb-2">
              No {filterStatus ? `${filterStatus}` : ''} tickets yet
            </h2>
            <p className="text-slate-400 mb-6">
              {filterStatus
                ? `You have no ${filterStatus} support tickets`
                : 'Create a new support ticket to get help'}
            </p>
            <Link to="/support/new" className="btn-primary inline-flex">
              <Plus className="w-4 h-4" />
              Create First Ticket
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredTickets.map((ticket, index) => (
              <motion.button
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="w-full glass-card p-6 hover:border-brand-accent/50 transition-all duration-200 text-left group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white group-hover:text-brand-accent transition-colors">
                      {ticket.subject}
                    </h3>
                  </div>
                  <span className="text-sm text-slate-500">
                    {formatTime(ticket.updated_at)}
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
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
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
