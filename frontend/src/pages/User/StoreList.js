import React, { useState, useEffect } from 'react';
import api from '../../api';

const StoreList = () => {
    const [stores, setStores] = useState([]);
    const [filters, setFilters] = useState({ search: '', sortBy: 'name', order: 'asc' });
    const [msg, setMsg] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchStores();
    }, [filters.sortBy, filters.order]);

    const fetchStores = async () => {
        try {
            const params = new URLSearchParams(filters).toString();
            const res = await api.get(`/user/stores?${params}`);
            setStores(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchStores();
    };

    const handleSort = (field) => {
        setFilters(prev => ({
            ...prev,
            sortBy: field,
            order: prev.sortBy === field && prev.order === 'asc' ? 'desc' : 'asc'
        }));
    };

    const handleRating = async (storeId, rating, isUpdate) => {
        setMsg({ type: '', text: '' });
        try {
            if (isUpdate) {
                await api.put('/user/rating', { store_id: storeId, rating });
                setMsg({ type: 'success', text: 'Rating updated successfully' });
            } else {
                await api.post('/user/rating', { store_id: storeId, rating });
                setMsg({ type: 'success', text: 'Rating submitted successfully' });
            }
            fetchStores(); // Refresh stores to get updated my_rating and overall_rating
        } catch (err) {
            setMsg({ type: 'error', text: err.response?.data?.message || 'Error submitting rating' });
        }
    };

    // Component for 5 stars
    const StarRating = ({ storeId, existingRating, onRate }) => {
        const [hoverRating, setHoverRating] = useState(0);

        return (
            <div className="star-rating">
                {[1, 2, 3, 4, 5].map(star => (
                    <span
                        key={star}
                        className={`star ${star <= (hoverRating || existingRating) ? 'active' : ''}`}
                        onClick={() => onRate(storeId, star, existingRating != null)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                    >
                        ★
                    </span>
                ))}
                {existingRating && <span style={{ marginLeft: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>(Your Rating)</span>}
            </div>
        );
    };

    return (
        <div>
            <h2>Store Directory</h2>

            <div className="table-controls" style={{ marginTop: '1rem', borderRadius: 'var(--radius-md)' }}>
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', flex: 1 }}>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by name or address..."
                        value={filters.search}
                        onChange={e => setFilters({ ...filters, search: e.target.value })}
                        style={{ maxWidth: '400px' }}
                    />
                    <button type="submit" className="btn btn-primary">Search</button>
                </form>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Sort By:</span>
                    <select className="form-control" style={{ width: 'auto' }} value={filters.sortBy} onChange={e => handleSort(e.target.value)}>
                        <option value="name">Name</option>
                        <option value="address">Address</option>
                        <option value="overall_rating">Rating</option>
                    </select>
                </div>
            </div>

            {msg.text && (
                <div className="error-msg" style={{
                    backgroundColor: msg.type === 'success' ? 'rgba(46,160,67,0.1)' : 'rgba(248,81,73,0.1)',
                    borderColor: msg.type === 'success' ? 'rgba(46,160,67,0.4)' : 'rgba(248,81,73,0.4)',
                    color: msg.type === 'success' ? 'var(--success-color)' : 'var(--danger-color)',
                    marginTop: '1rem'
                }}>
                    {msg.text}
                </div>
            )}

            <div className="store-grid">
                {stores.length === 0 ? (
                    <div style={{ color: 'var(--text-secondary)' }}>No stores found.</div>
                ) : (
                    stores.map(store => (
                        <div key={store.id} className="store-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <h3>{store.name}</h3>
                                <div style={{ background: 'var(--btn-bg)', padding: '0.3rem 0.6rem', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '0.3rem', border: '1px solid var(--surface-border)' }}>
                                    <span className="star active" style={{ fontSize: '1rem', cursor: 'default' }}>★</span>
                                    <span style={{ fontWeight: '600' }}>{store.overall_rating}</span>
                                </div>
                            </div>
                            <p>📍 {store.address}</p>

                            <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--surface-border)' }}>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                    {store.my_rating ? 'Update your rating:' : 'Rate this store:'}
                                </div>
                                <StarRating
                                    storeId={store.id}
                                    existingRating={store.my_rating}
                                    onRate={handleRating}
                                />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default StoreList;
