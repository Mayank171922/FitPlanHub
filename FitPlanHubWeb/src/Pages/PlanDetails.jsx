import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import planService from '../services/planService';
import subscriptionService from '../services/subscriptionService';
import trainerService from '../services/trainerService';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const PlanDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isUser } = useAuth();

    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [subscribing, setSubscribing] = useState(false);
    const [following, setFollowing] = useState(false);

    useEffect(() => {
        fetchPlanDetails();
    }, [id]);

    useEffect(() => {
        if (plan && isUser()) {
            checkFollowStatus();
        }
    }, [plan]);

    const fetchPlanDetails = async () => {
        try {
            setLoading(true);
            const data = await planService.getPlanDetails(id);
            setPlan(data);
            setError(null);
        } catch (err) {
            setError('Failed to load plan details.');
        } finally {
            setLoading(false);
        }
    };

    const checkFollowStatus = async () => {
        try {
            if (plan && plan.trainerId) {
                const response = await trainerService.checkIfFollowing(plan.trainerId);
                setFollowing(response.isFollowing);
            }
        } catch (err) {
            console.error('Error checking follow status:', err);
        }
    };

    const handleSubscribe = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        setSubscribing(true);
        try {
            await subscriptionService.subscribe(id);
            alert('Successfully subscribed to the plan!');
            fetchPlanDetails();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to subscribe.');
        } finally {
            setSubscribing(false);
        }
    };

    const handleFollowToggle = async () => {
        try {
            if (following) {
                await trainerService.unfollowTrainer(plan.trainerId);
                setFollowing(false);
                alert('Unfollowed trainer');
            } else {
                await trainerService.followTrainer(plan.trainerId);
                setFollowing(true);
                alert('Now following trainer');
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update follow status');
        }
    };

    if (loading) return <Loading message="Loading plan details..." />;
    if (error) return <ErrorMessage message={error} onRetry={fetchPlanDetails} />;
    if (!plan) return <ErrorMessage message="Plan not found" />;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <h1 className="text-4xl font-bold mb-3">
                                    {plan.title}
                                </h1>
                                <p className="text-indigo-100 text-lg">
                                    by <span className="font-semibold">{plan.trainerName}</span>
                                </p>
                            </div>
                            <div className="text-right">
                                <div className="text-5xl font-bold">${plan.price}</div>
                            </div>
                        </div>

                        {plan.isSubscribed && (
                            <div className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg inline-block">
                                ✓ You are subscribed to this plan
                            </div>
                        )}
                    </div>

                    {/* Body */}
                    <div className="p-8">
                        {plan.description ? (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-3">
                                        Description
                                    </h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        {plan.description}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-3">
                                        Duration
                                    </h3>
                                    <p className="text-gray-700">
                                        <span className="font-semibold text-indigo-600 text-xl">
                                            {plan.duration} days
                                        </span> of comprehensive training
                                    </p>
                                </div>

                                <div className="border-t pt-6">
                                    <h3 className="text-2xl font-bold text-gray-800 mb-3">
                                        About the Trainer
                                    </h3>
                                    <p className="text-gray-700 mb-4">
                                        {plan.trainerName} is a certified fitness trainer helping
                                        people achieve their fitness goals.
                                    </p>
                                    {isUser() && (
                                        <button
                                            onClick={handleFollowToggle}
                                            className={`font-medium py-2 px-6 rounded-lg transition ${
                                                following
                                                    ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                                    : 'bg-green-500 hover:bg-green-600 text-white'
                                            }`}
                                        >
                                            {following ? 'Unfollow Trainer' : 'Follow Trainer'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-8 text-center">
                                <div className="text-5xl mb-4">🔒</div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                                    Subscribe to view full details
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    This plan includes a comprehensive {plan.duration || 30}-day
                                    program from {plan.trainerName}.
                                </p>
                                <div className="text-left max-w-md mx-auto mb-6">
                                    <p className="font-semibold text-gray-800 mb-2">
                                        Subscribe now to access:
                                    </p>
                                    <ul className="space-y-2">
                                        {['Complete plan description', 'Daily workout routines',
                                            'Nutrition guidelines', 'Progress tracking'].map((item, idx) => (
                                            <li key={idx} className="flex items-center text-gray-700">
                                                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50 p-8 flex gap-4">
                        {!plan.isSubscribed && isUser() && (
                            <button
                                onClick={handleSubscribe}
                                disabled={subscribing}
                                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition disabled:opacity-50"
                            >
                                {subscribing ? 'Processing...' : 'Subscribe Now'}
                            </button>
                        )}

                        {!user && (
                            <button
                                onClick={() => navigate('/login')}
                                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition"
                            >
                                Login to Subscribe
                            </button>
                        )}

                        <button
                            onClick={() => navigate(-1)}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-6 rounded-lg transition"
                        >
                            Back
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlanDetails;