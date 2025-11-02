"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

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
    <div className="p-6">
      <Button variant="outline" className="mb-4" onClick={() => window.location.href = '/'}>
        ← Back to Dashboard
      </Button>
      <h1 className="text-xl font-bold mb-4">Accounting Groups</h1>
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

      <ul className="space-y-2">
        {groups.map((g) => (
          <li
            key={g.id}
            className="p-2 border rounded-md bg-muted flex justify-between"
          >
            {g.name}
            {g.parentGroup && (
              <span className="text-xs text-gray-500 ml-2">(Parent: {g.parentGroup.name})</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
