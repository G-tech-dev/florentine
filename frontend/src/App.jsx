import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import Login from "./components/Login";
import Register from "./components/Register";
import Sidebar from "./components/Sidebar";

import Dashboard from "./components/Dashboard";
import Items from "./components/Items";
import Sales from "./components/Sales";
import StockSummary from "./components/StockSummary";
import DailyReport from "./components/DailyReport";

function ProtectedRoute({ children }) {
  const user = localStorage.getItem("user");
  if (!user) return <Navigate to="/" />;
  return children;
}

function DashboardLayout() {
  const [active, setActive] = useState("dashboard");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900">
      <div className="flex h-screen">
        <Sidebar 
          active={active} 
          setActive={setActive} 
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
        />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="animate-fadeIn">
            {active === "dashboard" && <Dashboard />}
            {active === "items" && <Items />}
            {active === "sales" && <Sales />}
            {active === "summary" && <StockSummary />}
            {active === "reports" && <DailyReport />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}