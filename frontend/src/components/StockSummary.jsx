import { useEffect, useState } from "react";
import api from "../api";
import { Search, Package, DollarSign, AlertTriangle, BarChart3, Layers, Sparkles } from "lucide-react";

export default function StockSummary() {
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("itemName");
  const [sortOrder, setSortOrder] = useState("asc");

  const fetchSummary = async () => {
    try { const res = await api.get("/stock/summary"); setSummary(res.data); } catch (err) { console.log(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchSummary(); }, []);

  const getStockStatus = (quantity) => {
    if (quantity === 0) return { label: "Out of Stock", color: "text-red-400", bg: "bg-red-500/20", border: "border-red-500/30" };
    if (quantity < 10) return { label: "Low Stock", color: "text-amber-400", bg: "bg-amber-500/20", border: "border-amber-500/30" };
    if (quantity < 50) return { label: "Moderate", color: "text-blue-400", bg: "bg-blue-500/20", border: "border-blue-500/30" };
    return { label: "Adequate", color: "text-green-400", bg: "bg-green-500/20", border: "border-green-500/30" };
  };

  const handleSort = (field) => { if (sortBy === field) setSortOrder(sortOrder === "asc" ? "desc" : "asc"); else { setSortBy(field); setSortOrder("asc"); } };

  const filteredSummary = summary.filter(item => item.ItemName.toLowerCase().includes(searchTerm.toLowerCase())).sort((a, b) => {
    if (sortBy === "itemName") return sortOrder === "asc" ? a.ItemName.localeCompare(b.ItemName) : b.ItemName.localeCompare(a.ItemName);
    if (sortBy === "quantity") return sortOrder === "asc" ? a.CurrentQuantity - b.CurrentQuantity : b.CurrentQuantity - a.CurrentQuantity;
    if (sortBy === "value") return sortOrder === "asc" ? a.ValueInStock - b.ValueInStock : b.ValueInStock - a.ValueInStock;
    if (sortBy === "unitPrice") return sortOrder === "asc" ? a.UnitPrice - b.UnitPrice : b.UnitPrice - a.UnitPrice;
    return 0;
  });

  const totalValue = summary.reduce((sum, item) => sum + item.ValueInStock, 0);
  const totalItems = summary.reduce((sum, item) => sum + item.CurrentQuantity, 0);
  const totalProducts = summary.length;
  const lowStockCount = summary.filter(item => item.CurrentQuantity < 10 && item.CurrentQuantity > 0).length;
  const outOfStockCount = summary.filter(item => item.CurrentQuantity === 0).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div><div className="flex items-center gap-3 mb-2"><div className="w-1 h-10 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div><h1 className="text-4xl font-bold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">Stock Summary</h1><Sparkles className="text-purple-400" size={24} /></div><p className="text-white/60 pl-4">Current inventory status</p><div className="w-full h-px bg-gradient-to-r from-white/20 to-transparent mt-4"></div></div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6"><div className="flex items-center justify-between mb-3"><div className="p-2 bg-blue-500/20 rounded-xl"><Layers className="text-blue-400" size={22} /></div><span className="text-2xl font-bold text-white">{totalProducts}</span></div><p className="text-white/50 text-xs font-medium uppercase tracking-wider">Total Products</p></div>
        <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6"><div className="flex items-center justify-between mb-3"><div className="p-2 bg-emerald-500/20 rounded-xl"><Package className="text-emerald-400" size={22} /></div><span className="text-2xl font-bold text-white">{totalItems.toLocaleString()}</span></div><p className="text-white/50 text-xs font-medium uppercase tracking-wider">Total Quantity</p></div>
        <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6"><div className="flex items-center justify-between mb-3"><div className="p-2 bg-amber-500/20 rounded-xl"><DollarSign className="text-amber-400" size={22} /></div><span className="text-xl font-bold text-white">RWF {totalValue.toLocaleString()}</span></div><p className="text-white/50 text-xs font-medium uppercase tracking-wider">Total Value</p></div>
        <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6"><div className="flex items-center justify-between mb-3"><div className="p-2 bg-red-500/20 rounded-xl"><AlertTriangle className="text-red-400" size={22} /></div><span className="text-2xl font-bold text-white">{lowStockCount + outOfStockCount}</span></div><p className="text-white/50 text-xs font-medium uppercase tracking-wider">Low/Out of Stock</p></div>
      </div>

      {/* Stock Distribution */}
      <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6"><h3 className="font-semibold text-white mb-4 flex items-center gap-2"><BarChart3 size={18} /> Stock Distribution</h3><div className="space-y-3"><div><div className="flex justify-between text-sm mb-1"><span className="text-green-400">Adequate (≥50)</span><span className="text-white">{summary.filter(i => i.CurrentQuantity >= 50).length}</span></div><div className="h-2 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-green-500 rounded-full" style={{ width: `${(summary.filter(i => i.CurrentQuantity >= 50).length / totalProducts) * 100}%` }}></div></div></div><div><div className="flex justify-between text-sm mb-1"><span className="text-blue-400">Moderate (10-49)</span><span className="text-white">{summary.filter(i => i.CurrentQuantity >= 10 && i.CurrentQuantity < 50).length}</span></div><div className="h-2 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-blue-500 rounded-full" style={{ width: `${(summary.filter(i => i.CurrentQuantity >= 10 && i.CurrentQuantity < 50).length / totalProducts) * 100}%` }}></div></div></div><div><div className="flex justify-between text-sm mb-1"><span className="text-amber-400">Low Stock (1-9)</span><span className="text-white">{lowStockCount}</span></div><div className="h-2 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-amber-500 rounded-full" style={{ width: `${(lowStockCount / totalProducts) * 100}%` }}></div></div></div><div><div className="flex justify-between text-sm mb-1"><span className="text-red-400">Out of Stock (0)</span><span className="text-white">{outOfStockCount}</span></div><div className="h-2 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-red-500 rounded-full" style={{ width: `${(outOfStockCount / totalProducts) * 100}%` }}></div></div></div></div></div>

      {/* Search */}
      <div className="relative"><Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40" size={18} /><input type="text" placeholder="Search by item name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-white placeholder-white/40 focus:border-purple-500 outline-none transition-all" /></div>

      {/* Stock Table */}
      {loading ? (<div className="flex justify-center py-20"><div className="w-12 h-12 border-3 border-purple-500 border-t-transparent rounded-full animate-spin"></div></div>) : (
        <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto"><table className="w-full text-left"><thead className="bg-white/10"><tr><th className="p-4 cursor-pointer text-white/70 text-xs uppercase tracking-wider" onClick={() => handleSort("itemName")}>Item Name {sortBy === "itemName" && (sortOrder === "asc" ? "↑" : "↓")}</th><th className="p-4 text-white/70 text-xs uppercase tracking-wider">Specification</th><th className="p-4 text-white/70 text-xs uppercase tracking-wider">Unit</th><th className="p-4 cursor-pointer text-white/70 text-xs uppercase tracking-wider" onClick={() => handleSort("unitPrice")}>Unit Price {sortBy === "unitPrice" && (sortOrder === "asc" ? "↑" : "↓")}</th><th className="p-4 cursor-pointer text-white/70 text-xs uppercase tracking-wider" onClick={() => handleSort("quantity")}>Quantity {sortBy === "quantity" && (sortOrder === "asc" ? "↑" : "↓")}</th><th className="p-4 cursor-pointer text-white/70 text-xs uppercase tracking-wider" onClick={() => handleSort("value")}>Value {sortBy === "value" && (sortOrder === "asc" ? "↑" : "↓")}</th><th className="p-4 text-white/70 text-xs uppercase tracking-wider">Status</th></tr></thead>
            <tbody>{filteredSummary.length === 0 ? (<tr><td colSpan="7" className="p-8 text-center text-white/40">No items found</td></tr>) : (filteredSummary.map((item, idx) => { const status = getStockStatus(item.CurrentQuantity); return (<tr key={idx} className="border-t border-white/10 hover:bg-white/5 transition-colors"><td className="p-4 font-medium text-white">{item.ItemName}</td><td className="p-4 text-white/60 text-sm">{item.Specification || "-"}</td><td className="p-4 text-white/60 text-sm">{item.UnitMeasure || "-"}</td><td className="p-4 text-white/70">RWF {item.UnitPrice.toLocaleString()}</td><td className="p-4"><span className={`font-semibold ${item.CurrentQuantity < 10 ? 'text-amber-400' : 'text-white'}`}>{item.CurrentQuantity}</span></td><td className="p-4 text-emerald-400 font-semibold">RWF {item.ValueInStock.toLocaleString()}</td><td className="p-4"><span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color} border ${status.border}`}>{status.label}</span></td></tr>); }))}</tbody>
          </table>
        </div>
        </div>
      )}
    </div>
  );
}