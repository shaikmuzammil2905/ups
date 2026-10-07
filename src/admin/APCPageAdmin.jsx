import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { notifyDataUpdated } from '../lib/syncEvents';
import ConfirmDialog from './components/ConfirmDialog';
import ImageUpload from './components/ImageUpload';
import {
  Zap, Plus, Edit2, Trash2, Eye, EyeOff, Save, X, Check, Loader,
  ArrowUp, ArrowDown, Settings, ExternalLink, ChevronDown, ChevronRight,
  LayoutDashboard, Image, FileText, MessageSquare, Globe, ToggleLeft,
  ToggleRight, RefreshCw, Inbox, Filter, Search, Clock, CheckCircle,
  XCircle, AlertCircle, GripVertical, Copy, Send, Upload, Folder,
  ChevronLeft, Info, Star, Shield, Award, Tag
} from 'lucide-react';

// ─── Tab definitions ─────────────────────────────────────────────────────────
const TABS = [
  { id: 'overview', label: 'Overview & SEO', icon: LayoutDashboard },
  { id: 'hero', label: 'Hero Section', icon: Star },
  { id: 'sections', label: 'Page Sections', icon: Folder },
  { id: 'enquiries', label: 'Customer Enquiries', icon: Inbox },
  { id: 'form', label: 'Enquiry Form', icon: FileText },
];

const SECTION_TYPE_LABELS = {
  hero: 'Hero Banner',
  content: 'Content Block',
  why_apc: 'Why APC Features',
  solutions: 'APC Solutions',
  applications: 'Applications',
  benefits: 'Benefits',
  technical: 'Technical Info',
  how_it_works: 'How It Works',
  gallery: 'Image Gallery',
  cta: 'Call to Action',
  contact: 'Contact Info',
  enquiry_form: 'Enquiry Form',
  map: 'Map',
  custom: 'Custom Section',
};

const STATUS_COLORS = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-yellow-100 text-yellow-700',
  in_progress: 'bg-purple-100 text-purple-700',
  completed: 'bg-green-100 text-green-700',
  closed: 'bg-slate-100 text-slate-500',
};

// ─── Utility: parse JSON safely ───────────────────────────────────────────────
function safeJSON(v, fallback = []) {
  if (!v) return fallback;
  if (typeof v !== 'string') return v;
  try { return JSON.parse(v); } catch { return fallback; }
}

