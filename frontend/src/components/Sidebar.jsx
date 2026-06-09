import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  FileText,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Sidebar({ active, setActive, isCollapsed, setIsCollapsed }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, gradient: "from-indigo-500 to-purple-500" },
    { id: "items", label: "Items", icon: Package, gradient: "from-emerald-500 to-teal-500" },
    { id: "sales", label: "Sales", icon: ShoppingCart, gradient: "from-amber-500 to-orange-500" },
    { id: "summary", label: "sale details", icon: BarChart3, gradient: "from-pink-500 to-rose-500" },
    { id: "reports", label: "Daily Reports", icon: FileText, gradient: "from-blue-500 to-cyan-500" },
  ];

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-20 lg:hidden transition-all duration-300 ${!isCollapsed ? 'opacity-100 visible' : 'opacity-0 invisible'}`} 
        onClick={() => setIsCollapsed(true)} 
      />
      
      <aside className={`
        relative z-30 h-screen transition-all duration-300
        bg-white/5 backdrop-blur-xl border-r border-white/10
        shadow-[0_8px_32px_rgba(0,0,0,0.2)]
        ${isCollapsed ? 'w-20' : 'w-72'}
      `}>
        <div className="relative p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur-lg opacity-70"></div>
              <div className="relative p-2.5 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl">
                <ShoppingCart className="text-white" size={24} />
              </div>
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  SRMS
                </h1>
                <p className="text-xs text-white/50">Sales Records Management</p>
              </div>
            )}
          </div>
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-3 top-9 bg-white/10 backdrop-blur-xl rounded-full p-1.5 border border-white/20 hover:bg-white/20 transition-all"
          >
            {isCollapsed ? <ChevronRight size={14} className="text-white" /> : <ChevronLeft size={14} className="text-white" />}
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActive(item.id)}
                onMouseEnter={() => setHovered(item.id)}
                onMouseLeave={() => setHovered(null)}
                className={`
                  relative w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300
                  ${isCollapsed ? 'justify-center' : ''}
                  ${isActive 
                    ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg` 
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                  }
                `}
              >
                <Icon size={20} />
                {!isCollapsed && <span className="font-medium">{item.label}</span>}
                {isActive && !isCollapsed && (
                  <Sparkles size={14} className="absolute right-3 text-white/70" />
                )}
                {isCollapsed && hovered === item.id && (
                  <div className="fixed left-20 ml-2 px-3 py-2 bg-white/10 backdrop-blur-xl rounded-xl text-sm whitespace-nowrap z-50 border border-white/20">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300
              text-red-400 hover:text-red-300 hover:bg-red-500/10
              ${isCollapsed ? 'justify-center' : ''}
            `}
          >
            <LogOut size={20} />
            {!isCollapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}