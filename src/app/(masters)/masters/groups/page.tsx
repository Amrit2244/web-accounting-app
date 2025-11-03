"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function GroupsPage() {
  const [groups, setGroups] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [parentGroupId, setParentGroupId] = useState<string>("");
  // TODO: Replace with actual companyId from session/context
  const companyId = "COMPANY_ID_HERE";

  async function loadGroups() {
    const res = await fetch("/api/masters/groups");
    const data = await res.json();
    setGroups(data);
  }

  async function addGroup() {
    const res = await fetch("/api/masters/groups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, parentGroupId: parentGroupId || undefined, companyId }),
    });
    if (res.ok) {
      toast.success("Group created!");
      setName("");
      setParentGroupId("");
      loadGroups();
    } else toast.error("Failed");
  }

  useEffect(() => {
    loadGroups();
  }, []);

  return (
    <ProtectedRoute>
      <div className="p-8 max-w-2xl mx-auto">
        <Button variant="outline" className="mb-6" onClick={() => window.location.href = '/(dashboard)'}>
          ← Back to Dashboard
        </Button>
        <div className="bg-card rounded-xl shadow-lg p-6 mb-8">
          <h1 className="text-2xl font-bold mb-4 text-primary">Bank Groups</h1>
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Group Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <select
              className="border rounded px-2"
              value={parentGroupId}
              onChange={(e) => setParentGroupId(e.target.value)}
            >
              <option value="">No Parent</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
            <Button onClick={addGroup}>Add Group</Button>
          </div>
        </div>
        <div className="bg-card rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold mb-4 text-primary">All Groups</h2>
          <ul className="space-y-2">
            {groups.map((g) => (
              <li
                key={g.id}
                className="p-3 border rounded-lg bg-muted flex justify-between items-center"
              >
                <span className="font-medium text-sidebar-primary">{g.name}</span>
                {g.parentGroup && (
                  <span className="text-xs text-gray-500 ml-2">(Parent: {g.parentGroup.name})</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </ProtectedRoute>
  );
}
