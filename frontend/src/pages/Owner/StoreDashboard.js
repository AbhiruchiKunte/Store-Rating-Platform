import React, { useState, useEffect } from 'react';
import api from '../../api';

const StoreDashboard = () => {
    const [data, setData] = useState({ storeName: '', averageRating: 0, ratings: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const res = await api.get('/owner/dashboard');
            setData(res.data);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching store data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading dashboard...</div>;

    if (error) return (
        <div>
            <h2>Store Dashboard</h2>
            <div className="error-msg">{error}</div>
        </div>
    );

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Dashboard: <span style={{ color: 'var(--accent-color)' }}>{data.storeName}</span></h2>
                <div style={{ background: 'var(--surface-color)', padding: '0.8rem 1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-border)', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: 'var(--shadow-sm)' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Overall Rating</span>
                    <span className="star active" style={{ fontSize: '1.2rem', cursor: 'default' }}>★</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{data.averageRating}</span>
                </div>
            </div>

            <div className="table-container">
                <div className="table-controls" style={{ borderBottom: '1px solid var(--surface-border)' }}>
                    <h3 style={{ margin: 0 }}>Recent Ratings</h3>
                </div>
                {data.ratings.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No ratings received yet.</div>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Email</th>
                                <th>Rating Given</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.ratings.map((rating, idx) => (
                                <tr key={idx}>
                                    <td>{rating.user_name}</td>
                                    <td>{rating.user_email}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                                            <span className="star active" style={{ fontSize: '1rem', cursor: 'default' }}>★</span>
                                            <span style={{ fontWeight: '600' }}>{rating.rating}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default StoreDashboard;
