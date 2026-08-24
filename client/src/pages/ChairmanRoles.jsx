import { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const ALL_PERMISSIONS = [
  "member.view",
  "application.view",
  "application.approve",
  "application.reject",
  "role.manage",
  "audit.view",
];

const ChairmanRoles = () => {
  const { user, logout } = useAuth();
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [assignUserId, setAssignUserId] = useState("");
  const [assignRoleId, setAssignRoleId] = useState("");

  useEffect(() => {
    fetchRoles();
    fetchUsers();
  }, []);

  const fetchRoles = async () => {
    const res = await api.get("/roles");
    setRoles(res.data);
  };

  const fetchUsers = async () => {
    const res = await api.get("/users");
    setUsers(res.data);
  };

  const togglePermission = (perm) => {
    setSelectedPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  const handleCreateRole = async (e) => {
    e.preventDefault();
    try {
      await api.post("/roles", { name, description, permissions: selectedPermissions });
      setName("");
      setDescription("");
      setSelectedPermissions([]);
      fetchRoles();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create role");
    }
  };

  const handleAssignRole = async (e) => {
    e.preventDefault();
    try {
      await api.put("/users/assign-role", { userId: assignUserId, officerRoleId: assignRoleId });
      fetchUsers();
      alert("Role assigned successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to assign role");
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "30px auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Chairman - Role Management</h2>
        <button onClick={logout}>Logout</button>
      </div>

      <h3>Create Officer Role</h3>
      <form onSubmit={handleCreateRole}>
        <div>
          <label>Role Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Description</label>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div>
          <label>Permissions</label>
          <div>
            {ALL_PERMISSIONS.map((perm) => (
              <label key={perm} style={{ display: "block" }}>
                <input
                  type="checkbox"
                  checked={selectedPermissions.includes(perm)}
                  onChange={() => togglePermission(perm)}
                />
                {perm}
              </label>
            ))}
          </div>
        </div>
        <button type="submit">Create Role</button>
      </form>

      <h3>Existing Roles</h3>
      <ul>
        {roles.map((role) => (
          <li key={role._id}>
            <strong>{role.name}</strong> — {role.permissions.join(", ")}
          </li>
        ))}
      </ul>

      <h3>Assign Role to User</h3>
      <form onSubmit={handleAssignRole}>
        <div>
          <label>User</label>
          <select value={assignUserId} onChange={(e) => setAssignUserId(e.target.value)} required>
            <option value="">Select user</option>
            {users.filter((u) => u.role !== "CHAIRMAN").map((u) => (
              <option key={u._id} value={u._id}>{u.name} ({u.email}) - {u.role}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Officer Role</label>
          <select value={assignRoleId} onChange={(e) => setAssignRoleId(e.target.value)} required>
            <option value="">Select role</option>
            {roles.map((r) => (
              <option key={r._id} value={r._id}>{r.name}</option>
            ))}
          </select>
        </div>
        <button type="submit">Assign Role</button>
      </form>
    </div>
  );
};

export default ChairmanRoles;