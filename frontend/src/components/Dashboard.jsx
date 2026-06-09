import { useEffect, useState } from "react";
import api from "../api";
import {
  Package,
  ShoppingCart,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  ArrowUpRight,
  Calendar,
  Users,
  Activity,
  Sparkles
} from "lucide-react";

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [sales, setSales] = useState([]);
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [itemsRes, salesRes, summaryRes] = await Promise.all([
        api.get("/items"),
        api.get("/sales"),
        api.get("/stock/summary"),
      ]);
      setItems(itemsRes.data);
      setSales(salesRes.data);
      setSummary(summaryRes.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalItems = items.length;
  const totalStockValue = items.reduce((sum, item) => sum + (item.Quantity * item.UnitPrice), 0);
  const totalSales = sales.length;
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.TotalPrice, 0);
  const lowStockItems = summary.filter(item => item.CurrentQuantity < 10);
  
  const revenueTrend = +12.5;
  const salesTrend = +8.3;

  const statsCards = [
    { title: "Total Products", value: totalItems, icon: Package, gradient: "from-blue-500 to-cyan-500", iconBg: "bg-blue-500/20", iconColor: "text-blue-400", trend: "+5.2%", subtitle: "Active items" },
    { title: "Total Sales", value: totalSales, icon: ShoppingCart, gradient: "from-emerald-500 to-teal-500", iconBg: "bg-emerald-500/20", iconColor: "text-emerald-400", trend: `+${salesTrend}%`, subtitle: "Transactions" },
    { title: "Total Revenue", value: `RWF ${totalRevenue.toLocaleString()}`, icon: DollarSign, gradient: "from-amber-500 to-orange-500", iconBg: "bg-amber-500/20", iconColor: "text-amber-400", trend: `+${revenueTrend}%`, subtitle: "This month" },
    { title: "Stock Value", value: `RWF ${totalStockValue.toLocaleString()}`, icon: TrendingUp, gradient: "from-purple-500 to-pink-500", iconBg: "bg-purple-500/20", iconColor: "text-purple-400", trend: "-2.1%", subtitle: "Inventory worth" }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-1 h-10 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <Sparkles className="text-purple-400" size={24} />
        </div>
        <p className="text-white/60 pl-4">Sales Records Management System Overview</p>
        <div className="w-full h-px bg-gradient-to-r from-white/20 to-transparent mt-4"></div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white/60 font-medium">Loading dashboard data...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-500 hover:transform hover:-translate-y-1"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                  <div className="relative p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 ${card.iconBg} rounded-xl`}>
                        <Icon className={card.iconColor} size={24} />
                      </div>
                      <div className="flex items-center gap-1 text-sm text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">
                        <ArrowUpRight size={14} />
                        <span className="text-xs font-medium">{card.trend}</span>
                      </div>
                    </div>
                    <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider">{card.title}</h3>
                    <p className="text-3xl font-bold text-white mt-2 tracking-tight">{card.value}</p>
                    <p className="text-white/30 text-xs mt-2">{card.subtitle}</p>
                  </div>
                </div>
              );
            })}
          </div>

    

          {/* Recent Sales & Quick Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Sales */}
            <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/20 rounded-xl">
                      <ShoppingCart className="text-emerald-400" size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-white">Recent Sales</h2>
                  </div>
                  <span className="text-white/40 text-xs">Last 5 transactions</span>
                </div>
              </div>
              <div className="divide-y divide-white/10">
                {sales.slice(0, 5).map((sale) => (
                  <div key={sale._id} className="p-4 hover:bg-white/5 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
                          <Users size={14} className="text-emerald-400" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{sale.CustomerName}</p>
                          <p className="text-xs text-white/40">{new Date(sale.SaleDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <p className="text-lg font-bold text-emerald-400">RWF {sale.TotalPrice.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
                {sales.length === 0 && (
                  <div className="p-8 text-center text-white/40">
                    <ShoppingCart className="mx-auto mb-2" size={48} />
                    <p>No sales recorded yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/20 rounded-xl">
                    <Activity className="text-purple-400" size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-white">Quick Insights</h2>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-white/60">Average Sale Value</span>
                  <span className="text-white font-bold text-lg">RWF {totalSales > 0 ? (totalRevenue / totalSales).toLocaleString() : 0}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-white/60">Items per Sale (Avg)</span>
                  <span className="text-white font-bold text-lg">{sales.length > 0 ? (sales.reduce((sum, sale) => sum + (sale.items?.length || 0), 0) / sales.length).toFixed(1) : 0}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-white/60">Unique Customers</span>
                  <span className="text-white font-bold text-lg">{new Set(sales.map(sale => sale.CustomerName)).size}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-white/60">Stock Turnover Rate</span>
                  <span className="text-white font-bold text-lg">--</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}