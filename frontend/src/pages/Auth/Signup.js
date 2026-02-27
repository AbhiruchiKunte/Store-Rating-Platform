import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', address: ''
    });
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validate = () => {
        const newErrors = {};
        if (formData.name.length < 20 || formData.name.length > 60) {
            newErrors.name = "Name must be between 20 and 60 characters";
        }
        if (formData.address.length > 400) {
            newErrors.address = "Address max 400 characters";
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;
        if (!passwordRegex.test(formData.password)) {
            newErrors.password = "Password must be 8-16 chars, 1 uppercase, 1 special char";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError('');
        if (!validate()) return;

        setLoading(true);
        try {
            await api.post('/auth/register', formData);
            navigate('/login');
        } catch (err) {
            setServerError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Create an Account</h2>
                {serverError && <div className="error-msg">{serverError}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
                        {errors.name && <span className="form-error">{errors.name}</span>}
                    </div>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} required />
                        {errors.password && <span className="form-error">{errors.password}</span>}
                    </div>
                    <div className="form-group">
                        <label>Address</label>
                        <textarea name="address" className="form-control" value={formData.address} onChange={handleChange} rows="3"></textarea>
                        {errors.address && <span className="form-error">{errors.address}</span>}
                    </div>
                    <div className="form-group">
                        <label>Register As</label>
                        <select name="role" className="form-control" value={formData.role || 'user'} onChange={handleChange}>
                            <option value="user">Normal User</option>
                            <option value="store_owner">Shop Owner</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                        {loading ? 'Registering...' : 'Sign Up'}
                    </button>
                    <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>
                        Already have an account? <Link to="/login" style={{ color: 'var(--accent-color)' }}>Log in</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;
