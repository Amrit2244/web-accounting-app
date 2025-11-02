"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function ItemsPage() {
  const [name, setName] = useState("");
  const [alias, setAlias] = useState("");

  async function addItem() {
    const res = await fetch("/api/masters/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, alias }),
    });
    if (res.ok) {
      toast.success("Item created!");
      setName("");
      setAlias("");
    } else toast.error("Failed");
  }

  return (
    <div className="p-6">
      <Button variant="outline" className="mb-4" onClick={() => window.location.href = '/(dashboard)'}>
        ← Back to Dashboard
      </Button>
      <h1 className="text-xl font-bold mb-4">Stock Items</h1>
      <div className="flex gap-2 mb-4">
        <Input placeholder="Item Name" value={name} onChange={e => setName(e.target.value)} />
        <Input placeholder="Alias" value={alias} onChange={e => setAlias(e.target.value)} />
        <Button onClick={addItem}>Add Item</Button>
      </div>
      {/* List items here */}
    </div>
  );
}
