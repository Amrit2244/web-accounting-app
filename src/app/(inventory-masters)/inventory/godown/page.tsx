"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function GodownPage() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  async function addGodown() {
    const res = await fetch("/api/masters/godown", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, address }),
    });
    if (res.ok) {
      toast.success("Godown created!");
      setName("");
      setAddress("");
    } else toast.error("Failed");
  }

  return (
    <div className="p-6">
      <Button variant="outline" className="mb-4" onClick={() => window.location.href = '/(dashboard)'}>
        ← Back to Dashboard
      </Button>
      <h1 className="text-xl font-bold mb-4">Godowns</h1>
      <div className="flex gap-2 mb-4">
        <Input placeholder="Godown Name" value={name} onChange={e => setName(e.target.value)} />
        <Input placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} />
        <Button onClick={addGodown}>Add Godown</Button>
      </div>
      {/* List godowns here */}
    </div>
  );
}
