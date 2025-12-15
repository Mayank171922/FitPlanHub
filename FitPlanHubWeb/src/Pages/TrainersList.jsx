import React, { useState, useEffect } from 'react';
import trainerService from '../services/trainerService';
import TrainerCard from '../components/TrainerCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const TrainersList = () => {
    const [trainers, setTrainers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchTrainers();
    }, []);

    const fetchTrainers = async () => {
        try {
            setLoading(true);
            const data = await trainerService.getAllTrainers();
            setTrainers(data);
            setError(null);
        } catch (err) {
            setError('Failed to load trainers.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loading message="Loading trainers..." />;
    if (error) return <ErrorMessage message={error} onRetry={fetchTrainers} />;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 mb-3">
                        Certified Trainers 🏆
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Find and follow your favorite fitness trainers
                    </p>
                </div>

                {trainers.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">👨‍🏫</div>
                        <p className="text-xl text-gray-600">
                            No trainers available yet.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {trainers.map(trainer => (
                            <TrainerCard key={trainer.id} trainer={trainer} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrainersList;
