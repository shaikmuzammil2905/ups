import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import ConfirmDialog from './components/ConfirmDialog';
import {
  Star, Plus, Search, Trash2, CheckCircle2, XCircle, Loader,
  Check, User, MessageSquare, ThumbsUp, ShieldCheck
} from 'lucide-react';

const DEFAULT_FORM = {
  customer_name: '',
  rating: 5,
  product_name: 'Online UPS Installation',
  review_text: '',
  is_verified: true,
  is_approved: true,
};

export default function ReviewsAdmin() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (ratingFilter) {
        query = query.eq('rating', parseInt(ratingFilter));
      }

      const { data, error: err } = await query;
      if (err) throw err;
      setReviews(data || []);
    } catch (err) {
      console.error('Fetch reviews error:', err);
    } finally {
      setLoading(false);
    }
  }, [ratingFilter]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const showNotification = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleToggleApprove = async (review) => {
    try {
      const updatedStatus = !review.is_approved;
      const { error: err } = await supabase
        .from('reviews')
        .update({ is_approved: updatedStatus, updated_at: new Date().toISOString() })
        .eq('id', review.id);
      if (err) throw err;
      setReviews(prev => prev.map(r => r.id === review.id ? { ...r, is_approved: updatedStatus } : r));
      showNotification(`Review ${updatedStatus ? 'approved for display' : 'hidden'}.`);
    } catch (err) {
      alert(`Error updating review: ${err.message}`);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.customer_name.trim() || !formData.review_text.trim()) {
      alert('Customer name and review text are required.');
      return;
    }

    setFormLoading(true);
    try {
      const { error: err } = await supabase
        .from('reviews')
        .insert({
          customer_name: formData.customer_name.trim(),
          rating: parseInt(formData.rating) || 5,
          product_name: formData.product_name || 'General Feedback',
          review_text: formData.review_text.trim(),
          is_verified: formData.is_verified,
          is_approved: formData.is_approved,
          created_at: new Date().toISOString(),
        });
      if (err) throw err;
      showNotification('Review added successfully!');
      setIsModalOpen(false);
      fetchReviews();
    } catch (err) {
      console.error('Save review error:', err);
      alert(`Failed to save review: ${err.message}`);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      const { error: err } = await supabase
        .from('reviews')
        .delete()
        .eq('id', deleteConfirm.id);
      if (err) throw err;
      setReviews(prev => prev.filter(r => r.id !== deleteConfirm.id));
      setDeleteConfirm(null);
      showNotification('Review deleted.');
    } catch (err) {
      alert(`Delete error: ${err.message}`);
    }
  };

  const filteredReviews = reviews.filter(r =>
    r.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
    r.review_text?.toLowerCase().includes(search.toLowerCase()) ||
    r.product_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2.5">
            <Star className="w-7 h-7 text-amber-500 fill-amber-500" />
            Customer Reviews & Ratings
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Moderate client testimonials, verified purchase reviews, and service feedback.
          </p>
        </div>
        <button
          onClick={() => {
            setFormData(DEFAULT_FORM);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#16a34a] hover:bg-green-700 text-white rounded-xl font-bold text-sm shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Client Testimonial
        </button>
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
            placeholder="Search reviews..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#16a34a]"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#16a34a]"
          >
            <option value="">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
          <div className="text-sm text-slate-500 font-medium whitespace-nowrap">
            Total Reviews: <span className="font-bold text-slate-800">{reviews.length}</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <Loader className="w-8 h-8 animate-spin mx-auto mb-2 text-[#16a34a]" />
            Loading reviews...
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Star className="w-12 h-12 mx-auto mb-3 opacity-30 text-amber-400" />
            <p className="text-base font-semibold text-slate-600">No reviews found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold tracking-wider border-b border-slate-100">
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4">Product / Service</th>
                  <th className="py-3 px-4">Review Comment</th>
                  <th className="py-3 px-4">Verified</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredReviews.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                          {r.customer_name?.charAt(0) || 'U'}
                        </div>
                        {r.customer_name}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-0.5 text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < (r.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-semibold text-slate-700">
                      {r.product_name || 'General Service'}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600 max-w-sm">
                      <p className="line-clamp-2">"{r.review_text}"</p>
                    </td>
                    <td className="py-3.5 px-4">
                      {r.is_verified ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          Verified
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">Standard</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleApprove(r)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                          r.is_approved
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                        }`}
                      >
                        {r.is_approved ? 'Approved' : 'Pending'}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setDeleteConfirm(r)}
                        title="Delete"
                        className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 p-6">
            <h2 className="text-xl font-black text-slate-800 pb-3 border-b border-slate-100">
              Add Client Testimonial
            </h2>

            <form onSubmit={handleSave} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Customer / Company Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  placeholder="e.g. Ramesh Kumar (Bangalore Infotech)"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Product or Service Name
                </label>
                <input
                  type="text"
                  value={formData.product_name}
                  onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                  placeholder="e.g. APC Smart-UPS 5kVA Installation"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Rating (1 to 5 Stars)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="p-1 focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= formData.rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-200'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-600 ml-2">{formData.rating} Stars</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Testimonial / Review Text *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.review_text}
                  onChange={(e) => setFormData({ ...formData, review_text: e.target.value })}
                  placeholder="What did the customer say about Livkam's service or product quality?"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.is_verified}
                    onChange={(e) => setFormData({ ...formData, is_verified: e.target.checked })}
                    className="w-4 h-4 text-[#16a34a] rounded"
                  />
                  Verified Purchase
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.is_approved}
                    onChange={(e) => setFormData({ ...formData, is_approved: e.target.checked })}
                    className="w-4 h-4 text-[#16a34a] rounded"
                  />
                  Approve Immediately
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex items-center gap-2 px-5 py-2 bg-[#16a34a] hover:bg-green-700 text-white rounded-xl font-bold text-sm shadow-md"
                >
                  {formLoading && <Loader className="w-4 h-4 animate-spin" />}
                  Save Testimonial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <ConfirmDialog
          isOpen={true}
          title="Delete Review"
          message={`Delete review from "${deleteConfirm.customer_name}"?`}
          confirmText="Yes, Delete"
          onConfirm={handleDelete}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </div>
  );
}
