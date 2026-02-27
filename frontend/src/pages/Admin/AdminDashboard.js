import React, { useState, useEffect } from 'react';
import api from '../../api';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ usersCount: 0, storesCount: 0, ratingsCount: 0 });
    const [users, setUsers] = useState([]);
    const [stores, setStores] = useState([]);

    // UI State
    const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, users, stores, addUser, addStore
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ type: '', text: '' });

    // Filter/Sort State
    const [userFilters, setUserFilters] = useState({ name: '', email: '', role: '', sortBy: 'name', order: 'asc' });
    const [storeFilters, setStoreFilters] = useState({ name: '', address: '', sortBy: 'name', order: 'asc' });

    // Form States
    const [userForm, setUserForm] = useState({ name: '', email: '', password: '', address: '', role: 'user' });
    const [storeForm, setStoreForm] = useState({ name: '', email: '', address: '', owner_id: '' });

    useEffect(() => {
        if (activeTab === 'dashboard') fetchStats();
        if (activeTab === 'users') fetchUsers();
        if (activeTab === 'stores') fetchStores();
    }, [activeTab, userFilters, storeFilters]);

    const fetchStats = async () => {
        try {
            const res = await api.get('/admin/dashboard');
            setStats(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchUsers = async () => {
        try {
            const params = new URLSearchParams(userFilters).toString();
            const res = await api.get(`/admin/users?${params}`);
            setUsers(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchStores = async () => {
        try {
            const params = new URLSearchParams(storeFilters).toString();
            const res = await api.get(`/admin/stores?${params}`);
            setStores(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleUserSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg({ type: '', text: '' });
        try {
            await api.post('/admin/users', userForm);
            setMsg({ type: 'success', text: 'User added successfully' });
            setUserForm({ name: '', email: '', password: '', address: '', role: 'user' });
            fetchStats();
        } catch (err) {
            setMsg({ type: 'error', text: err.response?.data?.message || 'Error adding user' });
        } finally {
            setLoading(false);
        }
    };

    const handleStoreSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg({ type: '', text: '' });
        try {
            await api.post('/admin/stores', storeForm);
            setMsg({ type: 'success', text: 'Store added successfully' });
            setStoreForm({ name: '', email: '', address: '', owner_id: '' });
            fetchStats();
        } catch (err) {
            setMsg({ type: 'error', text: err.response?.data?.message || 'Error adding store' });
        } finally {
            setLoading(false);
        }
    };

    const handleUserSort = (field) => {
        setUserFilters(prev => ({
            ...prev,
            sortBy: field,
            order: prev.sortBy === field && prev.order === 'asc' ? 'desc' : 'asc'
        }));
    };

    const handleStoreSort = (field) => {
        setStoreFilters(prev => ({
            ...prev,
            sortBy: field,
            order: prev.sortBy === field && prev.order === 'asc' ? 'desc' : 'asc'
        }));
    };

    return (
        <div>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <button className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('dashboard')}>Dashboard</button>
                <button className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('users')}>Users List</button>
                <button className={`btn ${activeTab === 'stores' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('stores')}>Stores List</button>
                <button className={`btn ${activeTab === 'addUser' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('addUser')}>Add User</button>
                <button className={`btn ${activeTab === 'addStore' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('addStore')}>Add Store</button>
            </div>

            {msg.text && (
                <div className="error-msg" style={{
                    backgroundColor: msg.type === 'success' ? 'rgba(46,160,67,0.1)' : 'rgba(248,81,73,0.1)',
                    borderColor: msg.type === 'success' ? 'rgba(46,160,67,0.4)' : 'rgba(248,81,73,0.4)',
                    color: msg.type === 'success' ? 'var(--success-color)' : 'var(--danger-color)'
                }}>
                    {msg.text}
                </div>
            )}

            {activeTab === 'dashboard' && (
                <div className="dashboard-grid">
                    <div className="stat-card">
                        <div className="stat-card-title">Total Users</div>
                        <div className="stat-card-value">{stats.usersCount}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card-title">Total Stores</div>
                        <div className="stat-card-value">{stats.storesCount}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card-title">Total Ratings</div>
                        <div className="stat-card-value">{stats.ratingsCount}</div>
                    </div>
                </div>
            )}

            {activeTab === 'users' && (
                <div className="table-container">
                    <div className="table-controls">
                        <input type="text" className="form-control" placeholder="Filter Name" style={{ width: '200px' }}
                            value={userFilters.name} onChange={e => setUserFilters({ ...userFilters, name: e.target.value })} />
                        <input type="text" className="form-control" placeholder="Filter Email" style={{ width: '200px' }}
                            value={userFilters.email} onChange={e => setUserFilters({ ...userFilters, email: e.target.value })} />
                        <select className="form-control" style={{ width: '150px' }}
                            value={userFilters.role} onChange={e => setUserFilters({ ...userFilters, role: e.target.value })}>
                            <option value="">All Roles</option>
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                            <option value="store_owner">Store Owner</option>
                        </select>
                    </div>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th onClick={() => handleUserSort('id')}>ID {userFilters.sortBy === 'id' ? (userFilters.order === 'asc' ? '↑' : '↓') : ''}</th>
                                <th onClick={() => handleUserSort('name')}>Name {userFilters.sortBy === 'name' ? (userFilters.order === 'asc' ? '↑' : '↓') : ''}</th>
                                <th onClick={() => handleUserSort('email')}>Email {userFilters.sortBy === 'email' ? (userFilters.order === 'asc' ? '↑' : '↓') : ''}</th>
                                <th onClick={() => handleUserSort('role')}>Role {userFilters.sortBy === 'role' ? (userFilters.order === 'asc' ? '↑' : '↓') : ''}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u.id}>
                                    <td>{u.id}</td>
                                    <td>{u.name}</td>
                                    <td>{u.email}</td>
                                    <td><span className={`badge badge-${u.role === 'store_owner' ? 'owner' : u.role}`}>{u.role === 'store_owner' ? 'Owner' : u.role}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'stores' && (
                <div className="table-container">
                    <div className="table-controls">
                        <input type="text" className="form-control" placeholder="Filter Name" style={{ width: '200px' }}
                            value={storeFilters.name} onChange={e => setStoreFilters({ ...storeFilters, name: e.target.value })} />
                        <input type="text" className="form-control" placeholder="Filter Address" style={{ width: '200px' }}
                            value={storeFilters.address} onChange={e => setStoreFilters({ ...storeFilters, address: e.target.value })} />
                    </div>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th onClick={() => handleStoreSort('id')}>ID {storeFilters.sortBy === 'id' ? (storeFilters.order === 'asc' ? '↑' : '↓') : ''}</th>
                                <th onClick={() => handleStoreSort('name')}>Name {storeFilters.sortBy === 'name' ? (storeFilters.order === 'asc' ? '↑' : '↓') : ''}</th>
                                <th onClick={() => handleStoreSort('address')}>Address {storeFilters.sortBy === 'address' ? (storeFilters.order === 'asc' ? '↑' : '↓') : ''}</th>
                                <th onClick={() => handleStoreSort('overall_rating')}>Rating {storeFilters.sortBy === 'overall_rating' ? (storeFilters.order === 'asc' ? '↑' : '↓') : ''}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stores.map(s => (
                                <tr key={s.id}>
                                    <td>{s.id}</td>
                                    <td>{s.name}</td>
                                    <td>{s.address}</td>
                                    <td><span className="star active">★</span> {s.overall_rating}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'addUser' && (
                <div className="auth-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <h2>Add New User</h2>
                    <form onSubmit={handleUserSubmit}>
                        <div className="form-group">
                            <label>Name</label>
                            <input type="text" className="form-control" value={userForm.name} onChange={e => setUserForm({ ...userForm, name: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" className="form-control" value={userForm.email} onChange={e => setUserForm({ ...userForm, email: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" className="form-control" value={userForm.password} onChange={e => setUserForm({ ...userForm, password: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Role</label>
                            <select className="form-control" value={userForm.role} onChange={e => setUserForm({ ...userForm, role: e.target.value })}>
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>Submit</button>
                    </form>
                </div>
            )}

            {activeTab === 'addStore' && (
                <div className="auth-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <h2>Add New Store</h2>
                    <form onSubmit={handleStoreSubmit}>
                        <div className="form-group">
                            <label>Store Name</label>
                            <input type="text" className="form-control" value={storeForm.name} onChange={e => setStoreForm({ ...storeForm, name: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" className="form-control" value={storeForm.email} onChange={e => setStoreForm({ ...storeForm, email: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Address</label>
                            <textarea className="form-control" value={storeForm.address} onChange={e => setStoreForm({ ...storeForm, address: e.target.value })} required></textarea>
                        </div>
                        <div className="form-group">
                            <label>Owner ID (User ID)</label>
                            <input type="number" className="form-control" value={storeForm.owner_id} onChange={e => setStoreForm({ ...storeForm, owner_id: e.target.value })} required />
                            <small style={{ color: 'var(--text-secondary)' }}>User will be converted to store_owner role automatically</small>
                        </div>
                        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>Submit</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
