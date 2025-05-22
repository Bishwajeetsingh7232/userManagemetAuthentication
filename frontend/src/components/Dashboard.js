import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [software, setSoftware] = useState([]);
  const [requests, setRequests] = useState([]);
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
      const response = await fetch('http://localhost:5000/api/requests', {
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

  const requestSoftware = async (softwareId) => {
    try {
      const response = await fetch('http://localhost:5000/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ softwareId }),
      });
      
      if (!response.ok) throw new Error('Failed to create request');
      
      fetchRequests(); // Refresh requests list
    } catch (err) {
      setError('Failed to submit request');
    }
  };

  return (
    <div className="dashboard fade-in-up">
      <h2>Software Dashboard</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="software-list">
        <h3>Available Software</h3>
        <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {software.map((item) => (
            <div key={item.id} className="software-card fade-in-up">
              <h4>{item.name}</h4>
              <p>{item.description}</p>
              <button
                onClick={() => requestSoftware(item.id)}
                className="btn btn-primary"
                disabled={requests.some(
                  (req) => req.softwareId === item.id && req.status === 'pending'
                )}
              >
                {requests.some((req) => req.softwareId === item.id && req.status === 'pending') ? 'Requested' : 'Request Access'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="requests-list">
        <h3>My Requests</h3>
        <table className="table fade-in-up">
          <thead>
            <tr>
              <th>Software</th>
              <th>Status</th>
              <th>Requested Date</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id}>
                <td>
                  {software.find((s) => s.id === request.softwareId)?.name}
                </td>
                <td>
                  <span className={`status status-${request.status}`}>
                    {request.status}
                  </span>
                </td>
                <td>{new Date(request.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard; 