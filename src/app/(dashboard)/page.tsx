"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart2, DollarSign, ShoppingCart, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
  // You would fetch real data from your API here
  useEffect(() => {
    // Example: fetch('/api/dashboard').then(...)
    // For now, just show a welcome toast
    toast.info("Welcome to your dashboard!");
  }, []);

  return (
    <div className="p-6 grid gap-6">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex items-center gap-2">
            <DollarSign className="text-green-600" />
            <CardTitle>Cash Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-semibold">{stats.cashBalance.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex items-center gap-2">
            <ShoppingCart className="text-blue-600" />
            <CardTitle>Stock Value</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-semibold">{stats.stockValue.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex items-center gap-2">
            <BarChart2 className="text-orange-600" />
            <CardTitle>Receivables</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-semibold">{stats.receivables.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex items-center gap-2">
            <BarChart2 className="text-red-600" />
            <CardTitle>Payables</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-semibold">{stats.payables.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
          </CardContent>
        </Card>
      </div>
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Button variant="default">Add Voucher</Button>
            <Button variant="outline">Add Stock Item</Button>
            <Button variant="outline">Add Ledger</Button>
          </CardContent>
        </Card>
      </div>
      {/* Placeholder for charts and tables */}
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sales & Purchases (Chart)</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Integrate Recharts or TanStack Table here */}
            <div className="h-40 flex items-center justify-center text-muted-foreground">
              Chart coming soon...
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>User Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Users className="text-purple-600" />
              <span className="text-lg font-semibold">{stats.userCount} User(s)</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
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