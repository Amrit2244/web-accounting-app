"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function GodownPage() {
  const [godowns, setGodowns] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    address: "",
  });
  const [editForm, setEditForm] = useState({
    name: "",
    address: "",
  });

  // TODO: Replace with actual companyId from session/context
  const companyId = "COMPANY_ID_HERE";

  async function loadGodowns() {
    const res = await fetch("/api/masters/inventory/godown");
    if (res.ok) {
      const data = await res.json();
      setGodowns(data);
    }
  }

  async function addGodown() {
    const res = await fetch("/api/masters/inventory/godown", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        companyId,
      }),
    });
    if (res.ok) {
      toast.success("Godown created!");
      setForm({
        name: "",
        address: "",
      });
      loadGodowns();
    } else {
      toast.error("Failed to create godown");
    }
  }

  function startEdit(godown: any) {
    setEditingId(godown.id);
    setEditForm({
      name: godown.name,
      address: godown.address || "",
    });
  }

  async function saveEdit() {
    if (!editingId) return;
    const res = await fetch("/api/masters/inventory/godown", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editingId,
        ...editForm,
      }),
    });
    if (res.ok) {
      toast.success("Godown updated!");
      setEditingId(null);
      loadGodowns();
    } else {
      toast.error("Failed to update godown");
    }
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function deleteGodown(id: string) {
    if (!confirm("Are you sure you want to delete this godown?")) return;
    const res = await fetch(`/api/masters/inventory/godown?id=${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      toast.success("Godown deleted!");
      loadGodowns();
    } else {
      toast.error("Failed to delete godown");
    }
  }

  useEffect(() => {
    loadGodowns();
  }, []);

  return (
    <div className="p-6">
      <Button
        variant="outline"
        className="mb-4"
        onClick={() => (window.location.href = "/")}
      >
        ← Back to Dashboard
      </Button>
      <h1 className="text-2xl font-bold mb-4">Godowns</h1>

      {/* Add Godown Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
        <Input
          placeholder="Godown Name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />
        <Input
          placeholder="Address"
          value={form.address}
          onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
        />
        <Button onClick={addGodown}>Add Godown</Button>
      </div>

      {/* Godowns List */}
      <div className="space-y-2">
        {godowns.map((godown) => (
          <div
            key={godown.id}
            className="p-4 border rounded-md bg-muted flex flex-col"
          >
            {editingId === godown.id ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                  <Input
                    placeholder="Godown Name"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, name: e.target.value }))
                    }
                  />
                  <Input
                    placeholder="Address"
                    value={editForm.address}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, address: e.target.value }))
                    }
                  />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={saveEdit}>
                    Save
                  </Button>
                  <Button size="sm" variant="secondary" onClick={cancelEdit}>
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="mb-2">
                  <span className="font-semibold">{godown.name}</span>
                  {godown.address && (
                    <div className="text-xs text-gray-500 mt-1">
                      📍 {godown.address}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => startEdit(godown)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteGodown(godown.id)}
                  >
                    Delete
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
