mport React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout, isTrainer } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    FitPlanHub
                </Link>

                <ul className="navbar-menu">
                    <li className="navbar-item">
                        <Link to="/" className="navbar-link">Home</Link>
                    </li>

                    {user ? (
                        <>
                            {isTrainer() ? (
                                <li className="navbar-item">
                                    <Link to="/trainer/dashboard" className="navbar-link">
                                        Dashboard
                                    </Link>
                                </li>
                            ) : (
                                <>
                                    <li className="navbar-item">
                                        <Link to="/feed" className="navbar-link">My Feed</Link>
                                    </li>
                                    <li className="navbar-item">
                                        <Link to="/subscriptions" className="navbar-link">
                                            My Subscriptions
                                        </Link>
                                    </li>
                                    <li className="navbar-item">
                                        <Link to="/trainers" className="navbar-link">
                                            Trainers
                                        </Link>
                                    </li>
                                </>
                            )}

                            <li className="navbar-item">
                                <span className="navbar-user">
                                    Hello, {user.fullName}
                                </span>
                            </li>
                            <li className="navbar-item">
                                <button onClick={handleLogout} className="navbar-button">
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="navbar-item">
                                <Link to="/login" className="navbar-link">Login</Link>
                            </li>
                            <li className="navbar-item">
                                <Link to="/signup" className="navbar-link">Sign Up</Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;