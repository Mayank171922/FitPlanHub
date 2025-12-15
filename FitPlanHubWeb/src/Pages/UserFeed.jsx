import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import feedService from '../services/feedService';
import PlanCard from '../components/PlanCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const UserFeed = () => {
    const navigate = useNavigate();
    const [feed, setFeed] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchFeed();
    }, []);

    const fetchFeed = async () => {
        try {
            setLoading(true);
            const data = await feedService.getPersonalizedFeed();
            setFeed(data);
            setError(null);
        } catch (err) {
            setError('Failed to load your feed.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loading message="Loading your personalized feed..." />;
    if (error) return <ErrorMessage message={error} onRetry={fetchFeed} />;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">
                        My Feed 📰
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Plans from trainers you follow
                    </p>
                </div>

                {feed && feed.feedItems && feed.feedItems.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                        <div className="text-6xl mb-4">🏋️</div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-3">
                            Your feed is empty
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Start following trainers to see their plans in your feed!
                        </p>
                        <button
                            onClick={() => navigate('/trainers')}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-8 rounded-lg transition"
                        >
                            Find Trainers
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="mb-6 text-gray-600">
                            Showing {feed?.totalItems || 0} plans
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {feed?.feedItems.map(item => (
                                <PlanCard
                                    key={item.planId}
                                    plan={{
                                        id: item.planId,
                                        title: item.planTitle,
                                        price: item.planPrice,
                                        trainerName: item.trainerName,
                                        trainerId: item.trainerId,
                                        description: item.description,
                                        duration: item.duration,
                                        isSubscribed: item.isSubscribed
                                    }}
                                    showFullDetails={item.isSubscribed}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default UserFeed;