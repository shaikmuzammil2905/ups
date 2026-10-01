import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import ConfirmDialog from './components/ConfirmDialog';
import {
  ShoppingCart, Search, Filter, Eye, Trash2, Printer, CheckCircle,
  Clock, Truck, AlertTriangle, XCircle, ArrowUpRight, Phone, Mail, MapPin, Loader, Check
} from 'lucide-react';

const STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  confirmed: { label: 'Confirmed', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  processing: { label: 'Processing', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  shipped: { label: 'Shipped', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  delivered: { label: 'Delivered', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  cancelled: { label: 'Cancelled', color: 'bg-red-50 text-red-700 border-red-200' },
};

export default function OrdersAdmin() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('orders')
        .select(`*, order_items(*)`)
        .order('created_at', { ascending: false });

      if (statusFilter) {
        query = query.eq('status', statusFilter);
      }

      const { data, error: err } = await query;
      if (err) throw err;
      setOrders(data || []);
    } catch (err) {
      console.error('Fetch orders error:', err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const showNotification = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const { error: err } = await supabase
        .from('orders')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId);
      if (err) throw err;
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => ({ ...prev, status: newStatus }));
      }
      showNotification(`Order status updated to "${newStatus}".`);
    } catch (err) {
      alert(`Error updating status: ${err.message}`);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      const { error: err } = await supabase
        .from('orders')
        .delete()
        .eq('id', deleteConfirm.id);
      if (err) throw err;
      setOrders(prev => prev.filter(o => o.id !== deleteConfirm.id));
      if (selectedOrder?.id === deleteConfirm.id) setSelectedOrder(null);
      setDeleteConfirm(null);
      showNotification('Order deleted.');
    } catch (err) {
      alert(`Delete error: ${err.message}`);
    }
  };

  const filteredOrders = orders.filter(o =>
    o.order_number?.toLowerCase().includes(search.toLowerCase()) ||
    o.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
    o.customer_phone?.includes(search) ||
    o.customer_email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2.5">
            <ShoppingCart className="w-7 h-7 text-[#16a34a]" />
            Orders Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track customer orders, invoice breakdowns, delivery fulfillment, and GST calculations.
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
            placeholder="Search order number or customer..."
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
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <div className="text-sm text-slate-500 font-medium whitespace-nowrap">
            Total Orders: <span className="font-bold text-slate-800">{orders.length}</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <Loader className="w-8 h-8 animate-spin mx-auto mb-2 text-[#16a34a]" />
            Loading orders...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-base font-semibold text-slate-600">No orders placed yet</p>
            <p className="text-xs text-slate-400 mt-1">Orders from the checkout process will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold tracking-wider border-b border-slate-100">
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredOrders.map((o) => {
                  const cfg = STATUS_CONFIG[o.status || 'pending'] || STATUS_CONFIG.pending;
                  return (
                    <tr key={o.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-xs text-slate-800">
                        {o.order_number || `#LVK-${o.id.slice(0, 6).toUpperCase()}`}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-400 whitespace-nowrap">
                        {new Date(o.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800">{o.customer_name || 'Anonymous Customer'}</div>
                        <div className="text-xs text-slate-400">{o.customer_phone}</div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-800">
                        ₹{(o.total_amount || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4 text-xs">
                        <span className="inline-block px-2 py-0.5 rounded font-mono font-bold uppercase bg-slate-100 text-slate-600">
                          {o.payment_method || 'COD'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={o.status || 'pending'}
                          onChange={(e) => handleUpdateStatus(o.id, e.target.value)}
                          className={`text-xs font-bold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none ${cfg.color}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedOrder(o)}
                            title="View Invoice & Items"
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(o)}
                            title="Delete"
                            className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail & Invoice Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <div className="text-xs font-bold text-[#16a34a] uppercase">Order Invoice</div>
                <h2 className="text-xl font-black text-slate-800">
                  {selectedOrder.order_number || `#LVK-${selectedOrder.id.slice(0, 6).toUpperCase()}`}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Customer & Shipping Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl">
              <div>
                <div className="font-bold text-slate-400 uppercase mb-1">Customer Information</div>
                <div className="font-bold text-slate-800 text-sm">{selectedOrder.customer_name}</div>
                <div className="text-slate-600 flex items-center gap-1 mt-1">
                  <Phone className="w-3 h-3 text-slate-400" />
                  {selectedOrder.customer_phone || '—'}
                </div>
                <div className="text-slate-600 flex items-center gap-1">
                  <Mail className="w-3 h-3 text-slate-400" />
                  {selectedOrder.customer_email || '—'}
                </div>
              </div>
              <div>
                <div className="font-bold text-slate-400 uppercase mb-1">Shipping & GST Details</div>
                <div className="text-slate-700 leading-relaxed">
                  {selectedOrder.shipping_address || 'Standard Store Pickup / Delivery to address'}
                </div>
                <div className="mt-2 text-[11px] text-slate-500 font-mono">
                  Livkam GSTIN: 29CYMPN3694M1ZC
                </div>
              </div>
            </div>

            {/* Ordered Items Table */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase mb-2">Order Items</h3>
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Item</th>
                      <th className="py-2.5 px-3 text-center">Qty</th>
                      <th className="py-2.5 px-3 text-right">Unit Price</th>
                      <th className="py-2.5 px-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(selectedOrder.order_items || []).map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-2.5 px-3 font-semibold text-slate-800">
                          {item.product_name || `Product #${item.product_id}`}
                        </td>
                        <td className="py-2.5 px-3 text-center text-slate-600">{item.quantity}</td>
                        <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                          ₹{(item.unit_price || 0).toLocaleString('en-IN')}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-800">
                          ₹{((item.unit_price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                    {(!selectedOrder.order_items || selectedOrder.order_items.length === 0) && (
                      <tr>
                        <td colSpan={4} className="py-4 text-center text-slate-400">
                          Direct inquiry checkout order
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot className="bg-slate-50 border-t border-slate-200 font-bold">
                    <tr>
                      <td colSpan={3} className="py-2.5 px-3 text-right text-slate-600">Total (Inc. GST):</td>
                      <td className="py-2.5 px-3 text-right font-mono text-base text-[#16a34a]">
                        ₹{(selectedOrder.total_amount || 0).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Update Status:</span>
                <select
                  value={selectedOrder.status || 'pending'}
                  onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value)}
                  className="text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
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
          title="Delete Order"
          message={`Are you sure you want to delete order "${deleteConfirm.order_number || deleteConfirm.id}"?`}
          confirmText="Yes, Delete"
          onConfirm={handleDelete}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </div>
  );
}
