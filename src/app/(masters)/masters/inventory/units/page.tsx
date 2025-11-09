"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function UnitsPage() {
  const [units, setUnits] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    symbol: "",
  });
  const [editForm, setEditForm] = useState({
    name: "",
    symbol: "",
  });

  // TODO: Replace with actual companyId from session/context
  const companyId = "COMPANY_ID_HERE";

  async function loadUnits() {
    const res = await fetch("/api/masters/inventory/units");
    if (res.ok) {
      const data = await res.json();
      setUnits(data);
    }
  }

  async function addUnit() {
    const res = await fetch("/api/masters/inventory/units", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        companyId,
      }),
    });
    if (res.ok) {
      toast.success("Unit created!");
      setForm({
        name: "",
        symbol: "",
      });
      loadUnits();
    } else {
      toast.error("Failed to create unit");
    }
  }

  function startEdit(unit: any) {
    setEditingId(unit.id);
    setEditForm({
      name: unit.name,
      symbol: unit.symbol,
    });
  }

  async function saveEdit() {
    if (!editingId) return;
    const res = await fetch("/api/masters/inventory/units", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editingId,
        ...editForm,
      }),
    });
    if (res.ok) {
      toast.success("Unit updated!");
      setEditingId(null);
      loadUnits();
    } else {
      toast.error("Failed to update unit");
    }
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function deleteUnit(id: string) {
    if (!confirm("Are you sure you want to delete this unit?")) return;
    const res = await fetch(`/api/masters/inventory/units?id=${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      toast.success("Unit deleted!");
      loadUnits();
    } else {
      toast.error("Failed to delete unit");
    }
  }

  useEffect(() => {
    loadUnits();
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
      <h1 className="text-2xl font-bold mb-4">Units of Measure</h1>

      {/* Add Unit Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
        <Input
          placeholder="Unit Name (e.g., Kilogram)"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />
        <Input
          placeholder="Symbol (e.g., kg)"
          value={form.symbol}
          onChange={(e) => setForm((f) => ({ ...f, symbol: e.target.value }))}
        />
        <Button onClick={addUnit}>Add Unit</Button>
      </div>

      {/* Units List */}
      <div className="space-y-2">
        {units.map((unit) => (
          <div
            key={unit.id}
            className="p-4 border rounded-md bg-muted flex flex-col"
          >
            {editingId === unit.id ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                  <Input
                    placeholder="Unit Name"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, name: e.target.value }))
                    }
                  />
                  <Input
                    placeholder="Symbol"
                    value={editForm.symbol}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, symbol: e.target.value }))
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
                  <span className="font-semibold">{unit.name}</span>
                  <span className="text-xs text-gray-500 ml-2">
                    ({unit.symbol})
                  </span>
                  {unit.baseUnit && (
                    <div className="text-xs text-gray-500 mt-1">
                      Base Unit: {unit.baseUnit.name}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => startEdit(unit)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteUnit(unit.id)}
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
