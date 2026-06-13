import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, CheckCircle, Clock, DollarSign, Zap, Calendar, QrCode,
  Search, RefreshCw, TrendingUp, ShieldAlert, ChevronRight, Filter,
  Package, CreditCard, BarChart3, Plus, Edit2, Trash2, X, Save,
  AlertTriangle, CheckCheck, Ban, Eye, ChevronDown, Upload, Loader2
} from 'lucide-react';
import { adminAPI } from '../services/api';
import { Link } from 'react-router-dom';

// ─── Shared helpers ────────────────────────────────────────────────────────────

const StatusBadge = ({ status }) => {
  const map = {
    confirmed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    captured: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    pending: 'bg-amber-500/10  text-amber-400  border-amber-500/20',
    cancelled: 'bg-red-500/10   text-red-400    border-red-500/20',
    failed: 'bg-red-500/10   text-red-400    border-red-500/20',
    refunded: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    available: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    unavailable: 'bg-red-500/10  text-red-400    border-red-500/20',
  };
  return (
    <span className={`px-2.5 py-0.5 text-[10px] font-semibold font-mono rounded-full border uppercase ${map[status] || 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'}`}>
      {status}
    </span>
  );
};

const ConfirmModal = ({ message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl"
    >
      <div className="flex items-center gap-3 mb-4">
        <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0" />
        <h3 className="font-bold text-black font-mono tracking-wide">CONFIRM ACTION</h3>
      </div>
      <p className="text-zinc-300 text-sm mb-6 font-mono leading-relaxed">{message}</p>
      <div className="flex gap-3">
        <button onClick={onCancel} className="flex-1 py-2 rounded-lg border border-zinc-700 text-zinc-400 hover:bg-zinc-800 transition text-sm font-mono">
          CANCEL
        </button>
        <button onClick={onConfirm} className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-black transition text-sm font-mono font-bold">
          CONFIRM
        </button>
      </div>
    </motion.div>
  </div>
);

// ─── TAB: Overview ──────────────────────────────────────────────────────────────

const OverviewTab = ({ analytics, registrations, onRefresh, refreshing }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  if (!analytics) return null;
  const { metrics, productStats, recentBookings } = analytics;
  const bookingRatio = metrics.totalSlots > 0 ? (metrics.bookedSlots / metrics.totalSlots) * 100 : 0;

  const filtered = registrations.filter(reg => {
    const q = searchQuery.toLowerCase();
    const match = [reg.User?.name, reg.User?.email, reg.booking_id, reg.Product?.name]
      .some(v => v?.toLowerCase().includes(q));
    const statusOk = statusFilter === 'all' || reg.status === statusFilter;
    return match && statusOk;
  });

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { title: 'REGISTERED USERS', value: metrics.totalUsers, sub: 'total accounts', icon: Users, color: 'cyan' },
          { title: 'CONFIRMED BOOKINGS', value: metrics.confirmedBookings, sub: `${metrics.pendingBookings} pending`, icon: CheckCircle, color: 'emerald' },
          { title: 'CAPACITY', value: `${metrics.bookedSlots}/${metrics.totalSlots}`, sub: `${metrics.availableSlots} slots open`, icon: Calendar, color: 'indigo' },
          { title: 'NET REVENUE', value: `₹${parseFloat(metrics.totalRevenue).toLocaleString('en-IN')}`, sub: 'captured payments', icon: DollarSign, color: 'purple' },
        ].map((card, i) => {
          const colorMap = {
            cyan: 'text-cyan-400   border-cyan-500/20   bg-cyan-950/10',
            emerald: 'text-emerald-400 border-emerald-500/20 bg-emerald-950/10',
            indigo: 'text-indigo-400  border-indigo-500/20  bg-indigo-950/10',
            purple: 'text-purple-400  border-purple-500/20  bg-purple-950/10',
          };
          const cls = colorMap[card.color].split(' ');
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`glass-panel p-5 rounded-xl border ${cls[1]} ${cls[2]} flex justify-between items-start`}>
              <div>
                <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-wider block mb-1">{card.title}</span>
                <span className={`text-2xl font-bold font-mono ${cls[0]}`}>{card.value}</span>
                <span className="text-zinc-600 text-[10px] block mt-1 font-mono">{card.sub}</span>
              </div>
              <div className={`p-2.5 rounded-lg border ${cls[1]} bg-zinc-900/60`}>
                <card.icon className={`w-5 h-5 ${cls[0]}`} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Progress + Product Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="glass-panel p-6 rounded-xl">
            <h2 className="text-sm font-bold font-mono tracking-wide mb-4 text-cyan-400 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> EVENT SEATING CAPACITY MATRIX
            </h2>
            <div className="flex justify-between text-xs font-mono mb-2">
              <span className="text-zinc-500">BOARDING RESERVED</span>
              <span className="text-cyan-400 font-semibold">{bookingRatio.toFixed(1)}% SECURED</span>
            </div>
            <div className="h-3 w-full bg-zinc-950 rounded-full border border-zinc-800 p-[1px]">
              <div className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-indigo-500 rounded-full transition-all duration-1000"
                style={{ width: `${bookingRatio}%` }} />
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-zinc-800/60 text-center font-mono text-xs">
              <div><span className="text-zinc-600 block mb-1">TOTAL SLOTS</span><span className="text-black font-bold">{metrics.totalSlots}</span></div>
              <div><span className="text-zinc-600 block mb-1">SECURED</span><span className="text-emerald-400 font-bold">{metrics.bookedSlots}</span></div>
              <div><span className="text-zinc-600 block mb-1">OPEN</span><span className="text-cyan-400 font-bold">{metrics.availableSlots}</span></div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="glass-panel p-6 rounded-xl">
            <h2 className="text-sm font-bold font-mono tracking-wide mb-4 text-cyan-400 flex items-center gap-2">
              <Zap className="w-4 h-4" /> GENERATOR MODELS DEMAND MATRIX
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {productStats.map((item, i) => (
                <div key={i} className="border border-zinc-800 bg-zinc-950/30 p-4 rounded-lg relative overflow-hidden hover:border-zinc-700 transition">
                  <div className="absolute top-1 right-2 font-mono text-3xl font-extrabold text-zinc-800 select-none">{item.kw}KW</div>
                  <h3 className="font-mono text-xs font-semibold text-black mb-1 uppercase">{item.name}</h3>
                  <p className="text-[10px] text-cyan-400 font-mono mb-3">{item.kw} KW</p>
                  <div className="flex justify-between border-t border-zinc-900 pt-2 font-mono text-xs">
                    <div><span className="text-zinc-600 block text-[10px]">BOOKINGS</span><span className="font-bold text-black">{item.bookings}</span></div>
                    <div className="text-right"><span className="text-zinc-600 block text-[10px]">REVENUE</span><span className="font-bold text-emerald-400">₹{parseFloat(item.revenue).toLocaleString('en-IN')}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Bookings */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass-panel p-6 rounded-xl flex flex-col">
          <h2 className="text-sm font-bold font-mono tracking-wide mb-4 text-cyan-400 flex items-center gap-2">
            <Clock className="w-4 h-4" /> LATEST REGISTRIES
          </h2>
          <div className="space-y-3 flex-1 overflow-y-auto max-h-72 pr-1">
            {recentBookings.length > 0 ? recentBookings.map((b, i) => (
              <div key={i} className="p-3 border border-zinc-900 bg-zinc-950/20 rounded-lg flex justify-between items-start font-mono text-[10px]">
                <div>
                  <div className="font-semibold text-black text-xs truncate max-w-[130px]">{b.User?.name || 'Unknown'}</div>
                  <div className="text-zinc-500">{b.booking_id}</div>
                  <div className="text-cyan-400">{b.Product?.name}</div>
                </div>
                <div className="text-right space-y-1">
                  <StatusBadge status={b.status} />
                  <div className="text-zinc-600">{new Date(b.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
            )) : (
              <div className="h-32 flex items-center justify-center text-zinc-600 font-mono text-xs">NO BOOKINGS YET</div>
            )}
          </div>
          <button onClick={() => document.getElementById('ledger-terminal')?.scrollIntoView({ behavior: 'smooth' })}
            className="mt-4 w-full py-2 font-mono text-xs text-zinc-500 border border-zinc-800 hover:bg-zinc-900 hover:text-black rounded-lg transition flex items-center justify-center gap-2">
            VIEW FULL LEDGER <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      </div>

      {/* Registrations Ledger */}
      <motion.div id="ledger-terminal" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
        className="glass-panel rounded-xl overflow-hidden border border-zinc-800">
        <div className="p-5 border-b border-zinc-800/80 bg-zinc-950/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-sm font-bold font-mono text-cyan-400 flex items-center gap-2">
              <Filter className="w-4 h-4" /> BOARDING PASS LEDGER
            </h2>
            <p className="text-zinc-500 font-mono text-[10px] mt-0.5">Complete registry of all event registrations</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 sm:w-56">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
              <input type="text" placeholder="Search name, email, ID..." value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 font-mono text-xs bg-zinc-950 border border-zinc-800 rounded-lg focus:border-cyan-500 outline-none text-black" />
            </div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 font-mono text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-black focus:border-cyan-500 outline-none cursor-pointer">
              <option value="all">ALL STATUS</option>
              <option value="confirmed">CONFIRMED</option>
              <option value="pending">PENDING</option>
              <option value="cancelled">CANCELLED</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950/30 text-zinc-500 font-mono text-[10px] uppercase tracking-wider">
                <th className="py-3 px-5">Booking ID</th>
                <th className="py-3 px-5">Guest</th>
                <th className="py-3 px-5">Product</th>
                <th className="py-3 px-5">Payment</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5 text-center">Pass</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900 font-mono text-xs text-zinc-300">
              {filtered.length > 0 ? filtered.map((reg, i) => (
                <tr key={i} className="hover:bg-zinc-950/30 transition">
                  <td className="py-3 px-5 font-semibold text-black">{reg.booking_id}</td>
                  <td className="py-3 px-5">
                    <div className="font-semibold text-black">{reg.User?.name}</div>
                    <div className="text-zinc-500 text-[10px]">{reg.User?.email}</div>
                    <div className="text-zinc-600 text-[10px]">{reg.User?.mobile}</div>
                  </td>
                  <td className="py-3 px-5">
                    <div className="text-cyan-400 font-semibold">{reg.Product?.name}</div>
                    <div className="text-zinc-500 text-[10px]">{reg.Product?.kw_capacity} KW</div>
                  </td>
                  <td className="py-3 px-5">
                    <div className="font-semibold">₹{parseFloat(reg.Payment?.amount || 0).toLocaleString('en-IN')}</div>
                    <div className="text-zinc-500 text-[10px]">{reg.Payment?.transaction_id?.substring(0, 16) || 'N/A'}</div>
                  </td>
                  <td className="py-3 px-5"><StatusBadge status={reg.status} /></td>
                  <td className="py-3 px-5 text-center">
                    {reg.Pass
                      ? <span className="text-cyan-400 font-mono text-[10px] bg-cyan-950/30 px-2 py-0.5 rounded border border-cyan-500/20">{reg.Pass.pass_id}</span>
                      : <span className="text-zinc-600 text-[10px]">PENDING</span>}
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="6" className="py-10 text-center text-zinc-600 italic">No matching registrations found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-3 bg-zinc-950/40 border-t border-zinc-800/60 text-[10px] font-mono text-zinc-600 flex justify-between">
          <span>{filtered.length} RECORDS LOADED</span><span>ADMIN SESSION ACTIVE</span>
        </div>
      </motion.div>
    </div>
  );
};

// ─── TAB: Products ──────────────────────────────────────────────────────────────

const ProductsTab = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({ name: '', kw_capacity: '', price: '', availability_status: 'available', specifications: '', benefits: '' });
  const fileRef = useRef(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchProducts = async () => {
    try { setLoading(true); const r = await adminAPI.getAllProducts(); setProducts(r.data); }
    catch { showToast('Failed to load products.', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', kw_capacity: '', price: '', availability_status: 'available', specifications: '', benefits: '' });
    setShowForm(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({
      name: p.name, kw_capacity: p.kw_capacity, price: p.price,
      availability_status: p.availability_status,
      specifications: typeof p.specifications === 'object' ? JSON.stringify(p.specifications, null, 2) : p.specifications || '',
      benefits: Array.isArray(p.benefits) ? p.benefits.join('\n') : p.benefits || ''
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.kw_capacity || !form.price) return showToast('Name, KW capacity and price are required.', 'error');
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'benefits') {
          fd.append(k, JSON.stringify(v.split('\n').filter(Boolean)));
        } else fd.append(k, v);
      });
      if (fileRef.current?.files[0]) fd.append('image', fileRef.current.files[0]);

      if (editing) { await adminAPI.updateProduct(editing.id, fd); showToast('Product updated successfully.'); }
      else { await adminAPI.createProduct(fd); showToast('Product created successfully.'); }
      setShowForm(false); fetchProducts();
    } catch { showToast('Save failed. Please try again.', 'error'); }
    finally { setSaving(false); }
  };

  const handleDelete = (id) => {
    setConfirm({
      msg: 'This will permanently delete this product. Continue?', onOk: async () => {
        setConfirm(null);
        try { await adminAPI.deleteProduct(id); showToast('Product deleted.'); fetchProducts(); }
        catch { showToast('Delete failed.', 'error'); }
      }
    });
  };

  return (
    <div className="space-y-6">
      {confirm && <ConfirmModal message={confirm.msg} onConfirm={confirm.onOk} onCancel={() => setConfirm(null)} />}
      {toast && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className={`fixed top-24 right-6 z-50 px-5 py-3 rounded-xl font-mono text-sm shadow-xl border ${toast.type === 'error' ? 'bg-red-950 border-red-700 text-red-300' : 'bg-emerald-950 border-emerald-700 text-emerald-300'}`}>
          {toast.msg}
        </motion.div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-sm font-bold font-mono text-cyan-400 flex items-center gap-2">
          <Package className="w-4 h-4" /> PRODUCT CATALOGUE MANAGEMENT
        </h2>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-mono text-xs font-bold rounded-lg transition">
          <Plus className="w-3.5 h-3.5" /> ADD PRODUCT
        </button>
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex justify-between items-center mb-5">
                <h3 className="font-bold text-black font-mono tracking-wide">{editing ? 'EDIT PRODUCT' : 'NEW PRODUCT'}</h3>
                <button onClick={() => setShowForm(false)} className="text-zinc-500 hover:text-black transition"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Product Name', key: 'name', placeholder: 'e.g. Quantum Pro 5KW Generator' },
                  { label: 'KW Capacity', key: 'kw_capacity', placeholder: 'e.g. 5', type: 'number' },
                  { label: 'Price (₹)', key: 'price', placeholder: 'e.g. 45000', type: 'number' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="text-zinc-400 font-mono text-[10px] uppercase mb-1 block">{f.label}</label>
                    <input type={f.type || 'text'} value={form[f.key]} placeholder={f.placeholder}
                      onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-black font-mono text-sm focus:border-cyan-500 outline-none" />
                  </div>
                ))}
                <div>
                  <label className="text-zinc-400 font-mono text-[10px] uppercase mb-1 block">Availability</label>
                  <select value={form.availability_status} onChange={e => setForm(p => ({ ...p, availability_status: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-black font-mono text-sm focus:border-cyan-500 outline-none cursor-pointer">
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </div>
                <div>
                  <label className="text-zinc-400 font-mono text-[10px] uppercase mb-1 block">Specifications (JSON)</label>
                  <textarea rows={3} value={form.specifications} placeholder='{"fuel_type":"Diesel","runtime":"8hr"}'
                    onChange={e => setForm(p => ({ ...p, specifications: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-black font-mono text-xs focus:border-cyan-500 outline-none resize-none" />
                </div>
                <div>
                  <label className="text-zinc-400 font-mono text-[10px] uppercase mb-1 block">Benefits (one per line)</label>
                  <textarea rows={3} value={form.benefits} placeholder={"Auto-start\nFuel efficient\nQuiet operation"}
                    onChange={e => setForm(p => ({ ...p, benefits: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-black font-mono text-xs focus:border-cyan-500 outline-none resize-none" />
                </div>
                <div>
                  <label className="text-zinc-400 font-mono text-[10px] uppercase mb-1 block">Product Image</label>
                  <div onClick={() => fileRef.current?.click()}
                    className="border-2 border-dashed border-zinc-700 hover:border-cyan-500 rounded-lg p-4 text-center cursor-pointer transition">
                    <Upload className="w-5 h-5 text-zinc-500 mx-auto mb-1" />
                    <p className="text-zinc-500 font-mono text-xs">Click to upload image</p>
                    <input type="file" ref={fileRef} accept="image/*" className="hidden" />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-zinc-400 hover:bg-zinc-800 transition font-mono text-sm">CANCEL</button>
                <button onClick={handleSave} disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 text-zinc-950 font-mono text-sm font-bold transition flex items-center justify-center gap-2">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? 'SAVING...' : 'SAVE PRODUCT'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-zinc-500 font-mono text-xs">
          <Loader2 className="w-5 h-5 animate-spin mr-2 text-cyan-500" /> LOADING PRODUCTS...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map(p => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="glass-panel border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition group">
              <div className="h-32 bg-gradient-to-br from-zinc-900 to-zinc-950 flex items-center justify-center relative">
                {p.image_url && !p.image_url.includes('placeholder') ? (
                  <img src={p.image_url} alt={p.name} className="h-full w-full object-cover opacity-70 group-hover:opacity-90 transition" />
                ) : (
                  <Zap className="w-12 h-12 text-zinc-700" />
                )}
                <div className="absolute top-2 right-2"><StatusBadge status={p.availability_status} /></div>
                <div className="absolute bottom-2 left-3 font-mono text-3xl font-extrabold text-zinc-800 select-none">{p.kw_capacity}KW</div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-black font-mono text-sm mb-1">{p.name}</h3>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-cyan-400 font-mono text-xs">{p.kw_capacity} KW Capacity</span>
                  <span className="text-emerald-400 font-mono text-sm font-bold">₹{parseFloat(p.price).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(p)}
                    className="flex-1 py-2 rounded-lg border border-zinc-700 hover:border-cyan-500 hover:text-cyan-400 text-zinc-400 transition text-xs font-mono flex items-center justify-center gap-1">
                    <Edit2 className="w-3 h-3" /> EDIT
                  </button>
                  <button onClick={() => handleDelete(p.id)}
                    className="flex-1 py-2 rounded-lg border border-zinc-700 hover:border-red-500 hover:text-red-400 text-zinc-400 transition text-xs font-mono flex items-center justify-center gap-1">
                    <Trash2 className="w-3 h-3" /> DELETE
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          {products.length === 0 && (
            <div className="col-span-3 py-16 text-center text-zinc-600 font-mono text-xs">No products found. Click ADD PRODUCT to create one.</div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── TAB: Users ─────────────────────────────────────────────────────────────────

const UsersTab = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [confirm, setConfirm] = useState(null);
  const [toast, setToast] = useState(null);
  const [viewUser, setViewUser] = useState(null);

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };

  const fetchUsers = async () => {
    try { setLoading(true); const r = await adminAPI.getAllUsers(); setUsers(r.data); }
    catch { showToast('Failed to load users.', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = (id, name) => {
    setConfirm({
      msg: `Permanently delete account for "${name}"? This cannot be undone.`, onOk: async () => {
        setConfirm(null);
        try { await adminAPI.deleteUser(id); showToast('User deleted.'); fetchUsers(); }
        catch { showToast('Delete failed.', 'error'); }
      }
    });
  };

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    return [u.name, u.email, u.mobile].some(v => v?.toLowerCase().includes(q));
  });

  return (
    <div className="space-y-6">
      {confirm && <ConfirmModal message={confirm.msg} onConfirm={confirm.onOk} onCancel={() => setConfirm(null)} />}
      {toast && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className={`fixed top-24 right-6 z-50 px-5 py-3 rounded-xl font-mono text-sm shadow-xl border ${toast.type === 'error' ? 'bg-red-950 border-red-700 text-red-300' : 'bg-emerald-950 border-emerald-700 text-emerald-300'}`}>
          {toast.msg}
        </motion.div>
      )}

      {/* User Detail Modal */}
      <AnimatePresence>
        {viewUser && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <div className="flex justify-between items-center mb-5">
                <h3 className="font-bold text-black font-mono">USER PROFILE</h3>
                <button onClick={() => setViewUser(null)}><X className="w-5 h-5 text-zinc-500 hover:text-black transition" /></button>
              </div>
              <div className="space-y-3">
                {[
                  ['Name', viewUser.name], ['Email', viewUser.email], ['Mobile', viewUser.mobile],
                  ['Address', viewUser.address], ['Role', viewUser.role],
                  ['Joined', new Date(viewUser.createdAt).toLocaleDateString()],
                  ['Total Bookings', viewUser.bookingCount], ['Confirmed', viewUser.confirmedCount]
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between border-b border-zinc-800 pb-2">
                    <span className="text-zinc-500 font-mono text-xs uppercase">{k}</span>
                    <span className="text-black font-mono text-xs font-semibold">{v || '—'}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => setViewUser(null)} className="mt-5 w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-black rounded-xl font-mono text-sm transition">CLOSE</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center">
        <h2 className="text-sm font-bold font-mono text-cyan-400 flex items-center gap-2">
          <Users className="w-4 h-4" /> REGISTERED USER ACCOUNTS
        </h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
          <input type="text" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)}
            className="pl-8 pr-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-black font-mono text-xs focus:border-cyan-500 outline-none" />
        </div>
      </div>

      <div className="glass-panel rounded-xl overflow-hidden border border-zinc-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950/40 text-zinc-500 font-mono text-[10px] uppercase tracking-wider">
                <th className="py-3 px-5">#</th>
                <th className="py-3 px-5">Name / Email</th>
                <th className="py-3 px-5">Mobile</th>
                <th className="py-3 px-5">Bookings</th>
                <th className="py-3 px-5">Joined</th>
                <th className="py-3 px-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900 font-mono text-xs text-zinc-300">
              {loading ? (
                <tr><td colSpan="6" className="py-10 text-center text-zinc-500">
                  <Loader2 className="w-5 h-5 animate-spin mx-auto text-cyan-500" />
                </td></tr>
              ) : filtered.length > 0 ? filtered.map((u, i) => (
                <tr key={u.id} className="hover:bg-zinc-950/30 transition">
                  <td className="py-3 px-5 text-zinc-600">{i + 1}</td>
                  <td className="py-3 px-5">
                    <div className="font-semibold text-black">{u.name}</div>
                    <div className="text-zinc-500 text-[10px]">{u.email}</div>
                  </td>
                  <td className="py-3 px-5 text-zinc-400">{u.mobile}</td>
                  <td className="py-3 px-5">
                    <span className="text-black font-semibold">{u.bookingCount}</span>
                    <span className="text-zinc-600"> total / </span>
                    <span className="text-emerald-400">{u.confirmedCount}</span>
                    <span className="text-zinc-600"> confirmed</span>
                  </td>
                  <td className="py-3 px-5 text-zinc-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 px-5">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => setViewUser(u)}
                        className="p-1.5 rounded-lg border border-zinc-700 hover:border-cyan-500 hover:text-cyan-400 text-zinc-500 transition" title="View Profile">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(u.id, u.name)}
                        className="p-1.5 rounded-lg border border-zinc-700 hover:border-red-500 hover:text-red-400 text-zinc-500 transition" title="Delete User">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="6" className="py-10 text-center text-zinc-600 italic">No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-3 bg-zinc-950/40 border-t border-zinc-800/60 text-[10px] font-mono text-zinc-600 flex justify-between">
          <span>{filtered.length} ACCOUNTS</span><span>ADMIN SECURE VIEW</span>
        </div>
      </div>
    </div>
  );
};

// ─── TAB: Payments ──────────────────────────────────────────────────────────────

const PaymentsTab = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [confirm, setConfirm] = useState(null);
  const [toast, setToast] = useState(null);
  const [statusModal, setStatusModal] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [saving, setSaving] = useState(false);

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };

  const fetchPayments = async () => {
    try { setLoading(true); const r = await adminAPI.getAllPayments(); setPayments(r.data); }
    catch { showToast('Failed to load payments.', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPayments(); }, []);

  const openStatusModal = (payment) => {
    setStatusModal(payment);
    setNewStatus(payment.status);
  };

  const handleStatusUpdate = async () => {
    setSaving(true);
    try {
      await adminAPI.updatePaymentStatus(statusModal.id, { status: newStatus });
      showToast(`Payment status updated to "${newStatus}".`);
      setStatusModal(null);
      fetchPayments();
    } catch { showToast('Status update failed.', 'error'); }
    finally { setSaving(false); }
  };

  const handleCancelReg = (regId) => {
    setConfirm({
      msg: 'Cancel this registration and mark payment as refunded?', onOk: async () => {
        setConfirm(null);
        try { await adminAPI.cancelRegistration(regId); showToast('Registration cancelled, payment refunded.'); fetchPayments(); }
        catch { showToast('Operation failed.', 'error'); }
      }
    });
  };

  const filtered = payments.filter(p => {
    const q = search.toLowerCase();
    const reg = p.Registration;
    const match = [reg?.User?.name, reg?.User?.email, reg?.booking_id, p.order_id, p.transaction_id]
      .some(v => v?.toLowerCase().includes(q));
    const statusOk = statusFilter === 'all' || p.status === statusFilter;
    return match && statusOk;
  });

  const totalCaptured = payments.filter(p => p.status === 'captured').reduce((a, p) => a + parseFloat(p.amount || 0), 0);
  const totalPending = payments.filter(p => p.status === 'pending').length;
  const totalFailed = payments.filter(p => ['failed', 'refunded'].includes(p.status)).length;

  return (
    <div className="space-y-6">
      {confirm && <ConfirmModal message={confirm.msg} onConfirm={confirm.onOk} onCancel={() => setConfirm(null)} />}
      {toast && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className={`fixed top-24 right-6 z-50 px-5 py-3 rounded-xl font-mono text-sm shadow-xl border ${toast.type === 'error' ? 'bg-red-950 border-red-700 text-red-300' : 'bg-emerald-950 border-emerald-700 text-emerald-300'}`}>
          {toast.msg}
        </motion.div>
      )}

      {/* Status Update Modal */}
      <AnimatePresence>
        {statusModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-black font-mono">UPDATE PAYMENT STATUS</h3>
                <button onClick={() => setStatusModal(null)}><X className="w-5 h-5 text-zinc-500 hover:text-black transition" /></button>
              </div>
              <div className="mb-4 p-3 bg-zinc-950 rounded-lg border border-zinc-800 font-mono text-xs space-y-1">
                <div><span className="text-zinc-500">Booking: </span><span className="text-black">{statusModal.Registration?.booking_id}</span></div>
                <div><span className="text-zinc-500">Guest: </span><span className="text-cyan-400">{statusModal.Registration?.User?.name}</span></div>
                <div><span className="text-zinc-500">Amount: </span><span className="text-emerald-400 font-bold">₹{parseFloat(statusModal.amount).toLocaleString('en-IN')}</span></div>
                <div><span className="text-zinc-500">Current: </span><StatusBadge status={statusModal.status} /></div>
              </div>
              <label className="text-zinc-400 font-mono text-[10px] uppercase mb-1 block">New Status</label>
              <select value={newStatus} onChange={e => setNewStatus(e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-black font-mono text-sm focus:border-cyan-500 outline-none mb-5 cursor-pointer">
                <option value="pending">Pending</option>
                <option value="captured">Captured (Confirm)</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
              <div className="flex gap-3">
                <button onClick={() => setStatusModal(null)} className="flex-1 py-2.5 border border-zinc-700 text-zinc-400 hover:bg-zinc-800 rounded-xl font-mono text-sm transition">CANCEL</button>
                <button onClick={handleStatusUpdate} disabled={saving}
                  className="flex-1 py-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 text-zinc-950 font-bold rounded-xl font-mono text-sm transition flex items-center justify-center gap-2">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCheck className="w-4 h-4" />}
                  {saving ? 'SAVING...' : 'UPDATE'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          { label: 'TOTAL CAPTURED', value: `₹${totalCaptured.toLocaleString('en-IN')}`, icon: CheckCheck, color: 'emerald' },
          { label: 'PENDING REVIEW', value: totalPending, icon: Clock, color: 'amber' },
          { label: 'FAILED / REFUNDED', value: totalFailed, icon: Ban, color: 'red' },
        ].map((c, i) => {
          const cm = { emerald: 'text-emerald-400 border-emerald-500/20', amber: 'text-amber-400 border-amber-500/20', red: 'text-red-400 border-red-500/20' };
          const [tc, bc] = cm[c.color].split(' ');
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className={`glass-panel p-5 rounded-xl border ${bc} flex justify-between items-center`}>
              <div>
                <span className="text-zinc-500 font-mono text-[10px] uppercase block mb-1">{c.label}</span>
                <span className={`text-xl font-bold font-mono ${tc}`}>{c.value}</span>
              </div>
              <c.icon className={`w-6 h-6 ${tc} opacity-60`} />
            </motion.div>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-sm font-bold font-mono text-cyan-400 flex items-center gap-2">
          <CreditCard className="w-4 h-4" /> PAYMENT TRANSACTION LEDGER
        </h2>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
            <input type="text" placeholder="Search payments..." value={search} onChange={e => setSearch(e.target.value)}
              className="pl-8 pr-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-black font-mono text-xs focus:border-cyan-500 outline-none" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-black font-mono text-xs focus:border-cyan-500 outline-none cursor-pointer">
            <option value="all">ALL</option>
            <option value="captured">CAPTURED</option>
            <option value="pending">PENDING</option>
            <option value="failed">FAILED</option>
            <option value="refunded">REFUNDED</option>
          </select>
        </div>
      </div>

      <div className="glass-panel rounded-xl overflow-hidden border border-zinc-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950/40 text-zinc-500 font-mono text-[10px] uppercase tracking-wider">
                <th className="py-3 px-5">Booking</th>
                <th className="py-3 px-5">Guest</th>
                <th className="py-3 px-5">Product</th>
                <th className="py-3 px-5">Amount</th>
                <th className="py-3 px-5">Order ID</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900 font-mono text-xs text-zinc-300">
              {loading ? (
                <tr><td colSpan="7" className="py-10 text-center">
                  <Loader2 className="w-5 h-5 animate-spin mx-auto text-cyan-500" />
                </td></tr>
              ) : filtered.length > 0 ? filtered.map((p, i) => (
                <tr key={p.id} className="hover:bg-zinc-950/30 transition">
                  <td className="py-3 px-5 text-black font-semibold">{p.Registration?.booking_id || '—'}</td>
                  <td className="py-3 px-5">
                    <div className="text-black font-semibold">{p.Registration?.User?.name || '—'}</div>
                    <div className="text-zinc-500 text-[10px]">{p.Registration?.User?.email}</div>
                  </td>
                  <td className="py-3 px-5">
                    <div className="text-cyan-400">{p.Registration?.Product?.name || '—'}</div>
                    <div className="text-zinc-600 text-[10px]">{p.Registration?.Product?.kw_capacity} KW</div>
                  </td>
                  <td className="py-3 px-5 text-emerald-400 font-bold">₹{parseFloat(p.amount || 0).toLocaleString('en-IN')}</td>
                  <td className="py-3 px-5">
                    <div className="text-zinc-400 text-[10px]">{p.order_id?.substring(0, 20) || '—'}</div>
                    {p.transaction_id && <div className="text-zinc-600 text-[10px]">{p.transaction_id?.substring(0, 20)}</div>}
                  </td>
                  <td className="py-3 px-5"><StatusBadge status={p.status} /></td>
                  <td className="py-3 px-5">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => openStatusModal(p)}
                        className="p-1.5 rounded-lg border border-zinc-700 hover:border-cyan-500 hover:text-cyan-400 text-zinc-500 transition" title="Override Status">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {p.Registration && p.Registration.status !== 'cancelled' && (
                        <button onClick={() => handleCancelReg(p.Registration.id)}
                          className="p-1.5 rounded-lg border border-zinc-700 hover:border-red-500 hover:text-red-400 text-zinc-500 transition" title="Cancel Registration">
                          <Ban className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="7" className="py-10 text-center text-zinc-600 italic">No payments found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-3 bg-zinc-950/40 border-t border-zinc-800/60 text-[10px] font-mono text-zinc-600 flex justify-between">
          <span>{filtered.length} TRANSACTIONS</span><span>FINANCIAL RECORDS ENCRYPTED</span>
        </div>
      </div>
    </div>
  );
};

// ─── Main AdminDashboard ────────────────────────────────────────────────────────

const TABS = [
  { key: 'overview', label: 'OVERVIEW', icon: BarChart3 },
  { key: 'products', label: 'PRODUCTS', icon: Package },
  { key: 'users', label: 'USERS', icon: Users },
  { key: 'payments', label: 'PAYMENTS', icon: CreditCard },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [analytics, setAnalytics] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchOverview = async (silent = false) => {
    if (!silent) setLoading(true); else setRefreshing(true);
    try {
      setError('');
      const [ar, rr] = await Promise.all([adminAPI.getAnalytics(), adminAPI.getRegistrations()]);
      setAnalytics(ar.data);
      setRegistrations(rr.data);
    } catch (err) {
      setError('Failed to fetch secure analytics. Check backend connection.');
    } finally {
      setLoading(false); setRefreshing(false);
    }
  };

  useEffect(() => { fetchOverview(); }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-black relative pt-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-t-cyan-400 border-r-cyan-400/30 border-b-cyan-400/10 border-l-cyan-400/50 rounded-full animate-spin" />
          <p className="font-mono text-cyan-400 animate-pulse tracking-widest uppercase text-sm">Synchronizing Admin Command Center...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-wider text-black">
              COMMAND CTR
            </h1>
            <p className="text-zinc-600 font-mono text-xs mt-1">SECURE LAUNCH EVENT COORDINATION TERMINAL • V3.026</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => fetchOverview(true)} disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 font-mono text-xs border border-zinc-700 bg-zinc-900/80 hover:bg-zinc-800 rounded-lg transition disabled:opacity-50">
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'SYNCING...' : 'FORCE RE-SYNC'}
            </button>
            <Link to="/admin/scanner"
              className="flex items-center gap-2 px-5 py-2 font-mono text-xs font-bold rounded-lg bg-gradient-to-r from-cyan-500 to-sky-500 text-zinc-950 hover:brightness-110 transition">
              <QrCode className="w-4 h-4" /> GATE SCANNER
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl border border-red-500/30 bg-red-500/5 text-red-400 flex items-center gap-3 font-mono text-sm">
            <ShieldAlert className="w-5 h-5 flex-shrink-0" />{error}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-1 mb-8 bg-zinc-950/60 border border-zinc-800 rounded-xl p-1.5 w-fit">
          {TABS.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-mono text-xs font-semibold tracking-wider transition-all duration-200 ${activeTab === tab.key
                ? 'bg-cyan-500 text-zinc-950 shadow-lg shadow-cyan-500/20'
                : 'text-zinc-500 hover:text-black hover:bg-zinc-800'
                }`}>
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
            {activeTab === 'overview' && (
              <OverviewTab analytics={analytics} registrations={registrations} onRefresh={() => fetchOverview(true)} refreshing={refreshing} />
            )}
            {activeTab === 'products' && <ProductsTab />}
            {activeTab === 'users' && <UsersTab />}
            {activeTab === 'payments' && <PaymentsTab />}
          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
};

export default AdminDashboard;

