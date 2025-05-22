import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const ManageRequests = () => {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/requests/pending', {
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

  const handleRequestAction = async (requestId, status, comment = '') => {
    try {
      const response = await fetch(`http://localhost:5000/api/requests/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status,
          managerComment: comment,
        }),
      });

      if (!response.ok) throw new Error('Failed to update request');
      fetchRequests();
    } catch (err) {
      setError('Failed to update request');
    }
  };

  return (
    <div className="manage-requests-container fade-in-up">
      <h2>Manage Access Requests</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="requests-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {requests.map((request) => (
          <div key={request.id} className="request-item card fade-in-up">
            <h4>Software: {request.software.name}</h4>
            <p>Requested by: {request.user.name}</p>
            <p>Reason: {request.reason}</p>
            <span className={`status status-${request.status}`}>{request.status}</span>
            <div className="request-actions" style={{ marginTop: '1rem' }}>
              <button
                className="btn btn-success"
                onClick={() => handleRequestAction(request.id, 'approved')}
              >
                Approve
              </button>
              <button
                className="btn btn-danger"
                onClick={() => {
                  const comment = prompt('Enter rejection reason:');
                  if (comment) {
                    handleRequestAction(request.id, 'rejected', comment);
                  }
                }}
              >
                Reject
              </button>
            </div>
          </div>
        ))}
        {requests.length === 0 && (
          <p>No pending requests</p>
        )}
      </div>
    </div>
  );
};

export default ManageRequests; 