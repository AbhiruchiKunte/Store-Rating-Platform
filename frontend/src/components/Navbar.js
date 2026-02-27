import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">Store Rating Platform</Link>

            <div className="navbar-links">
                {user ? (
                    <>
                        <span className="navbar-user">
                            Welcome, {user.name}
                            <span className={`badge badge-${user.role === 'store_owner' ? 'owner' : user.role}`}>
                                {user.role === 'store_owner' ? 'Owner' : user.role}
                            </span>
                        </span>

                        {user.role === 'admin' && (
                            <>
                                <Link to="/admin" className="navbar-link">Dashboard</Link>
                            </>
                        )}
                        {user.role === 'store_owner' && (
                            <>
                                <Link to="/owner" className="navbar-link">My Store</Link>
                            </>
                        )}
                        {user.role === 'user' && (
                            <>
                                <Link to="/user/stores" className="navbar-link">Stores</Link>
                            </>
                        )}

                        <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="navbar-link">Login</Link>
                        <Link to="/signup" className="navbar-link">Sign Up</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
