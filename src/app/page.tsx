"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart2, DollarSign, ShoppingCart, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ProtectedRoute from "@/components/ProtectedRoute";

// Dummy data for initial UI
const initialStats = {
  cashBalance: 0,
  stockValue: 0,
  receivables: 0,
  payables: 0,
  userCount: 1,
  sales: [],
  purchases: [],
};

export default function DashboardPage() {
  const [stats, setStats] = useState(initialStats);
  const [loading, setLoading] = useState(true);
  // Simulate data fetch with delay for Finacle-style shimmer
  useEffect(() => {
    setLoading(true);
    toast.info("Welcome to your dashboard!");
    setTimeout(() => {
      // Replace with real fetch('/api/dashboard')
      setStats({
        cashBalance: 1250000,
        stockValue: 350000,
        receivables: 120000,
        payables: 80000,
        userCount: 5,
        sales: [],
        purchases: [],
      });
      setLoading(false);
    }, 1800);
  }, []);

  const { useSession, signOut } = require('next-auth/react');
  const { data: session } = useSession();
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-linear-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] text-white">
        {/* Dark Banking Navbar */}
        <nav className="bg-[#182848] bg-opacity-90 shadow-lg px-8 py-4 flex items-center justify-between border-b border-[#22304a] backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="font-bold text-2xl tracking-wide text-[#6ee7b7] drop-shadow">Anaicle</span>
            <span className="bg-[#6ee7b7] text-[#182848] text-xs px-2 py-1 rounded shadow">A S Softwares Pvt ltd</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#b0bec5]">Welcome, {session?.user?.name || "User"}</span>
            <Button
              variant="outline"
              size="sm"
              className="border-[#6ee7b7] text-[#6ee7b7] hover:bg-[#6ee7b7] hover:text-[#182848] shadow-lg shadow-[#6ee7b7]/30 transition-all duration-200"
              onClick={() => signOut()}
            >
              Logout
            </Button>
          </div>
        </nav>
        <main className="flex-1 px-8 py-8">
          {/* Glassmorphism Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            {[{
              label: "Cash Balance",
              icon: <DollarSign className="text-[#6ee7b7]" />,
              value: stats.cashBalance,
              color: "bg-gradient-to-br from-[#182848] via-[#22304a] to-[#6ee7b7] bg-opacity-80 backdrop-blur-lg"
            }, {
              label: "Stock Value",
              icon: <ShoppingCart className="text-[#60a5fa]" />,
              value: stats.stockValue,
              color: "bg-gradient-to-br from-[#182848] via-[#22304a] to-[#60a5fa] bg-opacity-80 backdrop-blur-lg"
            }, {
              label: "Receivables",
              icon: <BarChart2 className="text-[#fbbf24]" />,
              value: stats.receivables,
              color: "bg-gradient-to-br from-[#182848] via-[#22304a] to-[#fbbf24] bg-opacity-80 backdrop-blur-lg"
            }, {
              label: "Payables",
              icon: <BarChart2 className="text-[#f87171]" />,
              value: stats.payables,
              color: "bg-gradient-to-br from-[#182848] via-[#22304a] to-[#f87171] bg-opacity-80 backdrop-blur-lg"
            }].map((card, idx) => (
              <div key={card.label} className={`rounded-2xl shadow-2xl border border-[#22304a] p-6 flex flex-col items-start gap-2 ${card.color} transition-all duration-300 hover:scale-105 hover:shadow-glow`}>
                <div className="flex items-center gap-2 mb-2">
                  {card.icon}
                  <span className="font-semibold text-lg text-white drop-shadow">{card.label}</span>
                </div>
                {loading ? (
                  <div className="animate-pulse h-8 w-32 bg-[#22304a] rounded" />
                ) : (
                  <span className="text-2xl font-bold text-white drop-shadow">{card.value.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
                )}
              </div>
            ))}
          </div>
          {/* Quick Menu with Icons */}
          <div className="mb-10">
            <div className="rounded-2xl shadow-2xl border border-[#22304a] bg-[#182848] bg-opacity-80 backdrop-blur-lg">
              <div className="px-6 py-4 border-b border-[#22304a] flex items-center gap-2">
                <span className="font-semibold text-base text-[#6ee7b7] drop-shadow">Quick Menu</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 p-6">
                <Button variant="default" className="w-full flex flex-col items-center gap-1 bg-linear-to-br from-[#6ee7b7] via-[#34d399] to-[#182848] text-white hover:scale-105 shadow-lg shadow-[#6ee7b7]/30 border-none transition-all duration-200">
                  <DollarSign className="w-5 h-5" />
                  Add Voucher
                </Button>
                <Button variant="outline" className="w-full flex flex-col items-center gap-1 border-[#60a5fa] text-[#60a5fa] hover:bg-[#60a5fa] hover:text-white shadow-lg shadow-[#60a5fa]/30 transition-all duration-200" onClick={() => window.location.href = '/masters/inventory/items'}>
                  <ShoppingCart className="w-5 h-5" />
                  Inventory Items
                </Button>
                <Button variant="outline" className="w-full flex flex-col items-center gap-1 border-[#fbbf24] text-[#fbbf24] hover:bg-[#fbbf24] hover:text-white shadow-lg shadow-[#fbbf24]/30 transition-all duration-200" onClick={() => window.location.href = '/masters/inventory/godown'}>
                  <BarChart2 className="w-5 h-5" />
                  Godown
                </Button>
                <Button variant="outline" className="w-full flex flex-col items-center gap-1 border-[#6ee7b7] text-[#6ee7b7] hover:bg-[#6ee7b7] hover:text-white shadow-lg shadow-[#6ee7b7]/30 transition-all duration-200" onClick={() => window.location.href = '/masters/inventory/units'}>
                  <Users className="w-5 h-5" />
                  Units
                </Button>
                <Button variant="outline" className="w-full flex flex-col items-center gap-1 border-[#f87171] text-[#f87171] hover:bg-[#f87171] hover:text-white shadow-lg shadow-[#f87171]/30 transition-all duration-200" onClick={() => window.location.href = '/masters/ledger'}>
                  <BarChart2 className="w-5 h-5" />
                  Master Ledger
                </Button>
                <Button variant="outline" className="w-full flex flex-col items-center gap-1 border-[#6ee7b7] text-[#6ee7b7] hover:bg-[#6ee7b7] hover:text-white shadow-lg shadow-[#6ee7b7]/30 transition-all duration-200" onClick={() => window.location.href = '/masters/groups'}>
                  <Users className="w-5 h-5" />
                  Master Groups
                </Button>
              </div>
            </div>
          </div>
          {/* Charts and User Overview */}
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl shadow-2xl border border-[#22304a] bg-[#182848] bg-opacity-80 backdrop-blur-lg">
              <div className="px-6 py-4 border-b border-[#22304a]">
                <span className="font-semibold text-base text-[#6ee7b7] drop-shadow">Sales & Purchases (Chart)</span>
              </div>
              <div className="p-6">
                <div className="h-40 flex items-center justify-center text-[#b0bec5]">
                  Chart coming soon...
                </div>
              </div>
            </div>
            <div className="rounded-2xl shadow-2xl border border-[#22304a] bg-[#182848] bg-opacity-80 backdrop-blur-lg">
              <div className="px-6 py-4 border-b border-[#22304a]">
                <span className="font-semibold text-base text-[#6ee7b7] drop-shadow">User Overview</span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2">
                  <Users className="text-[#6ee7b7] w-5 h-5" />
                  <span className="text-lg font-semibold">{stats.userCount} User(s)</span>
                </div>
              </div>
            </div>
          </div>
        </main>
        <footer className="bg-[#182848] bg-opacity-90 text-xs text-[#b0bec5] px-8 py-3 border-t border-[#22304a] text-center mt-8 shadow-inner rounded-b-2xl">
          © 2025 Finacle Banking
        </footer>
      </div>
    </ProtectedRoute>
  );
}
// All duplicate and corrupted code removed. Only the first, valid DashboardPage component remains.

type SessionUser = {
  id: string;
  name: string;
  email: string;
  // Add other relevant fields as needed
};

type Session = {
  user?: SessionUser;
};

// Removed duplicate default export of DashboardPage to fix redeclaration error.