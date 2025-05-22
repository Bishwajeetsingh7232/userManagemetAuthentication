import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Software = () => {
  const [software, setSoftware] = useState([]);
  const [newSoftware, setNewSoftware] = useState({ name: '', description: '' });
  const [error, setError] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    fetchSoftware();
  }, []);

  const fetchSoftware = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/software', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch software');
      const data = await response.json();
      setSoftware(data);
    } catch (err) {
      setError('Failed to load software list');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/software', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newSoftware),
      });

      if (!response.ok) throw new Error('Failed to create software');
      
      setNewSoftware({ name: '', description: '' });
      fetchSoftware();
    } catch (err) {
      setError('Failed to create software');
    }
  };

  return (
    <div className="software-container fade-in-up">
      <h2>Software Management</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit} className="software-form card fade-in-up" style={{ marginBottom: '2rem' }}>
        <div className="form-group">
          <label>Software Name:</label>
          <input
            type="text"
            value={newSoftware.name}
            onChange={(e) => setNewSoftware({ ...newSoftware, name: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea
            value={newSoftware.description}
            onChange={(e) => setNewSoftware({ ...newSoftware, description: e.target.value })}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Add Software</button>
      </form>
      <div className="software-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
        <h3 style={{ gridColumn: '1/-1' }}>Available Software</h3>
        {software.map((item) => (
          <div key={item.id} className="software-card fade-in-up">
            <h4>{item.name}</h4>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Software; 