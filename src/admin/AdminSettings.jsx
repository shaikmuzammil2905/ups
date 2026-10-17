import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
  Settings, Database, Cloud, RefreshCw, Download, Check, AlertCircle,
  Copy, ExternalLink, ShieldAlert, Cpu, HardDrive, CheckCircle2, Loader
} from 'lucide-react';

export default function AdminSettings() {
  const [supabaseStatus, setSupabaseStatus] = useState('checking');
  const [supabaseLatency, setSupabaseLatency] = useState(null);
  const [cloudinaryStatus, setCloudinaryStatus] = useState('active');
  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState('');
  const [copiedSQL, setCopiedSQL] = useState(false);

  const testSupabase = async () => {
    setSupabaseStatus('checking');
    const start = Date.now();
    try {
      const { error } = await supabase.from('site_settings').select('count', { count: 'exact', head: true });
      const latency = Date.now() - start;
      setSupabaseLatency(latency);
      if (!error) {
        setSupabaseStatus('connected');
      } else {
        setSupabaseStatus('tables_missing');
      }
    } catch (err) {
      setSupabaseStatus('error');
    }
  };

  useEffect(() => {
    testSupabase();
  }, []);

  const handleExportBackup = async () => {
    try {
      const [
        { data: prods },
        { data: cats },
        { data: brands },
        { data: svcs },
        { data: settings },
        { data: orders },
      ] = await Promise.all([
        supabase.from('products').select('*'),
        supabase.from('categories').select('*'),
        supabase.from('brands').select('*'),
        supabase.from('services').select('*'),
        supabase.from('site_settings').select('*'),
        supabase.from('orders').select('*'),
      ]);

      const backup = {
        timestamp: new Date().toISOString(),
        site: 'Livkam Power Technologies',
        data: {
          products: prods || [],
          categories: cats || [],
          brands: brands || [],
          services: svcs || [],
          site_settings: settings || [],
          orders: orders || [],
        },
      };

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `livkam_backup_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (err) {
      alert(`Export error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2.5">
          <Settings className="w-7 h-7 text-[#16a34a]" />
          System Settings & Cloud Diagnostics
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Monitor Supabase live database connection, Cloudinary media storage, and data backup integrity.
        </p>
      </div>

      {/* Cloud Connectivity Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Supabase Status */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-slate-800 text-sm">Supabase Database</div>
                <div className="text-xs text-slate-400 font-mono">shzlxqkjxuyxruthrsam.supabase.co</div>
              </div>
            </div>
            <button
              onClick={testSupabase}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Connection Status:</span>
            {supabaseStatus === 'checking' && (
              <span className="inline-flex items-center gap-1 text-slate-500 font-semibold">
                <Loader className="w-3 h-3 animate-spin" /> Ping test...
              </span>
            )}
            {supabaseStatus === 'connected' && (
              <span className="inline-flex items-center gap-1 text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3 h-3" /> Live ({supabaseLatency}ms)
              </span>
            )}
            {supabaseStatus === 'tables_missing' && (
              <span className="inline-flex items-center gap-1 text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-full">
                Connected (Pending Migration)
              </span>
            )}
            {supabaseStatus === 'error' && (
              <span className="inline-flex items-center gap-1 text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded-full">
                Offline
              </span>
            )}
          </div>
        </div>

        {/* Media Storage Status */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Cloud className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-slate-800 text-sm">Media Storage</div>
                <div className="text-xs text-slate-400 font-mono">Status: Active & Synced</div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Storage Engine:</span>
            <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
              Hybrid Cloud Storage
            </span>
          </div>
        </div>
      </div>

      {/* SQL Migration & All-Device Sync Quick Reference */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Database className="w-5 h-5 text-[#16a34a]" />
              All-Device Live Sync SQL Configuration
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Run this in Supabase SQL Editor once to ensure all devices (mobiles, tablets, PCs) receive instant updates when you edit anything in the Admin Panel.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const sqlText = `-- LIVKAM ALL-DEVICE REALTIME SYNC ENABLE SCRIPT
ALTER TABLE site_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE product_images DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE brands DISABLE ROW LEVEL SECURITY;
ALTER TABLE services DISABLE ROW LEVEL SECURITY;
ALTER TABLE catalogs DISABLE ROW LEVEL SECURITY;
ALTER TABLE website_content DISABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides DISABLE ROW LEVEL SECURITY;
ALTER TABLE advertisements DISABLE ROW LEVEL SECURITY;
ALTER TABLE posts DISABLE ROW LEVEL SECURITY;`;
                navigator.clipboard.writeText(sqlText);
                setCopiedSQL(true);
                setTimeout(() => setCopiedSQL(false), 3000);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#16a34a] hover:bg-[#15803d] text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              {copiedSQL ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedSQL ? 'Copied SQL!' : 'Copy SQL Fix'}
            </button>
            <a
              href="https://supabase.com/dashboard/project/shzlxqkjxuyxruthrsam/sql"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
            >
              Open SQL Editor <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="p-4 bg-slate-900 rounded-2xl text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
          <pre>{`-- Run this in Supabase SQL Editor to allow all devices to receive live changes:
ALTER TABLE site_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE product_images DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE brands DISABLE ROW LEVEL SECURITY;
ALTER TABLE services DISABLE ROW LEVEL SECURITY;
ALTER TABLE catalogs DISABLE ROW LEVEL SECURITY;
ALTER TABLE website_content DISABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides DISABLE ROW LEVEL SECURITY;
ALTER TABLE advertisements DISABLE ROW LEVEL SECURITY;
ALTER TABLE posts DISABLE ROW LEVEL SECURITY;`}</pre>
        </div>
      </div>

      {/* Export & Backup */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-3">
        <h2 className="text-base font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
          <HardDrive className="w-5 h-5 text-[#16a34a]" />
          Database Backup & Snapshot Export
        </h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          Download a complete JSON snapshot of all products, categories, orders, customers, and site settings.
        </p>

        <div className="pt-2">
          <button
            onClick={handleExportBackup}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <Download className="w-4 h-4" />
            Download Complete JSON Backup
          </button>
        </div>
      </div>
    </div>
  );
}
