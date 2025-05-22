import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError('Failed to load users');
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/users/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newAdmin),
      });

      if (!response.ok) throw new Error('Failed to create admin');

      setNewAdmin({ name: '', email: '', password: '' });
      fetchUsers();
    } catch (err) {
      setError('Failed to create admin');
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) throw new Error('Failed to update user role');
      fetchUsers();
    } catch (err) {
      setError('Failed to update user role');
    }
  };

  return (
    <div className="admin-dashboard-container fade-in-up">
      <h2>Admin Dashboard</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="create-admin-section card fade-in-up" style={{ marginBottom: '2rem' }}>
        <h3>Create New Admin</h3>
        <form onSubmit={handleCreateAdmin} className="admin-form">
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              value={newAdmin.name}
              onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={newAdmin.email}
              onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={newAdmin.password}
              onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Create Admin</button>
        </form>
      </div>
      <div className="users-list card fade-in-up">
        <h3>Manage Users</h3>
        <table className="users-table table fade-in-up">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  >
                    <option value="employee">Employee</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard; 