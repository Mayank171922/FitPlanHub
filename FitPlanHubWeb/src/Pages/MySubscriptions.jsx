import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import subscriptionService from '../services/subscriptionService';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const MySubscriptions = () => {
    const navigate = useNavigate();
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const fetchSubscriptions = async () => {
        try {
            setLoading(true);
            const data = await subscriptionService.getMySubscriptions();
            setSubscriptions(data);
            setError(null);
        } catch (err) {
            setError('Failed to load subscriptions.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelSubscription = async (subscriptionId) => {
        if (!window.confirm('Are you sure you want to cancel this subscription?')) {
            return;
        }

        try {
            await subscriptionService.cancelSubscription(subscriptionId);
            alert('Subscription cancelled successfully');
            fetchSubscriptions();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to cancel subscription');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) return <Loading message="Loading your subscriptions..." />;
    if (error) return <ErrorMessage message={error} onRetry={fetchSubscriptions} />;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-800 mb-8">
                    My Subscriptions
                </h1>

                {subscriptions.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                        <div className="text-6xl mb-4">📋</div>
                        <p className="text-xl text-gray-600 mb-6">
                            You haven't subscribed to any plans yet.
                        </p>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-8 rounded-lg transition"
                        >
                            Browse Plans
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {subscriptions.map(sub => (
                            <div key={sub.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6">
                                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-2xl font-bold text-gray-800">
                                                {sub.planTitle}
                                            </h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                sub.isActive
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {sub.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>

                                        <p className="text-gray-600 mb-4">
                                            by {sub.trainerName}
                                        </p>

                                        <div className="space-y-1 text-sm text-gray-600">
                                            <p>
                                                <span className="font-semibold">Subscribed:</span> {formatDate(sub.purchaseDate)}
                                            </p>
                                            {sub.expiryDate && (
                                                <p>
                                                    <span className="font-semibold">Expires:</span> {formatDate(sub.expiryDate)}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex gap-2 w-full sm:w-auto">
                                        <button
                                            onClick={() => navigate(`/plans/${sub.planId}`)}
                                            className="flex-1 sm:flex-none bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition"
                                        >
                                            View Plan
                                        </button>
                                        {sub.isActive && (
                                            <button
                                                onClick={() => handleCancelSubscription(sub.id)}
                                                className="flex-1 sm:flex-none bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MySubscriptions;