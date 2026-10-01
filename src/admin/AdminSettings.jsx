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

        {/* Cloudinary Status */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Cloud className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-slate-800 text-sm">Cloudinary Media</div>
                <div className="text-xs text-slate-400 font-mono">Cloud: fgognhhy</div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Upload Preset:</span>
            <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
              ml_default (Unsigned)
            </span>
          </div>
        </div>
      </div>

      {/* SQL Migration Quick Reference */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Database className="w-5 h-5 text-[#16a34a]" />
              Supabase SQL Migration File
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              The project includes a ready-to-run file: <span className="font-mono font-semibold">supabase_migration.sql</span>
            </p>
          </div>
          <a
            href="https://supabase.com/dashboard/project/shzlxqkjxuyxruthrsam/sql"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
          >
            Open SQL Editor <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="p-4 bg-slate-900 rounded-2xl text-slate-300 font-mono text-xs overflow-x-auto">
          <code>
            -- The file "supabase_migration.sql" at the root contains all 12 tables:<br />
            -- profiles, site_settings, categories, brands, products, product_images,<br />
            -- services, advertisements, posts, reviews, orders, order_items, catalogs,<br />
            -- hero_slides, enquiries, website_content + automatic seed data.
          </code>
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
