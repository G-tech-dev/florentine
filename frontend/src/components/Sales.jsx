import { useEffect, useState } from "react";
import api from "../api";
import { Plus, Trash2, ShoppingCart, X, User, Package, DollarSign, Receipt, Minus, Plus as PlusIcon, Calendar, TrendingUp, Sparkles } from "lucide-react";

export default function Sales() {
  const [sales, setSales] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [quantity, setQuantity] = useState(1);

  const fetchData = async () => {
    try {
      const [salesRes, itemsRes] = await Promise.all([
        api.get("/sales"),
        api.get("/items")
      ]);
      setSales(salesRes.data);
      setItems(itemsRes.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addToCart = () => {
    if (!selectedItem || quantity <= 0) return;
    
    const item = items.find(i => i._id === selectedItem);
    if (!item) return;
    
    if (quantity > item.Quantity) {
      alert(`Insufficient stock! Available: ${item.Quantity}`);
      return;
    }
    
    const existingItem = cart.find(c => c.item_id === selectedItem);
    if (existingItem) {
      if (existingItem.QuantitySold + quantity > item.Quantity) {
        alert(`Insufficient stock! Available: ${item.Quantity}`);
        return;
      }
      setCart(cart.map(c => 
        c.item_id === selectedItem 
          ? { ...c, QuantitySold: c.QuantitySold + quantity, SubTotalPrice: (c.QuantitySold + quantity) * item.UnitPrice }
          : c
      ));
    } else {
      setCart([...cart, {
        item_id: item._id,
        ItemName: item.ItemName,
        QuantitySold: quantity,
        UnitPrice: item.UnitPrice,
        SubTotalPrice: quantity * item.UnitPrice
      }]);
    }
    
    setSelectedItem("");
    setQuantity(1);
  };

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return;
    const item = cart[index];
    const originalItem = items.find(i => i._id === item.item_id);
    if (newQuantity > originalItem.Quantity) {
      alert(`Insufficient stock! Available: ${originalItem.Quantity}`);
      return;
    }
    const newCart = [...cart];
    newCart[index].QuantitySold = newQuantity;
    newCart[index].SubTotalPrice = newQuantity * newCart[index].UnitPrice;
    setCart(newCart);
  };

  const handleSubmitSale = async () => {
    if (!customerName.trim()) {
      alert("Please enter customer name");
      return;
    }
    if (cart.length === 0) {
      alert("Please add items to the sale");
      return;
    }
    
    try {
      await api.post("/sales", {
        CustomerName: customerName,
        items: cart.map(item => ({
          item_id: item.item_id,
          QuantitySold: item.QuantitySold
        }))
      });
      
      setShowModal(false);
      setCart([]);
      setCustomerName("");
      fetchData();
      alert("Sale completed successfully!");
    } catch (err) {
      alert(err.response?.data?.msg || "Error processing sale");
    }
  };

  const viewSaleDetails = async (saleId) => {
    try {
      const res = await api.get(`/sales/${saleId}`);
      setSelectedSale(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.SubTotalPrice, 0);
  const todaySales = sales.filter(sale => new Date(sale.SaleDate).toDateString() === new Date().toDateString());
  const todayRevenue = todaySales.reduce((sum, sale) => sum + sale.TotalPrice, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-1 h-10 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full"></div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-amber-300 bg-clip-text text-transparent">Sales</h1>
          <Sparkles className="text-amber-400" size={24} />
        </div>
        <p className="text-white/60 pl-4">Record and manage sales transactions</p>
        <div className="w-full h-px bg-gradient-to-r from-white/20 to-transparent mt-4"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-emerald-500/20 rounded-xl"><ShoppingCart className="text-emerald-400" size={22} /></div>
            <span className="text-2xl font-bold text-white">{todaySales.length}</span>
          </div>
          <p className="text-white/50 text-xs font-medium uppercase tracking-wider">Today's Sales</p>
        </div>
        
        <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-blue-500/20 rounded-xl"><DollarSign className="text-blue-400" size={22} /></div>
            <span className="text-xl font-bold text-white">RWF {todayRevenue.toLocaleString()}</span>
          </div>
          <p className="text-white/50 text-xs font-medium uppercase tracking-wider">Today's Revenue</p>
        </div>
        
        <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-purple-500/20 rounded-xl"><Receipt className="text-purple-400" size={22} /></div>
            <span className="text-2xl font-bold text-white">{sales.length}</span>
          </div>
          <p className="text-white/50 text-xs font-medium uppercase tracking-wider">Total Sales</p>
        </div>
        
        <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-amber-500/20 rounded-xl"><TrendingUp className="text-amber-400" size={22} /></div>
            <span className="text-xl font-bold text-white">RWF {sales.reduce((sum, sale) => sum + sale.TotalPrice, 0).toLocaleString()}</span>
          </div>
          <p className="text-white/50 text-xs font-medium uppercase tracking-wider">Total Revenue</p>
        </div>
      </div>

      {/* New Sale Button */}
      <div className="flex justify-end">
        <button onClick={() => setShowModal(true)} className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold flex items-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-lg">
          <Plus size={18} /> New Sale
        </button>
      </div>

      {/* Sales Table */}
      {loading ? (
        <div className="flex justify-center py-20"><div className="w-12 h-12 border-3 border-amber-500 border-t-transparent rounded-full animate-spin"></div></div>
      ) : (
        <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/10">
                <tr><th className="p-4 text-white/70 text-xs font-medium uppercase tracking-wider">Invoice</th><th className="p-4 text-white/70 text-xs font-medium uppercase tracking-wider">Date</th><th className="p-4 text-white/70 text-xs font-medium uppercase tracking-wider">Customer</th><th className="p-4 text-white/70 text-xs font-medium uppercase tracking-wider">Total</th><th className="p-4 text-white/70 text-xs font-medium uppercase tracking-wider">Recorded By</th><th className="p-4 text-white/70 text-xs font-medium uppercase tracking-wider">Action</th></tr>
              </thead>
              <tbody>
                {sales.length === 0 ? (<tr><td colSpan="6" className="p-8 text-center text-white/40">No sales recorded</td></tr>) : (
                  sales.map((sale, index) => (
                    <tr key={sale._id} className="border-t border-white/10 hover:bg-white/5 transition-colors">
                      <td className="p-4 font-mono text-sm font-bold text-amber-400">#{(index + 1).toString().padStart(4, '0')}</td>
                      <td className="p-4 text-white/70 text-sm">{new Date(sale.SaleDate).toLocaleDateString()}</td>
                      <td className="p-4 font-medium text-white">{sale.CustomerName}</td>
                      <td className="p-4 font-semibold text-emerald-400">RWF {sale.TotalPrice.toLocaleString()}</td>
                      <td className="p-4 text-white/60 text-sm">{sale.user_id?.UserName || "-"}</td>
                      <td className="p-4"><button onClick={() => viewSaleDetails(sale._id)} className="px-3 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 text-sm font-medium hover:bg-indigo-500/30 transition-colors">View Details</button></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sale Details Modal */}
      {selectedSale && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white/10 p-6 border-b border-white/10 flex justify-between items-center">
              <div className="flex items-center gap-3"><Receipt className="text-amber-400" size={22} /><h2 className="text-2xl font-bold text-white">Sale Details</h2></div>
              <button onClick={() => setSelectedSale(null)} className="text-white/60 hover:text-white"><X size={22} /></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="rounded-xl bg-white/5 p-5"><div className="grid grid-cols-2 gap-4"><div><p className="text-white/50 text-xs">Invoice</p><p className="text-white font-mono">#INV-{selectedSale.sale._id.slice(-6)}</p></div><div><p className="text-white/50 text-xs">Date</p><p className="text-white">{new Date(selectedSale.sale.SaleDate).toLocaleString()}</p></div><div><p className="text-white/50 text-xs">Customer</p><p className="text-white font-semibold">{selectedSale.sale.CustomerName}</p></div><div><p className="text-white/50 text-xs">Recorded By</p><p className="text-white/70">{selectedSale.sale.user_id?.UserName || "System"}</p></div></div></div>
              <h3 className="font-semibold text-white mb-3">Items Sold</h3>
              <div className="overflow-x-auto"><table className="w-full text-left"><thead className="bg-white/5"><tr><th className="p-3 text-white/60 text-sm">Item</th><th className="p-3 text-white/60 text-sm">Quantity</th><th className="p-3 text-white/60 text-sm">Unit Price</th><th className="p-3 text-white/60 text-sm">Subtotal</th></tr></thead><tbody>{selectedSale.details.map((detail, idx) => (<tr key={idx} className="border-t border-white/10"><td className="p-3 text-white">{detail.ItemName}</td><td className="p-3 text-white/70">{detail.QuantitySold}</td><td className="p-3 text-white/70">RWF {detail.UnitPriceAtSale.toLocaleString()}</td><td className="p-3 text-emerald-400 font-semibold">RWF {detail.SubTotalPrice.toLocaleString()}</td></tr>))}</tbody><tfoot className="bg-white/5"><tr><td colSpan="3" className="p-3 text-right font-bold text-white">Total:</td><td className="p-3 font-bold text-xl text-emerald-400">RWF {selectedSale.sale.TotalPrice.toLocaleString()}</td></tr></tfoot></table></div>
              <div className="flex justify-end"><button onClick={() => setSelectedSale(null)} className="px-6 py-2 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-colors">Close</button></div>
            </div>
          </div>
        </div>
      )}

      {/* New Sale Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white/10 p-6 border-b border-white/10 flex justify-between items-center">
              <div className="flex items-center gap-3"><ShoppingCart className="text-amber-400" size={22} /><h2 className="text-2xl font-bold text-white">New Sale</h2></div>
              <button onClick={() => { setShowModal(false); setCart([]); setCustomerName(""); }} className="text-white/60 hover:text-white"><X size={22} /></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="rounded-xl bg-white/5 p-5"><h3 className="font-semibold text-white mb-4 flex items-center gap-2"><User size={18} /> Customer Info</h3><div><label className="block text-white/60 text-sm mb-1">Customer Name *</label><input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-amber-500 outline-none transition-all" placeholder="Enter customer name" /></div></div>
              <div className="rounded-xl bg-white/5 p-5"><h3 className="font-semibold text-white mb-4 flex items-center gap-2"><Package size={18} /> Add Items</h3><div className="grid grid-cols-1 md:grid-cols-3 gap-4"><div className="md:col-span-2"><label className="block text-white/60 text-sm mb-1">Select Item</label><select value={selectedItem} onChange={(e) => setSelectedItem(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-amber-500 outline-none"><option value="">Choose an item...</option>{items.filter(i => i.Quantity > 0).map(item => (<option key={item._id} value={item._id}>{item.ItemName} - RWF {item.UnitPrice.toLocaleString()} (Stock: {item.Quantity})</option>))}</select></div><div className="flex gap-2"><div className="flex-1"><label className="block text-white/60 text-sm mb-1">Quantity</label><input type="number" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value) || 1)} min="1" className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-amber-500 outline-none" /></div><button onClick={addToCart} className="mt-6 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold"><PlusIcon size={18} /></button></div></div></div>
              <div className="rounded-xl bg-white/5 p-5"><h3 className="font-semibold text-white mb-4 flex items-center gap-2"><ShoppingCart size={18} /> Cart</h3>{cart.length === 0 ? (<div className="text-center py-8 text-white/40"><ShoppingCart className="mx-auto mb-2" size={48} /><p>Cart is empty</p></div>) : (<div className="overflow-x-auto"><table className="w-full text-left"><thead className="bg-white/5"><tr><th className="p-3 text-white/60 text-sm">Item</th><th className="p-3 text-white/60 text-sm">Quantity</th><th className="p-3 text-white/60 text-sm">Price</th><th className="p-3 text-white/60 text-sm">Subtotal</th><th></th></tr></thead><tbody>{cart.map((item, idx) => (<tr key={idx} className="border-t border-white/10"><td className="p-3 text-white">{item.ItemName}</td><td className="p-3"><div className="flex items-center gap-2"><button onClick={() => updateQuantity(idx, item.QuantitySold - 1)} className="p-1 rounded bg-white/10 hover:bg-white/20"><Minus size={12} /></button><span className="text-white w-12 text-center">{item.QuantitySold}</span><button onClick={() => updateQuantity(idx, item.QuantitySold + 1)} className="p-1 rounded bg-white/10 hover:bg-white/20"><PlusIcon size={12} /></button></div></td><td className="p-3 text-white/70">RWF {item.UnitPrice.toLocaleString()}</td><td className="p-3 text-emerald-400 font-semibold">RWF {item.SubTotalPrice.toLocaleString()}</td><td className="p-3"><button onClick={() => removeFromCart(idx)} className="text-red-400 hover:text-red-300"><Trash2 size={16} /></button></td></tr>))}</tbody><tfoot className="bg-white/5"><tr><td colSpan="3" className="p-3 text-right font-bold text-white">Total:</td><td className="p-3 font-bold text-xl text-emerald-400">RWF {totalAmount.toLocaleString()}</td><td></td></tr></tfoot></table></div>)}</div>
              <div className="flex gap-3"><button onClick={handleSubmitSale} disabled={cart.length === 0 || !customerName} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold disabled:opacity-50">Complete Sale</button><button onClick={() => { setShowModal(false); setCart([]); setCustomerName(""); }} className="flex-1 py-3 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors">Cancel</button></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}