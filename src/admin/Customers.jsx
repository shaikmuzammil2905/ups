import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import {
  Users, Search, Download, Phone, Mail, Calendar, ShoppingBag,
  Loader, ShieldCheck, UserCheck
} from 'lucide-react';

export default function CustomersAdmin() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch from profiles or combine with order customer emails
      const { data: profiles, error: err1 } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      // Also get orders customer summary
      const { data: orders, error: err2 } = await supabase
        .from('orders')
        .select('customer_name, customer_email, customer_phone, total_amount');

      const customerMap = new Map();

      // add profiles
      (profiles || []).forEach(p => {
        const key = p.email?.toLowerCase() || p.id;
        customerMap.set(key, {
          id: p.id,
          name: p.full_name || 'Registered User',
          email: p.email,
          phone: '',
          role: p.role,
          orders_count: 0,
          total_spent: 0,
          created_at: p.created_at,
        });
      });

      // combine orders
      (orders || []).forEach(o => {
        if (!o.customer_email && !o.customer_phone) return;
        const key = (o.customer_email?.toLowerCase()) || (o.customer_phone);
        const existing = customerMap.get(key) || {
          id: key,
          name: o.customer_name || 'Guest Customer',
          email: o.customer_email || '—',
          phone: o.customer_phone || '—',
          role: 'guest',
          orders_count: 0,
          total_spent: 0,
          created_at: new Date().toISOString(),
        };
        existing.orders_count += 1;
        existing.total_spent += Number(o.total_amount || 0);
        if (o.customer_phone && !existing.phone) existing.phone = o.customer_phone;
        customerMap.set(key, existing);
      });

      setCustomers(Array.from(customerMap.values()));
    } catch (err) {
      console.error('Fetch customers error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleExportCSV = () => {
    if (customers.length === 0) return;
    const headers = ['Name', 'Email', 'Phone', 'Role', 'Orders Count', 'Total Spent (INR)', 'Joined Date'];
    const rows = customers.map(c => [
      `"${c.name || ''}"`,
      `"${c.email || ''}"`,
      `"${c.phone || ''}"`,
      `"${c.role || ''}"`,
      c.orders_count || 0,
      c.total_spent || 0,
      `"${new Date(c.created_at).toLocaleDateString('en-IN')}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `livkam_customers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredCustomers = customers.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2.5">
            <Users className="w-7 h-7 text-[#16a34a]" />
            Customer Directory
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Registered customer accounts, repeat buyers, contact details, and lifetime order spend.
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-sm shadow-md transition-all self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#16a34a]"
          />
        </div>
        <div className="text-sm text-slate-500 font-medium">
          Total Customers: <span className="font-bold text-slate-800">{customers.length}</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <Loader className="w-8 h-8 animate-spin mx-auto mb-2 text-[#16a34a]" />
            Loading customers...
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-base font-semibold text-slate-600">No customers registered yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold tracking-wider border-b border-slate-100">
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4 text-center">Orders</th>
                  <th className="py-3 px-4 text-right">Total Spent</th>
                  <th className="py-3 px-4 text-right">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredCustomers.map((c, i) => (
                  <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                          {c.name?.charAt(0) || 'C'}
                        </div>
                        <div>
                          <div>{c.name}</div>
                          <div className="text-xs text-slate-400 font-normal">{c.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600">
                      <div className="font-mono">{c.phone || '—'}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        c.role === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {c.role || 'customer'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-700">
                      {c.orders_count || 0}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-800">
                      ₹{(c.total_spent || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-right text-xs text-slate-400">
                      {new Date(c.created_at).toLocaleDateString('en-IN', {
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
