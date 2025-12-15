import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import trainerService from '../services/trainerService';
import planService from '../services/planService';
import PlanCard from '../components/PlanCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const TrainerProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isUser } = useAuth();

    const [trainer, setTrainer] = useState(null);
    const [plans, setPlans] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchTrainerProfile();
        fetchTrainerPlans();
        if (isUser()) {
            checkFollowStatus();
        }
    }, [id]);

    const fetchTrainerProfile = async () => {
        try {
            const data = await trainerService.getTrainerProfile(id);
            setTrainer(data);
        } catch (err) {
            setError('Failed to load trainer profile.');
        }
    };

    const fetchTrainerPlans = async () => {
        try {
            const data = await planService.getPlansByTrainer(id);
            setPlans(data);
        } catch (err) {
            console.error('Error fetching trainer plans:', err);
        } finally {
            setLoading(false);
        }
    };

    const checkFollowStatus = async () => {
        try {
            const response = await trainerService.checkIfFollowing(id);
            setIsFollowing(response.isFollowing);
        } catch (err) {
            console.error('Error checking follow status:', err);
        }
    };

    const handleFollowToggle = async () => {
        try {
            if (isFollowing) {
                await trainerService.unfollowTrainer(id);
                setIsFollowing(false);
                alert('Unfollowed trainer');
            } else {
                await trainerService.followTrainer(id);
                setIsFollowing(true);
                alert('Now following trainer');
            }
            fetchTrainerProfile();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update follow status');
        }
    };

    if (loading) return <Loading message="Loading trainer profile..." />;
    if (error) return <ErrorMessage message={error} />;
    if (!trainer) return <ErrorMessage message="Trainer not found" />;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Profile Header */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center text-5xl font-bold flex-shrink-0">
                            {trainer.fullName.charAt(0)}
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-4xl font-bold text-gray-800 mb-2">
                                {trainer.fullName}
                            </h1>
                            <p className="text-gray-600 mb-4">
                                {trainer.email}
                            </p>
                            <div className="flex flex-wrap gap-4 text-gray-600 justify-center md:justify-start mb-4">
                                <span className="flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
                                    </svg>
                                    {trainer.totalPlans} Plans
                                </span>
                                <span className="flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                                    </svg>
                                    {trainer.followers} Followers
                                </span>
                            </div>
                            {isUser() && (
                                <button
                                    onClick={handleFollowToggle}
                                    className={`font-medium py-3 px-8 rounded-lg transition ${
                                        isFollowing
                                            ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                            : 'bg-green-500 hover:bg-green-600 text-white'
                                    }`}
                                >
                                    {isFollowing ? 'Unfollow' : 'Follow'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Fitness Plans */}
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">
                        Fitness Plans
                    </h2>

                    {plans.length === 0 ? (
                        <div className="bg-white rounded-xl p-12 text-center">
                            <p className="text-gray-600 text-lg">
                                This trainer hasn't created any plans yet.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {plans.map(plan => (
                                <PlanCard key={plan.id} plan={plan} />
                            ))}
                        </div>
                    )}
                </div>

                <button
                    onClick={() => navigate(-1)}
                    className="mt-8 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-6 rounded-lg transition"
                >
                    ← Back
                </button>
            </div>
        </div>
    );
};

export default TrainerProfile;