"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function ItemsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [stockGroups, setStockGroups] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    alias: "",
    stockGroupId: "",
    baseUnitId: "",
    gstPercentage: "0.00",
    hsnCode: "",
    openingQuantity: "0.00",
    openingRate: "0.00",
  });
  const [editForm, setEditForm] = useState({
    name: "",
    alias: "",
    stockGroupId: "",
    baseUnitId: "",
    gstPercentage: "0.00",
    hsnCode: "",
    openingQuantity: "0.00",
    openingRate: "0.00",
  });

  // TODO: Replace with actual companyId from session/context
  const companyId = "COMPANY_ID_HERE";

  async function loadItems() {
    const res = await fetch("/api/masters/inventory/items");
    if (res.ok) {
      const data = await res.json();
      setItems(data);
    }
  }

  async function loadStockGroups() {
    const res = await fetch("/api/masters/inventory/stock-groups");
    if (res.ok) {
      const data = await res.json();
      setStockGroups(data);
    }
  }

  async function loadUnits() {
    const res = await fetch("/api/masters/inventory/units");
    if (res.ok) {
      const data = await res.json();
      setUnits(data);
    }
  }

  async function addItem() {
    const res = await fetch("/api/masters/inventory/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        gstPercentage: parseFloat(form.gstPercentage),
        openingQuantity: parseFloat(form.openingQuantity),
        openingRate: parseFloat(form.openingRate),
        companyId,
      }),
    });
    if (res.ok) {
      toast.success("Item created!");
      setForm({
        name: "",
        alias: "",
        stockGroupId: "",
        baseUnitId: "",
        gstPercentage: "0.00",
        hsnCode: "",
        openingQuantity: "0.00",
        openingRate: "0.00",
      });
      loadItems();
    } else {
      toast.error("Failed to create item");
    }
  }

  function startEdit(item: any) {
    setEditingId(item.id);
    setEditForm({
      name: item.name,
      alias: item.alias || "",
      stockGroupId: item.stockGroupId,
      baseUnitId: item.baseUnitId,
      gstPercentage: item.gstPercentage.toString(),
      hsnCode: item.hsnCode || "",
      openingQuantity: item.openingQuantity.toString(),
      openingRate: item.openingRate.toString(),
    });
  }

  async function saveEdit() {
    if (!editingId) return;
    const res = await fetch("/api/masters/inventory/items", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editingId,
        ...editForm,
        gstPercentage: parseFloat(editForm.gstPercentage),
        openingQuantity: parseFloat(editForm.openingQuantity),
        openingRate: parseFloat(editForm.openingRate),
      }),
    });
    if (res.ok) {
      toast.success("Item updated!");
      setEditingId(null);
      loadItems();
    } else {
      toast.error("Failed to update item");
    }
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function deleteItem(id: string) {
    if (!confirm("Are you sure you want to delete this item?")) return;
    const res = await fetch(`/api/masters/inventory/items?id=${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      toast.success("Item deleted!");
      loadItems();
    } else {
      toast.error("Failed to delete item");
    }
  }

  useEffect(() => {
    loadItems();
    loadStockGroups();
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
      <h1 className="text-2xl font-bold mb-4">Inventory Items</h1>

      {/* Add Item Form */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
        <Input
          placeholder="Item Name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />
        <Input
          placeholder="Alias"
          value={form.alias}
          onChange={(e) => setForm((f) => ({ ...f, alias: e.target.value }))}
        />
        <select
          className="border rounded px-2 py-2"
          value={form.stockGroupId}
          onChange={(e) =>
            setForm((f) => ({ ...f, stockGroupId: e.target.value }))
          }
        >
          <option value="">Select Stock Group</option>
          {stockGroups.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
        <select
          className="border rounded px-2 py-2"
          value={form.baseUnitId}
          onChange={(e) =>
            setForm((f) => ({ ...f, baseUnitId: e.target.value }))
          }
        >
          <option value="">Select Unit</option>
          {units.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name} ({u.symbol})
            </option>
          ))}
        </select>
        <Input
          placeholder="HSN Code"
          value={form.hsnCode}
          onChange={(e) => setForm((f) => ({ ...f, hsnCode: e.target.value }))}
        />
        <Input
          type="number"
          placeholder="GST %"
          value={form.gstPercentage}
          onChange={(e) =>
            setForm((f) => ({ ...f, gstPercentage: e.target.value }))
          }
        />
        <Input
          type="number"
          placeholder="Opening Qty"
          value={form.openingQuantity}
          onChange={(e) =>
            setForm((f) => ({ ...f, openingQuantity: e.target.value }))
          }
        />
        <Input
          type="number"
          placeholder="Opening Rate"
          value={form.openingRate}
          onChange={(e) =>
            setForm((f) => ({ ...f, openingRate: e.target.value }))
          }
        />
        <Button onClick={addItem} className="col-span-2 md:col-span-4">
          Add Item
        </Button>
      </div>

      {/* Items List */}
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="p-4 border rounded-md bg-muted flex flex-col"
          >
            {editingId === item.id ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
                  <Input
                    placeholder="Item Name"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, name: e.target.value }))
                    }
                  />
                  <Input
                    placeholder="Alias"
                    value={editForm.alias}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, alias: e.target.value }))
                    }
                  />
                  <select
                    className="border rounded px-2 py-2"
                    value={editForm.stockGroupId}
                    onChange={(e) =>
                      setEditForm((f) => ({
                        ...f,
                        stockGroupId: e.target.value,
                      }))
                    }
                  >
                    <option value="">Select Stock Group</option>
                    {stockGroups.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                  <select
                    className="border rounded px-2 py-2"
                    value={editForm.baseUnitId}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, baseUnitId: e.target.value }))
                    }
                  >
                    <option value="">Select Unit</option>
                    {units.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.symbol})
                      </option>
                    ))}
                  </select>
                  <Input
                    placeholder="HSN Code"
                    value={editForm.hsnCode}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, hsnCode: e.target.value }))
                    }
                  />
                  <Input
                    type="number"
                    placeholder="GST %"
                    value={editForm.gstPercentage}
                    onChange={(e) =>
                      setEditForm((f) => ({
                        ...f,
                        gstPercentage: e.target.value,
                      }))
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Opening Qty"
                    value={editForm.openingQuantity}
                    onChange={(e) =>
                      setEditForm((f) => ({
                        ...f,
                        openingQuantity: e.target.value,
                      }))
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Opening Rate"
                    value={editForm.openingRate}
                    onChange={(e) =>
                      setEditForm((f) => ({
                        ...f,
                        openingRate: e.target.value,
                      }))
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                  <div>
                    <span className="font-semibold">{item.name}</span>
                    {item.alias && (
                      <span className="text-xs text-gray-500 ml-2">
                        ({item.alias})
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    Group: {item.stockGroup?.name || item.stockGroupId}
                  </div>
                  <div className="text-xs text-gray-500">
                    Unit: {item.baseUnit?.name} ({item.baseUnit?.symbol})
                  </div>
                  <div className="text-xs text-gray-500">
                    HSN: {item.hsnCode || "N/A"} | GST: {item.gstPercentage}%
                  </div>
                  <div className="text-xs text-gray-500">
                    Opening: {item.openingQuantity} @ ₹{item.openingRate}
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => startEdit(item)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteItem(item.id)}
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
