import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const RequestAccess = () => {
  const [software, setSoftware] = useState([]);
  const [requests, setRequests] = useState([]);
  const [selectedSoftware, setSelectedSoftware] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    fetchSoftware();
    fetchRequests();
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

  const fetchRequests = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/requests/my-requests', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch requests');
      const data = await response.json();
      setRequests(data);
    } catch (err) {
      setError('Failed to load requests');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          softwareId: selectedSoftware,
          reason,
        }),
      });

      if (!response.ok) throw new Error('Failed to submit request');

      setSelectedSoftware('');
      setReason('');
      fetchRequests();
    } catch (err) {
      setError('Failed to submit request');
    }
  };

  return (
    <div className="request-access-container fade-in-up">
      <h2>Request Software Access</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit} className="request-form card fade-in-up" style={{ marginBottom: '2rem' }}>
        <div className="form-group">
          <label>Select Software:</label>
          <select
            value={selectedSoftware}
            onChange={(e) => setSelectedSoftware(e.target.value)}
            required
          >
            <option value="">Select a software</option>
            {software.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Reason for Request:</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Submit Request</button>
      </form>
      <div className="requests-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        <h3 style={{ gridColumn: '1/-1' }}>My Requests</h3>
        {requests.map((request) => (
          <div key={request.id} className="request-item card fade-in-up">
            <h4>{request.software.name}</h4>
            <span className={`status status-${request.status}`}>{request.status}</span>
            <p>Reason: {request.reason}</p>
            {request.managerComment && (
              <p>Manager Comment: {request.managerComment}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RequestAccess; 