// ─── Small reusable form field ────────────────────────────────────────────────
function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-700 mb-1.5">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = "w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-[#16a34a] focus:ring-2 focus:ring-[#16a34a]/20 text-sm transition-all";
const textareaCls = `${inputCls} resize-none`;

// ─── Main Admin Component ─────────────────────────────────────────────────────
export default function APCPageAdmin() {
  const [activeTab, setActiveTab] = useState('overview');
  const [meta, setMeta] = useState(null);
  const [sections, setSections] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [formConfig, setFormConfig] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Modal states
  const [editSection, setEditSection] = useState(null);        // section being edited
  const [deleteTarget, setDeleteTarget] = useState(null);      // { type, id, label }
  const [editItem, setEditItem] = useState(null);              // { item, sectionId }
  const [editGallery, setEditGallery] = useState(null);        // section with gallery
  const [editMeta, setEditMeta] = useState(false);
  const [viewEnquiry, setViewEnquiry] = useState(null);
  const [editFormField, setEditFormField] = useState(null);

  // Enquiries filters
  const [enqSearch, setEnqSearch] = useState('');
  const [enqStatus, setEnqStatus] = useState('');

  useEffect(() => { fetchAll(); }, []);

  async function fetchAll() {
    setLoading(true);
    try {
      const [metaRes, sectRes, enqRes, formRes] = await Promise.all([
        supabase.from('apc_page_meta').select('*').limit(1).single(),
        supabase.from('apc_page_sections').select('*').order('sort_order'),
        supabase.from('apc_enquiries').select('*').order('created_at', { ascending: false }),
        supabase.from('apc_enquiry_form_config').select('*').order('sort_order'),
      ]);
      if (metaRes.data) setMeta(metaRes.data);
      setSections(sectRes.data || []);
      setEnquiries(enqRes.data || []);
      setFormConfig(formRes.data || []);
    } catch (err) {
      console.error('APC admin fetch error:', err);
    } finally {
      setLoading(false);
    }
  }

  function showSuccess(msg) {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
    notifyDataUpdated();
  }
  function showError(msg) {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(''), 5000);
  }

  // ── Section visibility toggle ─────────────────────────────
  async function toggleSectionVisibility(section) {
    const newVal = !section.is_visible;
    const { error } = await supabase
      .from('apc_page_sections')
      .update({ is_visible: newVal, updated_at: new Date().toISOString() })
      .eq('id', section.id);
    if (!error) {
      setSections(prev => prev.map(s => s.id === section.id ? { ...s, is_visible: newVal } : s));
      showSuccess(`Section "${section.section_type}" ${newVal ? 'shown' : 'hidden'} on live page.`);
    }
  }

  // ── Section publish status toggle ─────────────────────────
  async function toggleSectionStatus(section) {
    const newStatus = section.status === 'published' ? 'draft' : 'published';
    const { error } = await supabase
      .from('apc_page_sections')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', section.id);
    if (!error) {
      setSections(prev => prev.map(s => s.id === section.id ? { ...s, status: newStatus } : s));
      showSuccess(`Section ${newStatus === 'published' ? 'published' : 'set to draft'}.`);
    }
  }

  // ── Reorder sections ──────────────────────────────────────
  async function moveSectionOrder(section, dir) {
    const sorted = [...sections].sort((a, b) => a.sort_order - b.sort_order);
    const idx = sorted.findIndex(s => s.id === section.id);
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;

    const a = sorted[idx];
    const b = sorted[swapIdx];
    const newA = b.sort_order;
    const newB = a.sort_order;

    await Promise.all([
      supabase.from('apc_page_sections').update({ sort_order: newA }).eq('id', a.id),
      supabase.from('apc_page_sections').update({ sort_order: newB }).eq('id', b.id),
    ]);
    setSections(prev => prev.map(s => {
      if (s.id === a.id) return { ...s, sort_order: newA };
      if (s.id === b.id) return { ...s, sort_order: newB };
      return s;
    }));
    notifyDataUpdated();
  }

  // ── Delete section ────────────────────────────────────────
  async function handleDeleteSection() {
    if (!deleteTarget) return;
    const { error } = await supabase.from('apc_page_sections').delete().eq('id', deleteTarget.id);
    if (!error) {
      setSections(prev => prev.filter(s => s.id !== deleteTarget.id));
      showSuccess('Section deleted.');
    } else showError('Failed to delete section.');
    setDeleteTarget(null);
  }

  // ── Add new custom section ────────────────────────────────
  async function addCustomSection() {
    const { data, error } = await supabase
      .from('apc_page_sections')
      .insert([{
        section_type: 'custom',
        title: 'New Custom Section',
        label: 'CUSTOM SECTION',
        description: '',
        paragraphs: '[]',
        sort_order: sections.length + 1,
        is_visible: false,
        status: 'draft',
      }])
      .select()
      .single();
    if (!error && data) {
      setSections(prev => [...prev, data]);
      setEditSection(data);
    } else showError('Failed to add section.');
  }

  // ── Enquiry status update ─────────────────────────────────
  async function updateEnquiryStatus(id, status) {
    const { error } = await supabase
      .from('apc_enquiries')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (!error) {
      setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status } : e));
      if (viewEnquiry?.id === id) setViewEnquiry(prev => ({ ...prev, status }));
    }
  }

  async function deleteEnquiry(id) {
    const { error } = await supabase.from('apc_enquiries').delete().eq('id', id);
    if (!error) {
      setEnquiries(prev => prev.filter(e => e.id !== id));
      setViewEnquiry(null);
      showSuccess('Enquiry deleted.');
    }
    setDeleteTarget(null);
  }

  // Filter enquiries
  const filteredEnquiries = enquiries.filter(e => {
    const s = enqSearch.toLowerCase();
    const matchSearch = !s || (e.customer_name || '').toLowerCase().includes(s)
      || (e.phone || '').includes(s) || (e.email || '').toLowerCase().includes(s)
      || (e.company_name || '').toLowerCase().includes(s);
    const matchStatus = !enqStatus || e.status === enqStatus;
    return matchSearch && matchStatus;
  });

  const sortedSections = [...sections].sort((a, b) => a.sort_order - b.sort_order);
  const newEnqCount = enquiries.filter(e => e.status === 'new').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 animate-spin text-[#16a34a]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Header ──────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-[#0a1f35] to-[#1e4e7e] rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(22,163,74,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(22,163,74,0.05)_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 bg-[#e11d48]/20 rounded-lg">
                <Zap className="w-5 h-5 text-[#e11d48]" />
              </div>
              <span className="text-slate-300 text-xs font-semibold">Content Management → Online UPS → APC</span>
            </div>
            <h1 className="text-2xl font-black">APC Online UPS Page</h1>
            <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
              <span className={`px-2 py-0.5 rounded-full font-bold ${meta?.page_status === 'published' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                {meta?.page_status === 'published' ? '● Published' : '● Draft'}
              </span>
              {meta?.updated_at && (
                <span>Updated: {new Date(meta.updated_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {newEnqCount > 0 && (
              <div className="flex items-center gap-1.5 bg-blue-500/20 text-blue-300 px-3 py-1.5 rounded-lg text-xs font-bold">
                <Inbox className="w-3.5 h-3.5" />
                {newEnqCount} New Enquir{newEnqCount !== 1 ? 'ies' : 'y'}
              </div>
            )}
            <a
              href="/products/online-ups/apc"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3.5 py-2 rounded-xl text-xs font-semibold border border-white/10 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
              View Live Page
            </a>
          </div>
        </div>
      </div>

      {/* ── Feedback ─────────────────────────────────────────── */}
      {successMsg && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-sm">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl text-sm">
          <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          {errorMsg}
        </div>
      )}

      {/* ── Tab Navigation ───────────────────────────────────── */}
      <div className="bg-white border border-slate-100 rounded-2xl p-1 flex gap-1 flex-wrap shadow-sm">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-[#0a1f35] text-white shadow-md'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
            {tab.id === 'enquiries' && newEnqCount > 0 && (
              <span className="bg-blue-500 text-white text-[9px] font-black rounded-full px-1.5 py-0.5 leading-none">{newEnqCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* ════════════════════════════════════════════════════════
          TAB: OVERVIEW & SEO
      ════════════════════════════════════════════════════════ */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Total Sections', value: sections.length, color: 'text-slate-800' },
              { label: 'Published', value: sections.filter(s => s.status === 'published' && s.is_visible).length, color: 'text-green-600' },
              { label: 'Hidden/Draft', value: sections.filter(s => s.status !== 'published' || !s.is_visible).length, color: 'text-yellow-600' },
              { label: 'New Enquiries', value: newEnqCount, color: 'text-blue-600' },
            ].map(stat => (
              <div key={stat.label} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                <div className={`text-3xl font-black ${stat.color}`}>{stat.value}</div>
                <div className="text-xs text-slate-400 mt-1 font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* SEO / Meta editor */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center">
                  <Globe className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">SEO & Page Settings</h3>
                  <p className="text-xs text-slate-400">Manage page title, meta description and page status</p>
                </div>
              </div>
              <button
                onClick={() => setEditMeta(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0a1f35] text-white rounded-xl text-xs font-bold hover:bg-[#16a34a] transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit
              </button>
            </div>
            {meta && (
              <div className="p-6 space-y-3">
                <div className="flex gap-3">
                  <span className="text-xs font-bold text-slate-400 w-32 flex-shrink-0">Page Status</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${meta.page_status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {meta.page_status}
                  </span>
                </div>
                <div className="flex gap-3">
                  <span className="text-xs font-bold text-slate-400 w-32 flex-shrink-0">SEO Title</span>
                  <span className="text-xs text-slate-700">{meta.seo_title}</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-xs font-bold text-slate-400 w-32 flex-shrink-0">Meta Description</span>
                  <span className="text-xs text-slate-700">{meta.seo_description}</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-xs font-bold text-slate-400 w-32 flex-shrink-0">Canonical URL</span>
                  <span className="text-xs text-slate-600 font-mono">{meta.canonical_url}</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Section Overview */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Section Overview</h3>
              <p className="text-xs text-slate-400">All page sections at a glance</p>
            </div>
            <div className="divide-y divide-slate-50">
              {sortedSections.map(s => (
                <div key={s.id} className="flex items-center gap-3 px-6 py-3">
                  <div className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center text-xs font-black text-slate-500">{s.sort_order}</div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-semibold text-slate-800 truncate block">{SECTION_TYPE_LABELS[s.section_type] || s.section_type}</span>
                    <span className="text-xs text-slate-400 truncate">{s.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${s.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {s.status}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${s.is_visible ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
                      {s.is_visible ? 'Visible' : 'Hidden'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════
          TAB: HERO SECTION
      ════════════════════════════════════════════════════════ */}
      {activeTab === 'hero' && (
        <HeroSectionAdmin
          section={sections.find(s => s.section_type === 'hero')}
          onUpdated={(updated) => {
            setSections(prev => prev.map(s => s.id === updated.id ? updated : s));
            showSuccess('Hero section updated and live.');
          }}
          onError={showError}
        />
      )}

      {/* ════════════════════════════════════════════════════════
          TAB: PAGE SECTIONS
      ════════════════════════════════════════════════════════ */}
      {activeTab === 'sections' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800">All Page Sections ({sections.length})</h3>
            <button
              onClick={addCustomSection}
              className="flex items-center gap-1.5 bg-[#16a34a] hover:bg-[#15803d] text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-md"
            >
              <Plus className="w-4 h-4" /> Add Custom Section
            </button>
          </div>

          {sortedSections.map((section, idx) => (
            <SectionCard
              key={section.id}
              section={section}
              isFirst={idx === 0}
              isLast={idx === sortedSections.length - 1}
              onEdit={() => setEditSection(section)}
              onEditItems={(s) => setEditSection({ ...s, _editItems: true })}
              onEditGallery={() => setEditGallery(section)}
              onToggleVisible={() => toggleSectionVisibility(section)}
              onToggleStatus={() => toggleSectionStatus(section)}
              onMoveUp={() => moveSectionOrder(section, -1)}
              onMoveDown={() => moveSectionOrder(section, 1)}
              onDelete={() => setDeleteTarget({ id: section.id, label: SECTION_TYPE_LABELS[section.section_type] || section.section_type })}
            />
          ))}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════
          TAB: ENQUIRIES
      ════════════════════════════════════════════════════════ */}
      {activeTab === 'enquiries' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={enqSearch}
                onChange={e => setEnqSearch(e.target.value)}
                placeholder="Search by name, phone, email..."
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-[#16a34a] text-sm"
              />
            </div>
            <select
              value={enqStatus}
              onChange={e => setEnqStatus(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-[#16a34a] text-xs bg-white"
            >
              <option value="">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="closed">Closed</option>
            </select>
            <button onClick={() => { setEnqSearch(''); setEnqStatus(''); }} className="p-2 border border-slate-200 text-slate-500 hover:text-slate-800 rounded-xl">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Table */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    {['Customer', 'Company', 'Phone', 'Requirement', 'Status', 'Date', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredEnquiries.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                        <Inbox className="w-10 h-10 mx-auto mb-3 text-slate-300" />
                        <p className="font-semibold text-slate-700">No Enquiries Found</p>
                        <p className="text-xs mt-1">Customer enquiries submitted via the APC page will appear here.</p>
                      </td>
                    </tr>
                  ) : filteredEnquiries.map(enq => (
                    <tr key={enq.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3.5 font-semibold text-slate-800 text-sm whitespace-nowrap">
                        {enq.customer_name || '—'}
                        {enq.status === 'new' && (
                          <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full inline-block" />
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-xs text-slate-600 whitespace-nowrap">{enq.company_name || '—'}</td>
                      <td className="px-4 py-3.5 text-xs text-slate-600 whitespace-nowrap">{enq.phone || '—'}</td>
                      <td className="px-4 py-3.5 text-xs text-slate-600 max-w-[150px]">
                        <span className="line-clamp-2">{enq.requirement || enq.message || '—'}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <select
                          value={enq.status}
                          onChange={e => updateEnquiryStatus(enq.id, e.target.value)}
                          className={`text-xs font-bold px-2 py-1 rounded-full border-0 focus:outline-none cursor-pointer ${STATUS_COLORS[enq.status] || 'bg-slate-100 text-slate-700'}`}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="closed">Closed</option>
                        </select>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-slate-400 whitespace-nowrap">
                        {new Date(enq.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setViewEnquiry(enq)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget({ type: 'enquiry', id: enq.id, label: `enquiry from ${enq.customer_name || 'customer'}` })}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
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
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════
          TAB: ENQUIRY FORM CONFIG
      ════════════════════════════════════════════════════════ */}
      {activeTab === 'form' && (
        <FormConfigAdmin
          formConfig={formConfig}
          onUpdated={(updated) => {
            setFormConfig(prev => prev.map(f => f.id === updated.id ? updated : f));
            showSuccess('Form field updated.');
          }}
          onError={showError}
        />
      )}

      {/* ════════════════════════════════════════════════════════
          MODALS
      ════════════════════════════════════════════════════════ */}

      {/* Edit SEO/Meta */}
      {editMeta && meta && (
        <MetaEditorModal
          meta={meta}
          onSave={async (updated) => {
            const { data, error } = await supabase
              .from('apc_page_meta')
              .update({ ...updated, updated_at: new Date().toISOString() })
              .eq('id', meta.id)
              .select()
              .single();
            if (!error && data) {
              setMeta(data);
              setEditMeta(false);
              showSuccess('SEO settings saved and live.');
            } else showError('Failed to save SEO settings.');
          }}
          onClose={() => setEditMeta(false)}
        />
      )}

      {/* Edit Section */}
      {editSection && (
        <SectionEditorModal
          section={editSection}
          onSave={async (updated) => {
            const { data, error } = await supabase
              .from('apc_page_sections')
              .update({ ...updated, updated_at: new Date().toISOString() })
              .eq('id', editSection.id)
              .select()
              .single();
            if (!error && data) {
              setSections(prev => prev.map(s => s.id === data.id ? data : s));
              setEditSection(null);
              showSuccess('Section saved and synced to live page.');
            } else showError('Failed to save section: ' + (error?.message || 'Unknown error'));
          }}
          onClose={() => setEditSection(null)}
          onError={showError}
          showSuccess={showSuccess}
        />
      )}

      {/* Edit Gallery */}
      {editGallery && (
        <GalleryEditorModal
          section={editGallery}
          onClose={() => setEditGallery(null)}
          showSuccess={showSuccess}
          onError={showError}
        />
      )}

      {/* View Enquiry */}
      {viewEnquiry && (
        <EnquiryDetailModal
          enquiry={viewEnquiry}
          onStatusChange={updateEnquiryStatus}
          onClose={() => setViewEnquiry(null)}
          onDelete={(id) => setDeleteTarget({ type: 'enquiry', id, label: `enquiry from ${viewEnquiry.customer_name || 'customer'}` })}
        />
      )}

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title={deleteTarget?.type === 'enquiry' ? 'Delete Enquiry' : 'Delete Section'}
        message={`Are you sure you want to delete this ${deleteTarget?.label}? This action cannot be undone.`}
        onConfirm={() => {
          if (deleteTarget?.type === 'enquiry') deleteEnquiry(deleteTarget.id);
          else handleDeleteSection();
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

// ─── Section Card ─────────────────────────────────────────────────────────────
function SectionCard({ section, isFirst, isLast, onEdit, onEditGallery, onToggleVisible, onToggleStatus, onMoveUp, onMoveDown, onDelete }) {
  const hasGallery = section.section_type === 'gallery';
  const hasItems = ['why_apc', 'solutions', 'applications', 'benefits', 'technical', 'how_it_works'].includes(section.section_type);

  return (
    <div className={`bg-white border rounded-2xl overflow-hidden shadow-sm transition-all ${!section.is_visible ? 'border-slate-100 opacity-75' : 'border-slate-200'}`}>
      <div className="flex items-center gap-3 p-4">
        {/* Sort handle / order indicator */}
        <div className="flex flex-col items-center gap-1 flex-shrink-0">
          <button onClick={onMoveUp} disabled={isFirst} className="p-0.5 text-slate-300 hover:text-slate-600 disabled:opacity-20 transition-colors">
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] font-black text-slate-400 w-5 text-center">{section.sort_order}</span>
          <button onClick={onMoveDown} disabled={isLast} className="p-0.5 text-slate-300 hover:text-slate-600 disabled:opacity-20 transition-colors">
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Section image preview */}
        {section.image_url ? (
          <img
            src={section.image_url}
            alt=""
            className="w-14 h-14 rounded-xl object-cover flex-shrink-0 border border-slate-100"
            onError={e => e.target.style.display = 'none'}
          />
        ) : (
          <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Folder className="w-6 h-6 text-slate-300" />
          </div>
        )}

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
              {SECTION_TYPE_LABELS[section.section_type] || section.section_type}
            </span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${section.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
              {section.status}
            </span>
            {!section.is_visible && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500">Hidden</span>
            )}
          </div>
          <h4 className="font-bold text-slate-900 text-sm truncate mt-0.5">{section.title || '(No title)'}</h4>
          {section.label && <p className="text-xs text-slate-400 truncate">{section.label}</p>}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={onToggleVisible}
            title={section.is_visible ? 'Hide section' : 'Show section'}
            className={`p-2 rounded-lg transition-colors text-sm ${section.is_visible ? 'text-blue-500 hover:bg-blue-50' : 'text-slate-300 hover:bg-slate-50'}`}
          >
            {section.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
          <button
            onClick={onToggleStatus}
            title={section.status === 'published' ? 'Set to Draft' : 'Publish'}
            className={`p-2 rounded-lg transition-colors ${section.status === 'published' ? 'text-green-500 hover:bg-green-50' : 'text-yellow-500 hover:bg-yellow-50'}`}
          >
            {section.status === 'published' ? <Check className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
          </button>
          {hasGallery && (
            <button
              onClick={onEditGallery}
              className="p-2 text-purple-500 hover:bg-purple-50 rounded-lg transition-colors"
              title="Manage Gallery Images"
            >
              <Image className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onEdit}
            className="flex items-center gap-1 px-3 py-1.5 bg-[#0a1f35] hover:bg-[#16a34a] text-white rounded-lg text-xs font-bold transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
            Edit
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Hero Section Admin ───────────────────────────────────────────────────────
function HeroSectionAdmin({ section, onUpdated, onError }) {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (section) {
      setForm({
        label: section.label || '',
        title: section.title || '',
        subtitle: section.subtitle || '',
        description: section.description || '',
        image_url: section.image_url || '',
        image_alt: section.image_alt || '',
        cta_buttons: safeJSON(section.cta_buttons, [{ text: 'Explore APC Solutions', link: '#solutions', style: 'primary' }, { text: 'Contact Us', link: '/contact', style: 'secondary' }]),
        is_visible: section.is_visible ?? true,
        status: section.status || 'published',
      });
    }
  }, [section]);

  if (!section) return (
    <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-4 rounded-2xl text-sm">
      Hero section not found in database. Run the migration SQL first.
    </div>
  );

  if (!form) return <div className="flex items-center justify-center h-32"><Loader className="w-6 h-6 animate-spin text-[#16a34a]" /></div>;

  const updateCTA = (i, key, val) => {
    setForm(prev => {
      const btns = [...(prev.cta_buttons || [])];
      btns[i] = { ...btns[i], [key]: val };
      return { ...prev, cta_buttons: btns };
    });
  };

  async function save() {
    setSaving(true);
    const payload = {
      ...form,
      cta_buttons: JSON.stringify(form.cta_buttons),
      updated_at: new Date().toISOString(),
    };
    const { data, error } = await supabase
      .from('apc_page_sections')
      .update(payload)
      .eq('id', section.id)
      .select()
      .single();
    setSaving(false);
    if (!error && data) onUpdated(data);
    else onError('Failed to save hero section: ' + (error?.message || 'Unknown error'));
  }

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-bold text-slate-900">Edit Hero Section</h3>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${form.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
            {form.status}
          </span>
        </div>
      </div>

      <div className="p-6 space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Hero Label (e.g. APC POWER PROTECTION)">
            <input value={form.label} onChange={e => setForm(p => ({ ...p, label: e.target.value }))} className={inputCls} placeholder="APC POWER PROTECTION" />
          </Field>
          <Field label="Visibility">
            <select value={form.is_visible ? 'true' : 'false'} onChange={e => setForm(p => ({ ...p, is_visible: e.target.value === 'true' }))} className={inputCls}>
              <option value="true">Visible on live page</option>
              <option value="false">Hidden</option>
            </select>
          </Field>
        </div>

        <Field label="Main Heading" required>
          <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className={inputCls} placeholder="APC Online UPS Solutions" />
        </Field>

        <Field label="Subheading">
          <input value={form.subtitle} onChange={e => setForm(p => ({ ...p, subtitle: e.target.value }))} className={inputCls} placeholder="Reliable Power Protection for Critical Applications" />
        </Field>

        <Field label="Description">
          <textarea rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className={textareaCls} placeholder="Detailed description shown below the heading..." />
        </Field>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">Hero Background Image</label>
          <ImageUpload
            value={form.image_url}
            onChange={url => setForm(p => ({ ...p, image_url: url }))}
            folder="apc-page"
            aspectRatio="16/9"
          />
          {form.image_url && (
            <input
              value={form.image_alt}
              onChange={e => setForm(p => ({ ...p, image_alt: e.target.value }))}
              className={`${inputCls} mt-2`}
              placeholder="Alt text for hero image..."
            />
          )}
        </div>

        {/* CTA Buttons */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-bold text-slate-700">CTA Buttons</label>
            <button
              onClick={() => setForm(p => ({ ...p, cta_buttons: [...(p.cta_buttons || []), { text: 'New Button', link: '/', style: 'secondary' }] }))}
              className="text-xs text-[#16a34a] font-bold hover:underline flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Add Button
            </button>
          </div>
          <div className="space-y-3">
            {(form.cta_buttons || []).map((btn, i) => (
              <div key={i} className="flex gap-2 items-center bg-slate-50 rounded-xl p-3">
                <input value={btn.text} onChange={e => updateCTA(i, 'text', e.target.value)} className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#16a34a] bg-white" placeholder="Button text" />
                <input value={btn.link} onChange={e => updateCTA(i, 'link', e.target.value)} className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#16a34a] bg-white" placeholder="Link URL" />
                <select value={btn.style} onChange={e => updateCTA(i, 'style', e.target.value)} className="px-2 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none bg-white">
                  <option value="primary">Primary</option>
                  <option value="secondary">Secondary</option>
                  <option value="whatsapp">WhatsApp</option>
                </select>
                <button onClick={() => setForm(p => ({ ...p, cta_buttons: (p.cta_buttons || []).filter((_, j) => j !== i) }))} className="p-1 text-slate-400 hover:text-red-500 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} className="px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#16a34a] bg-white">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          <button
            onClick={save}
            disabled={saving}
            className="flex items-center gap-2 bg-[#16a34a] hover:bg-[#15803d] disabled:opacity-60 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all"
          >
            {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save & Publish
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Meta Editor Modal ────────────────────────────────────────────────────────
function MetaEditorModal({ meta, onSave, onClose }) {
  const [form, setForm] = useState({ ...meta });
  const [saving, setSaving] = useState(false);
  return (
    <Modal title="SEO & Page Settings" onClose={onClose} maxWidth="max-w-xl">
      <div className="space-y-4">
        <Field label="Page Status">
          <select value={form.page_status} onChange={e => setForm(p => ({ ...p, page_status: e.target.value }))} className={inputCls}>
            <option value="published">Published (visible to public)</option>
            <option value="draft">Draft (hidden from public)</option>
          </select>
        </Field>
        <Field label="SEO Title">
          <input value={form.seo_title || ''} onChange={e => setForm(p => ({ ...p, seo_title: e.target.value }))} className={inputCls} />
        </Field>
        <Field label="Meta Description">
          <textarea rows={3} value={form.seo_description || ''} onChange={e => setForm(p => ({ ...p, seo_description: e.target.value }))} className={textareaCls} />
        </Field>
        <Field label="OG Title (Social Sharing)">
          <input value={form.og_title || ''} onChange={e => setForm(p => ({ ...p, og_title: e.target.value }))} className={inputCls} />
        </Field>
        <Field label="OG Description">
          <textarea rows={2} value={form.og_description || ''} onChange={e => setForm(p => ({ ...p, og_description: e.target.value }))} className={textareaCls} />
        </Field>
        <Field label="Canonical URL">
          <input value={form.canonical_url || ''} onChange={e => setForm(p => ({ ...p, canonical_url: e.target.value }))} className={inputCls} />
        </Field>
      </div>
      <div className="flex gap-3 mt-6 pt-4 border-t border-slate-100">
        <button onClick={onClose} className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50">Cancel</button>
        <button
          onClick={async () => { setSaving(true); await onSave(form); setSaving(false); }}
          disabled={saving}
          className="flex-1 flex items-center justify-center gap-2 bg-[#16a34a] text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-[#15803d] disabled:opacity-60"
        >
          {saving ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          Save SEO Settings
        </button>
      </div>
    </Modal>
  );
}

// ─── Section Editor Modal ─────────────────────────────────────────────────────
function SectionEditorModal({ section, onSave, onClose, onError, showSuccess }) {
  const [form, setForm] = useState({
    label: section.label || '',
    title: section.title || '',
    subtitle: section.subtitle || '',
    description: section.description || '',
    content: section.content || '',
    paragraphs: safeJSON(section.paragraphs, []),
    image_url: section.image_url || '',
    image_alt: section.image_alt || '',
    image_caption: section.image_caption || '',
    image_position: section.image_position || 'right',
    bg_style: section.bg_style || 'white',
    cta_buttons: safeJSON(section.cta_buttons, []),
    settings: typeof section.settings === 'string' ? section.settings : JSON.stringify(section.settings || {}),
    is_visible: section.is_visible ?? true,
    status: section.status || 'draft',
  });
  const [sectionItems, setSectionItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [editItemLocal, setEditItemLocal] = useState(null);
  const [deleteItemTarget, setDeleteItemTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  const hasItems = ['why_apc', 'solutions', 'applications', 'benefits', 'technical', 'how_it_works'].includes(section.section_type);

  useEffect(() => {
    if (hasItems) {
      setLoadingItems(true);
      supabase.from('apc_section_items').select('*').eq('section_id', section.id).order('sort_order')
        .then(({ data }) => { setSectionItems(data || []); setLoadingItems(false); });
    }
  }, [section.id, hasItems]);

  async function saveSection() {
    setSaving(true);
    const payload = {
      ...form,
      paragraphs: JSON.stringify(form.paragraphs),
      cta_buttons: JSON.stringify(form.cta_buttons),
    };
    await onSave(payload);
    setSaving(false);
  }

  async function saveItem(item) {
    if (item.id) {
      const { data, error } = await supabase.from('apc_section_items').update({ ...item, updated_at: new Date().toISOString() }).eq('id', item.id).select().single();
      if (!error && data) { setSectionItems(prev => prev.map(i => i.id === data.id ? data : i)); setEditItemLocal(null); showSuccess('Item saved.'); notifyDataUpdated(); }
      else onError('Failed to save item.');
    } else {
      const { data, error } = await supabase.from('apc_section_items').insert([{ ...item, section_id: section.id }]).select().single();
      if (!error && data) { setSectionItems(prev => [...prev, data]); setEditItemLocal(null); showSuccess('Item added.'); notifyDataUpdated(); }
      else onError('Failed to add item.');
    }
  }

  async function deleteItem(id) {
    const { error } = await supabase.from('apc_section_items').delete().eq('id', id);
    if (!error) { setSectionItems(prev => prev.filter(i => i.id !== id)); showSuccess('Item deleted.'); notifyDataUpdated(); }
    setDeleteItemTarget(null);
  }

  async function moveItem(item, dir) {
    const sorted = [...sectionItems].sort((a, b) => a.sort_order - b.sort_order);
    const idx = sorted.findIndex(i => i.id === item.id);
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const a = sorted[idx], b = sorted[swapIdx];
    await Promise.all([
      supabase.from('apc_section_items').update({ sort_order: b.sort_order }).eq('id', a.id),
      supabase.from('apc_section_items').update({ sort_order: a.sort_order }).eq('id', b.id),
    ]);
    setSectionItems(prev => prev.map(i => {
      if (i.id === a.id) return { ...i, sort_order: b.sort_order };
      if (i.id === b.id) return { ...i, sort_order: a.sort_order };
      return i;
    }));
    notifyDataUpdated();
  }

  return (
    <Modal title={`Edit: ${SECTION_TYPE_LABELS[section.section_type] || section.section_type}`} onClose={onClose} maxWidth="max-w-3xl">
      <div className="space-y-5">
        {/* Basic fields */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Section Label (e.g. APC POWER PROTECTION)">
            <input value={form.label} onChange={e => setForm(p => ({ ...p, label: e.target.value }))} className={inputCls} />
          </Field>
          <Field label="Visibility">
            <select value={form.is_visible ? 'true' : 'false'} onChange={e => setForm(p => ({ ...p, is_visible: e.target.value === 'true' }))} className={inputCls}>
              <option value="true">Visible</option>
              <option value="false">Hidden</option>
            </select>
          </Field>
        </div>

        <Field label="Section Title">
          <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className={inputCls} />
        </Field>

        {['hero', 'content', 'cta', 'custom'].includes(section.section_type) && (
          <Field label="Subtitle">
            <input value={form.subtitle} onChange={e => setForm(p => ({ ...p, subtitle: e.target.value }))} className={inputCls} />
          </Field>
        )}

        <Field label="Description / Short Summary">
          <textarea rows={2} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className={textareaCls} />
        </Field>

        {/* Paragraphs - for content/custom sections */}
        {['content', 'custom', 'enquiry_form'].includes(section.section_type) && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700">Paragraphs</label>
              <button
                onClick={() => setForm(p => ({ ...p, paragraphs: [...p.paragraphs, ''] }))}
                className="text-xs text-[#16a34a] font-bold flex items-center gap-1 hover:underline"
              >
                <Plus className="w-3 h-3" /> Add Paragraph
              </button>
            </div>
            <div className="space-y-2">
              {form.paragraphs.map((para, i) => (
                <div key={i} className="flex gap-2">
                  <textarea
                    rows={3}
                    value={para}
                    onChange={e => {
                      const arr = [...form.paragraphs];
                      arr[i] = e.target.value;
                      setForm(p => ({ ...p, paragraphs: arr }));
                    }}
                    className={`flex-1 ${textareaCls}`}
                    placeholder={`Paragraph ${i + 1}...`}
                  />
                  <button
                    onClick={() => setForm(p => ({ ...p, paragraphs: p.paragraphs.filter((_, j) => j !== i) }))}
                    className="p-1.5 text-slate-400 hover:text-red-500 transition-colors self-start mt-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {form.paragraphs.length === 0 && (
                <p className="text-xs text-slate-400 italic">No paragraphs yet. Click "Add Paragraph" above.</p>
              )}
            </div>
          </div>
        )}

        {/* Image */}
        {!['why_apc', 'applications', 'benefits', 'technical', 'how_it_works', 'gallery', 'enquiry_form', 'contact', 'map'].includes(section.section_type) && (
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              {section.section_type === 'hero' ? 'Hero Background Image' : 'Section Image'}
            </label>
            <ImageUpload
              value={form.image_url}
              onChange={url => setForm(p => ({ ...p, image_url: url }))}
              folder="apc-page"
              aspectRatio="16/9"
            />
            {form.image_url && (
              <div className="mt-2 grid sm:grid-cols-2 gap-2">
                <input value={form.image_alt} onChange={e => setForm(p => ({ ...p, image_alt: e.target.value }))} className={inputCls} placeholder="Image alt text" />
                <input value={form.image_caption} onChange={e => setForm(p => ({ ...p, image_caption: e.target.value }))} className={inputCls} placeholder="Image caption (optional)" />
              </div>
            )}
            {['content', 'custom'].includes(section.section_type) && (
              <div className="mt-2">
                <label className="text-xs font-bold text-slate-700 mb-1 block">Image Position</label>
                <select value={form.image_position} onChange={e => setForm(p => ({ ...p, image_position: e.target.value }))} className={inputCls}>
                  <option value="right">Right of text</option>
                  <option value="left">Left of text</option>
                  <option value="full">Full width</option>
                  <option value="background">Background</option>
                </select>
              </div>
            )}
          </div>
        )}

        {/* CTA Buttons */}
        {['hero', 'cta', 'custom'].includes(section.section_type) && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700">CTA Buttons</label>
              <button
                onClick={() => setForm(p => ({ ...p, cta_buttons: [...(p.cta_buttons || []), { text: 'New Button', link: '/', style: 'secondary' }] }))}
                className="text-xs text-[#16a34a] font-bold flex items-center gap-1 hover:underline"
              >
                <Plus className="w-3 h-3" /> Add Button
              </button>
            </div>
            <div className="space-y-2">
              {(form.cta_buttons || []).map((btn, i) => (
                <div key={i} className="flex gap-2 items-center bg-slate-50 rounded-xl p-3">
                  <input value={btn.text} onChange={e => { const b=[...form.cta_buttons]; b[i]={...b[i],text:e.target.value}; setForm(p=>({...p,cta_buttons:b})); }} className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none bg-white" placeholder="Button text" />
                  <input value={btn.link} onChange={e => { const b=[...form.cta_buttons]; b[i]={...b[i],link:e.target.value}; setForm(p=>({...p,cta_buttons:b})); }} className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none bg-white" placeholder="Link URL" />
                  <select value={btn.style} onChange={e => { const b=[...form.cta_buttons]; b[i]={...b[i],style:e.target.value}; setForm(p=>({...p,cta_buttons:b})); }} className="px-2 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none bg-white">
                    <option value="primary">Primary</option>
                    <option value="secondary">Secondary</option>
                    <option value="whatsapp">WhatsApp</option>
                  </select>
                  <button onClick={() => setForm(p => ({ ...p, cta_buttons: (p.cta_buttons||[]).filter((_,j)=>j!==i) }))} className="p-1 text-slate-400 hover:text-red-500">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Map settings */}
        {section.section_type === 'map' && (
          <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <h4 className="text-xs font-bold text-slate-700">Map Settings</h4>
            {(() => {
              const s = safeJSON(form.settings, {});
              return (
                <>
                  <Field label="Google Maps Embed URL">
                    <textarea
                      rows={3}
                      value={s.map_embed_url || ''}
                      onChange={e => setForm(p => ({ ...p, settings: JSON.stringify({ ...safeJSON(p.settings, {}), map_embed_url: e.target.value }) }))}
                      className={textareaCls}
                      placeholder="https://www.google.com/maps/embed?pb=..."
                    />
                  </Field>
                  <Field label="Address (shown below map)">
                    <input
                      value={s.address || ''}
                      onChange={e => setForm(p => ({ ...p, settings: JSON.stringify({ ...safeJSON(p.settings, {}), address: e.target.value }) }))}
                      className={inputCls}
                    />
                  </Field>
                </>
              );
            })()}
          </div>
        )}

        {/* Enquiry form settings */}
        {section.section_type === 'enquiry_form' && (
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <h4 className="text-xs font-bold text-slate-700 mb-3">Form Settings</h4>
            {(() => {
              const s = safeJSON(form.settings, {});
              return (
                <Field label="Submit Button Text">
                  <input
                    value={s.submit_button_text || 'Submit Enquiry'}
                    onChange={e => setForm(p => ({ ...p, settings: JSON.stringify({ ...safeJSON(p.settings, {}), submit_button_text: e.target.value }) }))}
                    className={inputCls}
                  />
                </Field>
              );
            })()}
          </div>
        )}

        {/* Section Items */}
        {hasItems && (
          <div className="border-t border-slate-100 pt-5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-slate-800">
                {section.section_type === 'how_it_works' ? 'Process Steps' :
                 section.section_type === 'solutions' ? 'APC Solutions' :
                 section.section_type === 'applications' ? 'Applications' :
                 section.section_type === 'benefits' ? 'Benefits' :
                 section.section_type === 'technical' ? 'Technology Items' :
                 'Feature Items'} ({sectionItems.length})
              </h4>
              <button
                onClick={() => setEditItemLocal({
                  section_id: section.id,
                  item_number: '',
                  icon: 'Zap',
                  title: '',
                  subtitle: '',
                  description: '',
                  image_url: '',
                  link_url: '',
                  link_text: '',
                  application: '',
                  sort_order: sectionItems.length + 1,
                  is_visible: true,
                })}
                className="flex items-center gap-1 px-3 py-1.5 bg-[#16a34a] hover:bg-[#15803d] text-white rounded-xl text-xs font-bold transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add Item
              </button>
            </div>

            {loadingItems ? (
              <div className="flex items-center justify-center py-8">
                <Loader className="w-5 h-5 animate-spin text-slate-400" />
              </div>
            ) : (
              <div className="space-y-2">
                {[...sectionItems].sort((a, b) => a.sort_order - b.sort_order).map((item, idx, arr) => (
                  <div key={item.id} className={`flex items-center gap-3 bg-slate-50 border rounded-xl p-3 ${!item.is_visible ? 'opacity-60' : 'border-slate-200'}`}>
                    <div className="flex flex-col gap-1">
                      <button onClick={() => moveItem(item, -1)} disabled={idx === 0} className="p-0.5 text-slate-300 hover:text-slate-600 disabled:opacity-20">
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button onClick={() => moveItem(item, 1)} disabled={idx === arr.length - 1} className="p-0.5 text-slate-300 hover:text-slate-600 disabled:opacity-20">
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    </div>
                    {item.item_number && (
                      <span className="text-xs font-black text-[#16a34a] w-6 text-center">{item.item_number}</span>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-slate-800 truncate">{item.title}</div>
                      <div className="text-xs text-slate-400 truncate">{item.description?.slice(0, 80)}{item.description?.length > 80 ? '...' : ''}</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${item.is_visible ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                        {item.is_visible ? 'Visible' : 'Hidden'}
                      </span>
                      <button onClick={() => setEditItemLocal(item)} className="p-1.5 text-slate-400 hover:text-[#16a34a] hover:bg-green-50 rounded-lg transition-colors">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setDeleteItemTarget(item)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
                {sectionItems.length === 0 && (
                  <p className="text-xs text-slate-400 text-center py-4 italic">No items yet. Click "Add Item" to add one.</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Save button */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} className="px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none bg-white">
            <option value="draft">Save as Draft</option>
            <option value="published">Publish</option>
          </select>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50">Cancel</button>
            <button onClick={saveSection} disabled={saving} className="flex items-center gap-2 bg-[#16a34a] hover:bg-[#15803d] disabled:opacity-60 text-white px-6 py-2 rounded-xl text-xs font-bold transition-all">
              {saving ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Item editor sub-modal */}
      {editItemLocal && (
        <SectionItemEditorModal
          item={editItemLocal}
          sectionType={section.section_type}
          onSave={saveItem}
          onClose={() => setEditItemLocal(null)}
        />
      )}
      <ConfirmDialog
        isOpen={!!deleteItemTarget}
        title="Delete Item"
        message={`Delete "${deleteItemTarget?.title}"? This cannot be undone.`}
        onConfirm={() => deleteItem(deleteItemTarget.id)}
        onCancel={() => setDeleteItemTarget(null)}
      />
    </Modal>
  );
}

// ─── Section Item Editor Modal ────────────────────────────────────────────────
function SectionItemEditorModal({ item, sectionType, onSave, onClose }) {
  const [form, setForm] = useState({ ...item });
  const [saving, setSaving] = useState(false);
  const showNumber = ['why_apc', 'how_it_works'].includes(sectionType);
  const showApplication = sectionType === 'solutions';
  const showLink = sectionType === 'solutions';
  const showImage = sectionType === 'solutions';
  return (
    <Modal title={item.id ? 'Edit Item' : 'Add Item'} onClose={onClose} maxWidth="max-w-xl" isSubModal>
      <div className="space-y-4">
        {showNumber && (
          <Field label="Step / Number (e.g. 01, 1)">
            <input value={form.item_number || ''} onChange={e => setForm(p => ({ ...p, item_number: e.target.value }))} className={inputCls} />
          </Field>
        )}
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Icon (Lucide icon name)" >
            <input value={form.icon || ''} onChange={e => setForm(p => ({ ...p, icon: e.target.value }))} className={inputCls} placeholder="e.g. Zap, ShieldCheck" />
          </Field>
          <Field label="Visibility">
            <select value={form.is_visible ? 'true' : 'false'} onChange={e => setForm(p => ({ ...p, is_visible: e.target.value === 'true' }))} className={inputCls}>
              <option value="true">Visible</option>
              <option value="false">Hidden</option>
            </select>
          </Field>
        </div>
        <Field label="Title" required>
          <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className={inputCls} required />
        </Field>
        <Field label="Description">
          <textarea rows={3} value={form.description || ''} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className={textareaCls} />
        </Field>
        {showApplication && (
          <Field label="Application / Use Case">
            <input value={form.application || ''} onChange={e => setForm(p => ({ ...p, application: e.target.value }))} className={inputCls} placeholder="e.g. Data Centres, Servers, Offices" />
          </Field>
        )}
        {showLink && (
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Button Text">
              <input value={form.link_text || ''} onChange={e => setForm(p => ({ ...p, link_text: e.target.value }))} className={inputCls} placeholder="Enquire Now" />
            </Field>
            <Field label="Button Link">
              <input value={form.link_url || ''} onChange={e => setForm(p => ({ ...p, link_url: e.target.value }))} className={inputCls} placeholder="/contact" />
            </Field>
          </div>
        )}
        {showImage && (
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Item Image</label>
            <ImageUpload
              value={form.image_url || ''}
              onChange={url => setForm(p => ({ ...p, image_url: url }))}
              folder="apc-items"
              aspectRatio="4/3"
            />
            {form.image_url && (
              <input value={form.image_alt || ''} onChange={e => setForm(p => ({ ...p, image_alt: e.target.value }))} className={`${inputCls} mt-2`} placeholder="Image alt text" />
            )}
          </div>
        )}
        <Field label="Sort Order">
          <input type="number" value={form.sort_order || 1} onChange={e => setForm(p => ({ ...p, sort_order: parseInt(e.target.value) || 1 }))} className={inputCls} />
        </Field>
      </div>
      <div className="flex gap-3 mt-6 pt-4 border-t border-slate-100">
        <button onClick={onClose} className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50">Cancel</button>
        <button
          onClick={async () => { setSaving(true); await onSave(form); setSaving(false); }}
          disabled={saving || !form.title}
          className="flex-1 flex items-center justify-center gap-2 bg-[#16a34a] text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-[#15803d] disabled:opacity-60"
        >
          {saving ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          {item.id ? 'Save Changes' : 'Add Item'}
        </button>
      </div>
    </Modal>
  );
}

// ─── Gallery Editor Modal ─────────────────────────────────────────────────────
function GalleryEditorModal({ section, onClose, showSuccess, onError }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingImg, setAddingImg] = useState(false);
  const [newImg, setNewImg] = useState({ image_url: '', alt_text: '', caption: '' });
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    supabase.from('apc_page_images').select('*').eq('section_id', section.id).order('sort_order')
      .then(({ data }) => { setImages(data || []); setLoading(false); });
  }, [section.id]);

  async function addImage() {
    if (!newImg.image_url) return;
    const { data, error } = await supabase.from('apc_page_images')
      .insert([{ ...newImg, section_id: section.id, sort_order: images.length + 1, is_visible: true }])
      .select().single();
    if (!error && data) {
      setImages(prev => [...prev, data]);
      setNewImg({ image_url: '', alt_text: '', caption: '' });
      setAddingImg(false);
      showSuccess('Image added to gallery.');
      notifyDataUpdated();
    } else onError('Failed to add image.');
  }

  async function updateImage(id, updates) {
    const { error } = await supabase.from('apc_page_images').update(updates).eq('id', id);
    if (!error) {
      setImages(prev => prev.map(img => img.id === id ? { ...img, ...updates } : img));
      notifyDataUpdated();
    }
  }

  async function deleteImage(id) {
    const { error } = await supabase.from('apc_page_images').delete().eq('id', id);
    if (!error) { setImages(prev => prev.filter(img => img.id !== id)); showSuccess('Image removed from gallery.'); notifyDataUpdated(); }
    setDeleteTarget(null);
  }

  async function moveImage(img, dir) {
    const sorted = [...images].sort((a, b) => a.sort_order - b.sort_order);
    const idx = sorted.findIndex(i => i.id === img.id);
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const a = sorted[idx], b = sorted[swapIdx];
    await Promise.all([
      supabase.from('apc_page_images').update({ sort_order: b.sort_order }).eq('id', a.id),
      supabase.from('apc_page_images').update({ sort_order: a.sort_order }).eq('id', b.id),
    ]);
    setImages(prev => prev.map(i => {
      if (i.id === a.id) return { ...i, sort_order: b.sort_order };
      if (i.id === b.id) return { ...i, sort_order: a.sort_order };
      return i;
    }));
    notifyDataUpdated();
  }

  return (
    <Modal title="Gallery Image Manager" onClose={onClose} maxWidth="max-w-2xl">
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-8"><Loader className="w-6 h-6 animate-spin text-slate-400" /></div>
        ) : (
          <>
            {[...images].sort((a,b) => a.sort_order - b.sort_order).map((img, idx, arr) => (
              <div key={img.id} className="flex gap-3 items-start bg-slate-50 border border-slate-200 rounded-xl p-3">
                <div className="flex flex-col gap-1">
                  <button onClick={() => moveImage(img, -1)} disabled={idx === 0} className="p-0.5 text-slate-300 hover:text-slate-600 disabled:opacity-20"><ArrowUp className="w-3 h-3" /></button>
                  <button onClick={() => moveImage(img, 1)} disabled={idx === arr.length - 1} className="p-0.5 text-slate-300 hover:text-slate-600 disabled:opacity-20"><ArrowDown className="w-3 h-3" /></button>
                </div>
                <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-slate-200 border border-slate-100">
                  {img.image_url ? <img src={img.image_url} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Image className="w-6 h-6 text-slate-300" /></div>}
                </div>
                <div className="flex-1 space-y-2 min-w-0">
                  <ImageUpload
                    value={img.image_url}
                    onChange={url => updateImage(img.id, { image_url: url })}
                    folder="apc-gallery"
                    aspectRatio="4/3"
                    label=""
                  />
                  <input value={img.alt_text || ''} onChange={e => updateImage(img.id, { alt_text: e.target.value })} className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#16a34a] bg-white" placeholder="Alt text" />
                  <input value={img.caption || ''} onChange={e => updateImage(img.id, { caption: e.target.value })} className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#16a34a] bg-white" placeholder="Caption (optional)" />
                </div>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => updateImage(img.id, { is_visible: !img.is_visible })}
                    className={`p-1.5 rounded-lg transition-colors ${img.is_visible ? 'text-blue-500 hover:bg-blue-50' : 'text-slate-300 hover:bg-slate-100'}`}
                  >
                    {img.is_visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                  <button onClick={() => setDeleteTarget(img)} className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {images.length === 0 && (
              <p className="text-center text-slate-400 text-sm py-4">No gallery images yet.</p>
            )}

            {/* Add new */}
            {addingImg ? (
              <div className="bg-white border border-[#16a34a]/30 rounded-xl p-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-700">Add New Image</h4>
                <ImageUpload value={newImg.image_url} onChange={url => setNewImg(p => ({ ...p, image_url: url }))} folder="apc-gallery" aspectRatio="4/3" label="" />
                <input value={newImg.alt_text} onChange={e => setNewImg(p => ({ ...p, alt_text: e.target.value }))} className={inputCls} placeholder="Alt text" />
                <input value={newImg.caption} onChange={e => setNewImg(p => ({ ...p, caption: e.target.value }))} className={inputCls} placeholder="Caption (optional)" />
                <div className="flex gap-2">
                  <button onClick={() => setAddingImg(false)} className="flex-1 px-3 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50">Cancel</button>
                  <button onClick={addImage} disabled={!newImg.image_url} className="flex-1 px-3 py-2 bg-[#16a34a] text-white rounded-xl text-xs font-bold hover:bg-[#15803d] disabled:opacity-60">Add Image</button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setAddingImg(true)}
                className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-slate-200 hover:border-[#16a34a] text-slate-500 hover:text-[#16a34a] px-4 py-3 rounded-xl text-xs font-bold transition-all"
              >
                <Plus className="w-4 h-4" /> Add Gallery Image
              </button>
            )}
          </>
        )}
      </div>
      <button onClick={onClose} className="w-full mt-4 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50">
        Done
      </button>
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Remove Gallery Image"
        message="Remove this image from the gallery? This cannot be undone."
        onConfirm={() => deleteImage(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
      />
    </Modal>
  );
}

// ─── Enquiry Detail Modal ─────────────────────────────────────────────────────
function EnquiryDetailModal({ enquiry, onStatusChange, onClose, onDelete }) {
  return (
    <Modal title="Customer Enquiry Details" onClose={onClose} maxWidth="max-w-lg">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Name', value: enquiry.customer_name },
            { label: 'Company', value: enquiry.company_name },
            { label: 'Phone', value: enquiry.phone },
            { label: 'Email', value: enquiry.email },
            { label: 'Requirement', value: enquiry.requirement },
            { label: 'Preferred Contact', value: enquiry.preferred_contact },
          ].map(({ label, value }) => (
            <div key={label}>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</div>
              <div className="text-sm text-slate-800 mt-0.5">{value || '—'}</div>
            </div>
          ))}
        </div>
        {enquiry.message && (
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Message</div>
            <div className="text-sm text-slate-700 bg-slate-50 rounded-xl p-3 border border-slate-100 leading-relaxed">{enquiry.message}</div>
          </div>
        )}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Update Status</div>
            <select
              value={enquiry.status}
              onChange={e => onStatusChange(enquiry.id, e.target.value)}
              className={`${inputCls} text-xs`}
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div className="text-xs text-slate-400">
            {new Date(enquiry.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          {enquiry.phone && (
            <a href={`tel:${enquiry.phone}`} className="flex items-center gap-1.5 bg-[#16a34a] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#15803d]">
              <Phone className="w-3.5 h-3.5" /> Call
            </a>
          )}
          {enquiry.phone && (
            <a href={`https://wa.me/91${enquiry.phone}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 bg-[#25D366] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#1ea355]">
              WhatsApp
            </a>
          )}
          <button onClick={() => onDelete(enquiry.id)} className="ml-auto flex items-center gap-1.5 px-3 py-2 border border-red-200 text-red-600 rounded-xl text-xs font-bold hover:bg-red-50">
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Edit Form Field Modal ───────────────────────────────────────────────────
function EditFormFieldModal({ field, onSave, onClose, saving }) {
  const [f, setF] = useState({ ...field });

  return (
    <Modal title="Edit Form Field" onClose={onClose} maxWidth="max-w-md">
      <div className="space-y-4">
        <Field label="Field Label">
          <input value={f.field_label} onChange={e => setF(p => ({ ...p, field_label: e.target.value }))} className={inputCls} />
        </Field>
        <Field label="Placeholder Text">
          <input value={f.placeholder || ''} onChange={e => setF(p => ({ ...p, placeholder: e.target.value }))} className={inputCls} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Required">
            <select value={f.is_required ? 'true' : 'false'} onChange={e => setF(p => ({ ...p, is_required: e.target.value === 'true' }))} className={inputCls}>
              <option value="true">Required</option>
              <option value="false">Optional</option>
            </select>
          </Field>
          <Field label="Visible">
            <select value={f.is_visible ? 'true' : 'false'} onChange={e => setF(p => ({ ...p, is_visible: e.target.value === 'true' }))} className={inputCls}>
              <option value="true">Visible</option>
              <option value="false">Hidden</option>
            </select>
          </Field>
        </div>
        <Field label="Sort Order">
          <input type="number" value={f.sort_order || 1} onChange={e => setF(p => ({ ...p, sort_order: parseInt(e.target.value) }))} className={inputCls} />
        </Field>
        <div className="flex gap-3 pt-4 border-t border-slate-100">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50">Cancel</button>
          <button
            onClick={() => onSave(f)}
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 bg-[#16a34a] text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-[#15803d] disabled:opacity-60"
          >
            {saving ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Form Config Admin ────────────────────────────────────────────────────────
function FormConfigAdmin({ formConfig, onUpdated, onError }) {
  const [editField, setEditField] = useState(null);
  const [saving, setSaving] = useState(false);

  async function saveField(field) {
    setSaving(true);
    const { data, error } = await supabase
      .from('apc_enquiry_form_config')
      .update({ ...field, updated_at: new Date().toISOString() })
      .eq('id', field.id)
      .select().single();
    setSaving(false);
    if (!error && data) { onUpdated(data); setEditField(null); }
    else onError('Failed to update form field.');
  }

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">Enquiry Form Fields</h3>
          <div className="text-xs text-slate-400">Edit field labels, requirements and visibility</div>
        </div>
        <div className="divide-y divide-slate-50">
          {[...formConfig].sort((a, b) => a.sort_order - b.sort_order).map(field => (
            <div key={field.id} className="flex items-center gap-4 px-6 py-4">
              <div className="flex-1">
                <div className="font-semibold text-slate-800 text-sm">{field.field_label}</div>
                <div className="text-xs text-slate-400 mt-0.5">
                  <span className="font-mono">{field.field_key}</span> · {field.field_type}
                  {field.is_required && <span className="ml-2 text-red-500 font-bold">Required</span>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${field.is_visible ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                  {field.is_visible ? 'Visible' : 'Hidden'}
                </span>
                <button
                  onClick={() => setEditField(field)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-[#0a1f35] hover:bg-[#16a34a] text-white rounded-xl text-xs font-bold transition-colors"
                >
                  <Edit2 className="w-3 h-3" /> Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {editField && (
        <EditFormFieldModal
          field={editField}
          saving={saving}
          onSave={saveField}
          onClose={() => setEditField(null)}
        />
      )}
    </div>
  );
}

// ─── Generic Modal Wrapper ────────────────────────────────────────────────────
function Modal({ title, onClose, children, maxWidth = 'max-w-2xl', isSubModal = false }) {
  return (
    <div className={`fixed inset-0 z-[${isSubModal ? 110 : 100}] flex items-start justify-center p-4 pt-8 overflow-y-auto`}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-white rounded-2xl ${maxWidth} w-full p-6 shadow-2xl border border-slate-100 my-4`}>
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100">
          <h3 className="font-black text-slate-900 text-base">{title}</h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
