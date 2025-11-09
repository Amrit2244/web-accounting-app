// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import ProtectedRoute from "@/components/ProtectedRoute";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Accounting & Inventory",
  description: "Full-featured Accounting & Inventory Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className + " bg-background text-foreground min-h-screen"}>
        <Providers>
          <div className="flex min-h-screen">
            {/* Sidebar */}
            <ProtectedRoute>
              <aside className="w-64 bg-linear-to-br from-[#182848] via-[#22304a] to-[#2c5364] text-[#b0bec5] flex flex-col border-r border-[#22304a] shadow-2xl backdrop-blur-lg">
                <div className="px-6 py-4 flex items-center gap-2 border-b border-[#22304a]">
                  <span className="font-bold text-xl tracking-wide text-[#6ee7b7] drop-shadow">Anaicle</span>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-4">
                  <div className="mb-2 text-xs font-semibold text-[#6ee7b7] uppercase tracking-wider">Main Menu</div>
                  <a href="/" className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[#22304a] hover:text-[#6ee7b7] font-medium transition-all">
                    <svg width="18" height="18" fill="none" stroke="#6ee7b7" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6"/></svg>
                    Dashboard
                  </a>
                  <div className="mt-4 mb-2 text-xs font-semibold text-[#6ee7b7] uppercase tracking-wider">Masters</div>
                  <a href="/masters/groups" className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[#22304a] hover:text-[#6ee7b7] transition-all">
                    <svg width="18" height="18" fill="none" stroke="#6ee7b7" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/></svg>
                    Master Groups
                  </a>
                  <a href="/masters/ledger" className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[#22304a] hover:text-[#6ee7b7] transition-all">
                    <svg width="18" height="18" fill="none" stroke="#6ee7b7" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M16 3v4"/><path d="M8 3v4"/></svg>
                    Master Ledger
                  </a>
                  <div className="mt-4 mb-2 text-xs font-semibold text-[#6ee7b7] uppercase tracking-wider">Inventory</div>
                  <a href="/masters/inventory/items" className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[#22304a] hover:text-[#6ee7b7] transition-all">
                    <svg width="18" height="18" fill="none" stroke="#6ee7b7" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M16 3v4"/><path d="M8 3v4"/></svg>
                    Inventory Items
                  </a>
                  <a href="/masters/inventory/godown" className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[#22304a] hover:text-[#6ee7b7] transition-all">
                    <svg width="18" height="18" fill="none" stroke="#6ee7b7" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M16 3v4"/><path d="M8 3v4"/></svg>
                    Godown
                  </a>
                  <a href="/masters/inventory/units" className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[#22304a] hover:text-[#6ee7b7] transition-all">
                    <svg width="18" height="18" fill="none" stroke="#6ee7b7" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/></svg>
                    Units
                  </a>
                  <div className="mt-4 mb-2 text-xs font-semibold text-[#6ee7b7] uppercase tracking-wider">Reports</div>
                  <a href="#" className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[#22304a] hover:text-[#6ee7b7] transition-all">
                    <svg width="18" height="18" fill="none" stroke="#6ee7b7" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M16 3v4"/><path d="M8 3v4"/></svg>
                    Reports
                  </a>
                </nav>
                <div className="px-6 py-4 border-t border-[#22304a] text-xs text-[#b0bec5]">© 2025 Finacle Banking</div>
              </aside>
            </ProtectedRoute>
            {/* Main Content */}
            <main className="flex-1 flex flex-col">
              {/* Header */}
              <header className="px-6 py-4 bg-card border-b border-border flex items-center justify-between">
                <span className="font-semibold text-lg text-primary">Accounting & Inventory</span>
                <div className="flex items-center gap-4">
                  {/* User profile placeholder */}
                  <span className="text-sm text-muted-foreground">Welcome, User</span>
                </div>
              </header>
              <div className="flex-1 p-4 bg-background">
                {children}
              </div>
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}