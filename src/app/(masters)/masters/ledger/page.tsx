"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function LedgerPage() {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    alias: "",
    openingBalance: "0.00",
    isDebitOpening: true,
    accountingGroupId: "",
  });

  function startEdit(ledger: any) {
    setEditingId(ledger.id);
    setEditForm({
      name: ledger.name,
      alias: ledger.alias || "",
      openingBalance: ledger.openingBalance.toString(),
      isDebitOpening: ledger.isDebitOpening,
      accountingGroupId: ledger.accountingGroupId,
    });
  }

  async function saveEdit() {
    if (!editingId) return;
    const res = await fetch("/api/masters/ledger", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editingId,
        ...editForm,
        openingBalance: parseFloat(editForm.openingBalance),
      }),
    });
    if (res.ok) {
      toast.success("Ledger updated!");
      setEditingId(null);
      loadLedgers();
    } else toast.error("Failed to update");
  }

  function cancelEdit() {
    setEditingId(null);
  }
  const [ledgers, setLedgers] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: "",
    alias: "",
    openingBalance: "0.00",
    isDebitOpening: true,
    accountingGroupId: "",
  });
  // TODO: Replace with actual companyId from session/context
  const companyId = "COMPANY_ID_HERE";

  async function loadLedgers() {
    const res = await fetch("/api/masters/ledger");
    const data = await res.json();
    setLedgers(data);
  }
  async function loadGroups() {
    const res = await fetch("/api/masters/groups");
    const data = await res.json();
    setGroups(data);
  }

  async function addLedger() {
    const res = await fetch("/api/masters/ledger", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        openingBalance: parseFloat(form.openingBalance),
        companyId,
      }),
    });
    if (res.ok) {
      toast.success("Ledger created!");
      setForm({ name: "", alias: "", openingBalance: "0.00", isDebitOpening: true, accountingGroupId: "" });
      loadLedgers();
    } else toast.error("Failed");
  }

  useEffect(() => {
    loadLedgers();
    loadGroups();
  }, []);

  return (
    <div className="p-6">
      <Button variant="outline" className="mb-4" onClick={() => window.location.href = '/'}>
        ← Back to Dashboard
      </Button>
  <h1 className="text-2xl font-bold mb-4">Ledgers</h1>
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Ledger Name"
          value={form.name}
          onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
        />
        <Input
          placeholder="Alias"
          value={form.alias}
          onChange={(e) => setForm(f => ({ ...f, alias: e.target.value }))}
        />
        <Input
          type="number"
          placeholder="Opening Balance"
          value={form.openingBalance}
          onChange={(e) => setForm(f => ({ ...f, openingBalance: e.target.value }))}
        />
        <select
          className="border rounded px-2"
          value={form.accountingGroupId}
          onChange={(e) => setForm(f => ({ ...f, accountingGroupId: e.target.value }))}
        >
          <option value="">Select Group</option>
          {groups.map((g) => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>
        <select
          className="border rounded px-2"
          value={form.isDebitOpening ? "debit" : "credit"}
          onChange={(e) => setForm(f => ({ ...f, isDebitOpening: e.target.value === "debit" }))}
        >
          <option value="debit">Debit</option>
          <option value="credit">Credit</option>
        </select>
        <Button onClick={addLedger}>Add Ledger</Button>
      </div>

      <ul className="space-y-2">
        {ledgers.map((l) => (
          <li
            key={l.id}
            className="p-2 border rounded-md bg-muted flex flex-col"
          >
            {editingId === l.id ? (
              <>
                <Input
                  placeholder="Ledger Name"
                  value={editForm.name}
                  onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                  className="mb-2"
                />
                <Input
                  placeholder="Alias"
                  value={editForm.alias}
                  onChange={e => setEditForm(f => ({ ...f, alias: e.target.value }))}
                  className="mb-2"
                />
                <Input
                  type="number"
                  placeholder="Opening Balance"
                  value={editForm.openingBalance}
                  onChange={e => setEditForm(f => ({ ...f, openingBalance: e.target.value }))}
                  className="mb-2"
                />
                <select
                  className="border rounded px-2 mb-2"
                  value={editForm.accountingGroupId}
                  onChange={e => setEditForm(f => ({ ...f, accountingGroupId: e.target.value }))}
                >
                  <option value="">Select Group</option>
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
                <select
                  className="border rounded px-2 mb-2"
                  value={editForm.isDebitOpening ? "debit" : "credit"}
                  onChange={e => setEditForm(f => ({ ...f, isDebitOpening: e.target.value === "debit" }))}
                >
                  <option value="debit">Debit</option>
                  <option value="credit">Credit</option>
                </select>
                <div className="flex gap-2">
                  <Button size="sm" onClick={saveEdit}>Save</Button>
                  <Button size="sm" variant="secondary" onClick={cancelEdit}>Cancel</Button>
                </div>
              </>
            ) : (
              <>
                <span className="font-semibold">{l.name}</span>
                <span className="text-xs text-gray-500">Alias: {l.alias || "-"}</span>
                <span className="text-xs text-gray-500">Group: {l.group?.name || l.accountingGroupId}</span>
                <span className="text-xs text-gray-500">Opening: ₹{l.openingBalance} {l.isDebitOpening ? "Dr" : "Cr"}</span>
                <Button size="sm" variant="outline" className="mt-2 self-end" onClick={() => startEdit(l)}>
                  Edit
                </Button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
