import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

const UpdatePassword = () => {
    const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validate = () => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;
        if (!passwordRegex.test(passwords.newPassword)) {
            setError("New password must be 8-16 chars, 1 uppercase, 1 special char");
            return false;
        }
        return true;
    };

    const handleChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!validate()) return;

        setLoading(true);
        try {
            await api.post('/auth/update-password', passwords);
            setSuccess('Password updated successfully');
            setTimeout(() => {
                navigate(-1); // Go back to previous page
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Update Password</h2>
                {error && <div className="error-msg">{error}</div>}
                {success && <div className="error-msg" style={{ backgroundColor: 'rgba(46,160,67,0.1)', borderColor: 'rgba(46,160,67,0.4)', color: 'var(--success-color)' }}>{success}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Current Password</label>
                        <input type="password" name="currentPassword" className="form-control" value={passwords.currentPassword} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>New Password</label>
                        <input type="password" name="newPassword" className="form-control" value={passwords.newPassword} onChange={handleChange} required />
                    </div>
                    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                        {loading ? 'Updating...' : 'Update Password'}
                    </button>
                    <button type="button" className="btn btn-secondary btn-block" style={{ marginTop: '0.8rem' }} onClick={() => navigate(-1)}>
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdatePassword;
