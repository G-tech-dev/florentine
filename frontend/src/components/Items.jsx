import { useEffect, useState } from "react";
import api from "../api";
import { Plus, Edit, Trash2, Search, X, Package, Sparkles } from "lucide-react";

export default function Items() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    ItemName: "", Specification: "", UnitMeasure: "", Quantity: 0, UnitPrice: 0, TotalQuantity: 0
  });

  const fetchItems = async () => {
    try { const res = await api.get("/items"); setItems(res.data); } catch (err) { console.log(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) await api.put(`/items/${editingItem._id}`, formData);
      else await api.post("/items", formData);
      fetchItems(); setShowModal(false); resetForm();
    } catch (err) { alert(err.response?.data?.msg || "Error saving item"); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try { await api.delete(`/items/${id}`); fetchItems(); } catch (err) { alert("Error deleting item"); }
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({ ItemName: item.ItemName, Specification: item.Specification || "", UnitMeasure: item.UnitMeasure || "", Quantity: item.Quantity, UnitPrice: item.UnitPrice, TotalQuantity: item.TotalQuantity });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({ ItemName: "", Specification: "", UnitMeasure: "", Quantity: 0, UnitPrice: 0, TotalQuantity: 0 });
  };

  const filteredItems = items.filter(item => item.ItemName.toLowerCase().includes(searchTerm.toLowerCase()) || item.Specification?.toLowerCase().includes(searchTerm.toLowerCase()));
  const totalItems = items.length;
  const totalValue = items.reduce((sum, item) => sum + (item.Quantity * item.UnitPrice), 0);
  const lowStockCount = items.filter(item => item.Quantity < 10).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-1 h-10 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-emerald-300 bg-clip-text text-transparent">Inventory</h1>
          <Sparkles className="text-emerald-400" size={24} />
        </div>
        <p className="text-white/60 pl-4">Manage your product inventory</p>
        <div className="w-full h-px bg-gradient-to-r from-white/20 to-transparent mt-4"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6"><div className="flex items-center justify-between mb-3"><div className="p-2 bg-blue-500/20 rounded-xl"><Package className="text-blue-400" size={22} /></div><span className="text-2xl font-bold text-white">{totalItems}</span></div><p className="text-white/50 text-xs font-medium uppercase tracking-wider">Total Products</p></div>
        <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6"><div className="flex items-center justify-between mb-3"><div className="p-2 bg-emerald-500/20 rounded-xl"><Package className="text-emerald-400" size={22} /></div><span className="text-xl font-bold text-white">RWF {totalValue.toLocaleString()}</span></div><p className="text-white/50 text-xs font-medium uppercase tracking-wider">Total Value</p></div>
        <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6"><div className="flex items-center justify-between mb-3"><div className="p-2 bg-amber-500/20 rounded-xl"><Package className="text-amber-400" size={22} /></div><span className="text-2xl font-bold text-white">{lowStockCount}</span></div><p className="text-white/50 text-xs font-medium uppercase tracking-wider">Low Stock Items</p></div>
      </div>

      {/* Search and Add */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex-1 relative"><Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40" size={18} /><input type="text" placeholder="Search items..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-white placeholder-white/40 focus:border-emerald-500 outline-none transition-all" /></div>
        <button onClick={() => { resetForm(); setShowModal(true); }} className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold flex items-center gap-2 transition-all duration-300 transform hover:scale-105"><Plus size={18} /> Add Item</button>
      </div>

      {/* Items Table */}
      {loading ? (<div className="flex justify-center py-20"><div className="w-12 h-12 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></div></div>) : (
        <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/10"><tr><th className="p-4 text-white/70 text-xs uppercase tracking-wider">Item Name</th><th className="p-4 text-white/70 text-xs uppercase tracking-wider">Spec</th><th className="p-4 text-white/70 text-xs uppercase tracking-wider">Unit</th><th className="p-4 text-white/70 text-xs uppercase tracking-wider">Qty</th><th className="p-4 text-white/70 text-xs uppercase tracking-wider">Price</th><th className="p-4 text-white/70 text-xs uppercase tracking-wider">Value</th><th className="p-4 text-white/70 text-xs uppercase tracking-wider">Actions</th></tr></thead>
              <tbody>{filteredItems.length === 0 ? (<tr><td colSpan="7" className="p-8 text-center text-white/40">No items found</td></tr>) : (filteredItems.map((item) => (<tr key={item._id} className="border-t border-white/10 hover:bg-white/5 transition-colors"><td className="p-4 font-medium text-white">{item.ItemName}</td><td className="p-4 text-white/60 text-sm">{item.Specification || "-"}</td><td className="p-4 text-white/60 text-sm">{item.UnitMeasure || "-"}</td><td className="p-4"><span className={`font-semibold ${item.Quantity < 10 ? 'text-amber-400' : 'text-white'}`}>{item.Quantity}</span></td><td className="p-4 text-white/70">RWF {item.UnitPrice.toLocaleString()}</td><td className="p-4 text-emerald-400 font-semibold">RWF {(item.Quantity * item.UnitPrice).toLocaleString()}</td><td className="p-4"><div className="flex gap-2"><button onClick={() => handleEdit(item)} className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"><Edit size={16} /></button><button onClick={() => handleDelete(item._id)} className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"><Trash2 size={16} /></button></div></td></tr>)))}</tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 w-full max-w-md">
            <div className="p-6 border-b border-white/10 flex justify-between items-center"><h2 className="text-2xl font-bold text-white">{editingItem ? "Edit Item" : "Add Item"}</h2><button onClick={() => { setShowModal(false); resetForm(); }} className="text-white/60 hover:text-white"><X size={22} /></button></div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <input type="text" placeholder="Item Name" value={formData.ItemName} onChange={(e) => setFormData({ ...formData, ItemName: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-emerald-500 outline-none" required />
              <input type="text" placeholder="Specification" value={formData.Specification} onChange={(e) => setFormData({ ...formData, Specification: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-emerald-500 outline-none" />
              <input type="text" placeholder="Unit Measure (pcs, kg, m)" value={formData.UnitMeasure} onChange={(e) => setFormData({ ...formData, UnitMeasure: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-emerald-500 outline-none" />
              <div className="grid grid-cols-2 gap-4"><input type="number" placeholder="Quantity" value={formData.Quantity} onChange={(e) => setFormData({ ...formData, Quantity: parseInt(e.target.value) || 0 })} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-emerald-500 outline-none" /><input type="number" placeholder="Unit Price (RWF)" value={formData.UnitPrice} onChange={(e) => setFormData({ ...formData, UnitPrice: parseInt(e.target.value) || 0 })} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-emerald-500 outline-none" required /></div>
              <div className="flex gap-3 pt-4"><button type="submit" className="flex-1 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold">{editingItem ? "Update" : "Save"}</button><button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="flex-1 py-2 rounded-lg bg-white/10 text-white font-semibold hover:bg-white/20">Cancel</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}