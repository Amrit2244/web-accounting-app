"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function UnitsPage() {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");

  async function addUnit() {
    const res = await fetch("/api/masters/units", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, symbol }),
    });
    if (res.ok) {
      toast.success("Unit created!");
      setName("");
      setSymbol("");
    } else toast.error("Failed");
  }

  return (
    <div className="p-6">
      <Button variant="outline" className="mb-4" onClick={() => window.location.href = '/(dashboard)'}>
        ← Back to Dashboard
      </Button>
      <h1 className="text-xl font-bold mb-4">Units of Measure</h1>
      <div className="flex gap-2 mb-4">
        <Input placeholder="Unit Name" value={name} onChange={e => setName(e.target.value)} />
        <Input placeholder="Symbol" value={symbol} onChange={e => setSymbol(e.target.value)} />
        <Button onClick={addUnit}>Add Unit</Button>
      </div>
      {/* List units here */}
    </div>
  );
}
