import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import ImageUpload from './components/ImageUpload';
import ConfirmDialog from './components/ConfirmDialog';
import {
  FileText, Plus, Search, Edit2, Trash2, Eye, Save, X, Loader,
  Check, Calendar, Clock, User, Tag
} from 'lucide-react';

const DEFAULT_FORM = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  cover_image: '',
  author: 'Livkam Engineering Team',
  category: 'UPS Maintenance',
  read_time: '4 min read',
  tags: '',
  is_published: true,
};

export default function PostsAdmin() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (categoryFilter) {
        query = query.eq('category', categoryFilter);
      }

      const { data, error: err } = await query;
      if (err) throw err;
      setPosts(data || []);
    } catch (err) {
      console.error('Fetch posts error:', err);
    } finally {
      setLoading(false);
    }
  }, [categoryFilter]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const showNotification = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleSlugify = (name) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleOpenCreate = () => {
    setEditingPost(null);
    setFormData(DEFAULT_FORM);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (post) => {
    setEditingPost(post);
    setFormData({
      ...post,
      tags: Array.isArray(post.tags) ? post.tags.join(', ') : (post.tags || ''),
    });
    setIsModalOpen(true);
  };

  const handleTitleChange = (e) => {
    const val = e.target.value;
    setFormData(prev => ({
      ...prev,
      title: val,
      slug: !editingPost ? handleSlugify(val) : prev.slug,
    }));
  };

  const handleTogglePublish = async (post) => {
    try {
      const updatedStatus = !post.is_published;
      const { error: err } = await supabase
        .from('posts')
        .update({ is_published: updatedStatus, updated_at: new Date().toISOString() })
        .eq('id', post.id);
      if (err) throw err;
      setPosts(prev => prev.map(p => p.id === post.id ? { ...p, is_published: updatedStatus } : p));
      showNotification(`Post ${updatedStatus ? 'published' : 'hidden'}.`);
    } catch (err) {
      alert(`Error toggling post: ${err.message}`);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Post title is required.');
      return;
    }
    const slug = formData.slug || handleSlugify(formData.title);

    const tagsList = typeof formData.tags === 'string'
      ? formData.tags.split(',').map(s => s.trim()).filter(Boolean)
      : formData.tags;

    setFormLoading(true);
    try {
      const payload = {
        title: formData.title.trim(),
        slug: slug.trim(),
        excerpt: formData.excerpt || '',
        content: formData.content || '',
        cover_image: formData.cover_image || '',
        author: formData.author || 'Livkam Engineering Team',
        category: formData.category || 'General',
        read_time: formData.read_time || '4 min read',
        tags: tagsList,
        is_published: formData.is_published,
        updated_at: new Date().toISOString(),
      };

      if (editingPost) {
        const { error: err } = await supabase
          .from('posts')
          .update(payload)
          .eq('id', editingPost.id);
        if (err) throw err;
        showNotification('Post updated successfully!');
      } else {
        const { error: err } = await supabase
          .from('posts')
          .insert({ ...payload, created_at: new Date().toISOString() });
        if (err) throw err;
        showNotification('Post created successfully!');
      }

      setIsModalOpen(false);
      fetchPosts();
    } catch (err) {
      console.error('Save error:', err);
      alert(`Failed to save post: ${err.message}`);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      const { error: err } = await supabase
        .from('posts')
        .delete()
        .eq('id', deleteConfirm.id);
      if (err) throw err;
      setPosts(prev => prev.filter(p => p.id !== deleteConfirm.id));
      setDeleteConfirm(null);
      showNotification('Post deleted.');
    } catch (err) {
      alert(`Delete error: ${err.message}`);
    }
  };

  const filteredPosts = posts.filter(p =>
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.slug?.toLowerCase().includes(search.toLowerCase()) ||
    p.author?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2.5">
            <FileText className="w-7 h-7 text-[#16a34a]" />
            Posts & Technical Articles
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage power industry insights, battery maintenance guides, and customer educational articles.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#16a34a] hover:bg-green-700 text-white rounded-xl font-bold text-sm shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Write Article
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
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#16a34a]"
          />
        </div>
        <div className="text-sm text-slate-500 font-medium">
          Total Articles: <span className="font-bold text-slate-800">{posts.length}</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <Loader className="w-8 h-8 animate-spin mx-auto mb-2 text-[#16a34a]" />
            Loading articles...
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-base font-semibold text-slate-600">No articles found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold tracking-wider border-b border-slate-100">
                  <th className="py-3 px-4">Article</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Author</th>
                  <th className="py-3 px-4">Read Time</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-10 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                          {post.cover_image ? (
                            <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />
                          ) : (
                            <FileText className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 line-clamp-1">{post.title}</div>
                          <div className="text-xs font-mono text-slate-400">/{post.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                        {post.category || 'General'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600">
                      {post.author || 'Livkam Team'}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-400">
                      {post.read_time || '5 min read'}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleTogglePublish(post)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                          post.is_published
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                        }`}
                      >
                        {post.is_published ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(post)}
                          title="Edit"
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(post)}
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-xl font-black text-slate-800">
                {editingPost ? 'Edit Article' : 'Write New Article'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={handleTitleChange}
                  placeholder="e.g. How to Choose Between SMF and Tubular Batteries"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#16a34a]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. Maintenance Guides"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Read Time
                  </label>
                  <input
                    type="text"
                    value={formData.read_time}
                    onChange={(e) => setFormData({ ...formData, read_time: e.target.value })}
                    placeholder="e.g. 5 min read"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Brief Summary / Excerpt
                </label>
                <textarea
                  rows={2}
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Quick 2-sentence summary for post preview cards..."
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              {/* Cover Image Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Cover Image
                </label>
                <ImageUpload
                  value={formData.cover_image}
                  onChange={(url) => setFormData({ ...formData, cover_image: url })}
                  folder="posts"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Article Content (Markdown or HTML supported)
                </label>
                <textarea
                  rows={8}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write the full article content here..."
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Author
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="ups, battery, maintenance, inverter"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="post-published"
                  checked={formData.is_published}
                  onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                  className="w-4 h-4 text-[#16a34a] rounded"
                />
                <label htmlFor="post-published" className="text-sm font-semibold text-slate-700 cursor-pointer">
                  Publish Article on Live Blog
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-bold text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#16a34a] hover:bg-green-700 text-white rounded-xl font-bold text-sm shadow-md transition-all disabled:opacity-50"
                >
                  {formLoading && <Loader className="w-4 h-4 animate-spin" />}
                  {editingPost ? 'Update Article' : 'Publish Article'}
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
          title="Delete Article"
          message={`Are you sure you want to delete article "${deleteConfirm.title}"?`}
          confirmText="Yes, Delete"
          onConfirm={handleDelete}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </div>
  );
}
