import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import planService from '../services/planService';
import PlanCard from '../components/PlanCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import './Landing.css';

const Landing = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            setLoading(true);
            const data = await planService.getAllPlansPreview();
            setPlans(data);
            setError(null);
        } catch (err) {
            setError('Failed to load plans. Please try again.');
            console.error('Error fetching plans:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loading message="Loading fitness plans..." />;
    }

    if (error) {
        return <ErrorMessage message={error} onRetry={fetchPlans} />;
    }

    return (
        <div className="landing-container">
            <section className="hero-section">
                <h1 className="hero-title">Welcome to FitPlanHub</h1>
                <p className="hero-subtitle">
                    Discover fitness plans from certified trainers
                </p>
                {!user && (
                    <div className="hero-buttons">
                        <button
                            onClick={() => navigate('/signup')}
                            className="btn-hero-primary"
                        >
                            Get Started
                        </button>
                        <button
                            onClick={() => navigate('/login')}
                            className="btn-hero-secondary"
                        >
                            Login
                        </button>
                    </div>
                )}
            </section>

            <section className="plans-section">
                <h2 className="section-title">Available Fitness Plans</h2>

                {plans.length === 0 ? (
                    <div className="empty-state">
                        <p>No fitness plans available yet.</p>
                        <p>Check back soon for new plans!</p>
                    </div>
                ) : (
                    <div className="plans-grid">
                        {plans.map(plan => (
                            <PlanCard key={plan.id} plan={plan} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Landing;