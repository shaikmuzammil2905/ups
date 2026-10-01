import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import ConfirmDialog from './components/ConfirmDialog';
import {
  MessageSquare, Search, Filter, Phone, Mail, Clock, Check,
  Trash2, Eye, ExternalLink, Send, AlertCircle, Loader, MessageCircle
} from 'lucide-react';

const STATUS_COLORS = {
  new: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  contacted: 'bg-blue-50 text-blue-700 border-blue-200',
  resolved: 'bg-slate-100 text-slate-600 border-slate-200',
  cancelled: 'bg-red-50 text-red-600 border-red-200',
};

export default function EnquiriesAdmin() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchEnquiries = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('enquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter) {
        query = query.eq('status', statusFilter);
      }

      const { data, error: err } = await query;
      if (err) throw err;
      setEnquiries(data || []);
    } catch (err) {
      console.error('Fetch enquiries error:', err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  const showNotification = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleUpdateStatus = async (enquiryId, newStatus) => {
    try {
      const { error: err } = await supabase
        .from('enquiries')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', enquiryId);
      if (err) throw err;
      setEnquiries(prev => prev.map(e => e.id === enquiryId ? { ...e, status: newStatus } : e));
      if (selectedEnquiry?.id === enquiryId) {
        setSelectedEnquiry(prev => ({ ...prev, status: newStatus }));
      }
      showNotification(`Enquiry marked as "${newStatus}".`);
    } catch (err) {
      alert(`Error updating status: ${err.message}`);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      const { error: err } = await supabase
        .from('enquiries')
        .delete()
        .eq('id', deleteConfirm.id);
      if (err) throw err;
      setEnquiries(prev => prev.filter(e => e.id !== deleteConfirm.id));
      if (selectedEnquiry?.id === deleteConfirm.id) setSelectedEnquiry(null);
      setDeleteConfirm(null);
      showNotification('Enquiry deleted.');
    } catch (err) {
      alert(`Delete error: ${err.message}`);
    }
  };

  const filteredEnquiries = enquiries.filter(e =>
    e.name?.toLowerCase().includes(search.toLowerCase()) ||
    e.email?.toLowerCase().includes(search.toLowerCase()) ||
    e.phone?.includes(search) ||
    e.subject?.toLowerCase().includes(search.toLowerCase()) ||
    e.service_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2.5">
            <MessageSquare className="w-7 h-7 text-[#16a34a]" />
            Customer Enquiries & Leads
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time contact messages, emergency service bookings, and product quotes from the website.
          </p>
        </div>
      </div>

      {/* Notification */}
      {successMsg && (
        <div className="flex items-center gap-2 p-3 bg-green-50 text-green-800 border border-green-200 rounded-xl text-sm font-medium animate-fade-in">
          <Check className="w-4 h-4 text-green-600" />
          {successMsg}
        </div>
      )}

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by customer name, phone, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#16a34a]"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#16a34a]"
          >
            <option value="">All Statuses</option>
            <option value="new">New Leads</option>
            <option value="contacted">Contacted</option>
            <option value="resolved">Resolved</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <div className="text-sm text-slate-500 font-medium whitespace-nowrap">
            Total: <span className="font-bold text-slate-800">{enquiries.length}</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <Loader className="w-8 h-8 animate-spin mx-auto mb-2 text-[#16a34a]" />
            Loading enquiries...
          </div>
        ) : filteredEnquiries.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-base font-semibold text-slate-600">No enquiries recorded yet</p>
            <p className="text-xs text-slate-400 mt-1">Website leads will appear here automatically.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold tracking-wider border-b border-slate-100">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Inquiry / Service</th>
                  <th className="py-3 px-4">Message Snippet</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredEnquiries.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 text-xs text-slate-400 whitespace-nowrap">
                      {new Date(e.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800">{e.name || 'Anonymous'}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                        {e.phone && (
                          <span className="flex items-center gap-1 font-mono">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {e.phone}
                          </span>
                        )}
                        {e.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-400" />
                            {e.email}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-semibold text-slate-700">
                      <div>{e.service_name || e.subject || 'General Inquiry'}</div>
                      {e.source && (
                        <span className="text-[10px] text-slate-400 font-normal">via {e.source}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-500 max-w-xs truncate">
                      {e.message || 'No additional message.'}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={e.status || 'new'}
                        onChange={(evt) => handleUpdateStatus(e.id, evt.target.value)}
                        className={`text-xs font-bold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none ${
                          STATUS_COLORS[e.status || 'new']
                        }`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="resolved">Resolved</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {e.phone && (
                          <a
                            href={`https://wa.me/91${e.phone.replace(/[^0-9]/g, '')}?text=Hi ${encodeURIComponent(e.name || '')}, greeting from Livkam Power Technologies regarding your enquiry.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Reply via WhatsApp"
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>
                        )}
                        <button
                          onClick={() => setSelectedEnquiry(e)}
                          title="View Details"
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(e)}
                          title="Delete"
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-xl font-black text-slate-800">Enquiry Details</h2>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                <span className="text-slate-400 text-xs">Date Received:</span>
                <span className="font-semibold text-slate-700">
                  {new Date(selectedEnquiry.created_at).toLocaleString('en-IN')}
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Customer Name</label>
                <div className="text-base font-bold text-slate-800">{selectedEnquiry.name || 'Not provided'}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Phone</label>
                  <div className="font-mono text-sm font-semibold text-slate-800">
                    {selectedEnquiry.phone || '—'}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Email</label>
                  <div className="text-sm font-semibold text-slate-800 truncate">
                    {selectedEnquiry.email || '—'}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Service / Subject</label>
                <div className="font-semibold text-slate-800">
                  {selectedEnquiry.service_name || selectedEnquiry.subject || 'General Enquiry'}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Message</label>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 mt-1 whitespace-pre-wrap">
                  {selectedEnquiry.message || 'No additional message entered.'}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2">
                {selectedEnquiry.phone && (
                  <a
                    href={`https://wa.me/91${selectedEnquiry.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    WhatsApp
                  </a>
                )}
                {selectedEnquiry.email && (
                  <a
                    href={`mailto:${selectedEnquiry.email}`}
                    className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    Email
                  </a>
                )}
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <ConfirmDialog
          isOpen={true}
          title="Delete Enquiry"
          message={`Are you sure you want to delete inquiry from "${deleteConfirm.name}"?`}
          confirmText="Yes, Delete"
          onConfirm={handleDelete}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </div>
  );
}
