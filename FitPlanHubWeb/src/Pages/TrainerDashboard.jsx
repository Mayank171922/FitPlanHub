mport React, { useState, useEffect } from 'react';
import planService from '../services/planService';
import Modal from '../components/Modal';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const TrainerDashboard = () => {
    const [plans, setPlans] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        duration: ''
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [plansData, statsData] = await Promise.all([
                planService.getTrainerPlans(),
                planService.getTrainerStats()
            ]);
            setPlans(plansData);
            setStats(statsData);
            setError(null);
        } catch (err) {
            setError('Failed to load dashboard data.');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (plan = null) => {
        if (plan) {
            setEditingPlan(plan);
            setFormData({
                title: plan.title,
                description: plan.description,
                price: plan.price,
                duration: plan.duration
            });
        } else {
            setEditingPlan(null);
            setFormData({ title: '', description: '', price: '', duration: '' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingPlan(null);
        setFormData({ title: '', description: '', price: '', duration: '' });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingPlan) {
                await planService.updatePlan(editingPlan.id, formData);
                alert('Plan updated successfully!');
            } else {
                await planService.createPlan(formData);
                alert('Plan created successfully!');
            }
            handleCloseModal();
            fetchDashboardData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to save plan.');
        }
    };

    const handleDelete = async (planId) => {
        if (!window.confirm('Are you sure you want to delete this plan?')) return;
        try {
            await planService.deletePlan(planId);
            alert('Plan deleted successfully!');
            fetchDashboardData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete plan.');
        }
    };

    if (loading) return <Loading message="Loading your dashboard..." />;
    if (error) return <ErrorMessage message={error} onRetry={fetchDashboardData} />;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <h1 className="text-4xl font-bold text-gray-800">
                        Trainer Dashboard 💪
                    </h1>
                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-3 px-6 rounded-lg transition transform hover:scale-105 shadow-lg"
                    >
                        + Create New Plan
                    </button>
                </div>

                {/* Stats Cards */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg p-6">
                            <div className="text-5xl font-bold mb-2">{stats.totalPlans}</div>
                            <div className="text-blue-100 text-lg">Total Plans</div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl shadow-lg p-6">
                            <div className="text-5xl font-bold mb-2">{stats.totalFollowers}</div>
                            <div className="text-purple-100 text-lg">Followers</div>
                        </div>
                        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-lg p-6">
                            <div className="text-5xl font-bold mb-2">{stats.totalSubscriptions}</div>
                            <div className="text-green-100 text-lg">Active Subscriptions</div>
                        </div>
                    </div>
                )}

                {/* Plans List */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-800">My Plans</h2>
                    </div>

                    {plans.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="text-6xl mb-4">📝</div>
                            <p className="text-xl text-gray-600 mb-6">
                                You haven't created any plans yet.
                            </p>
                            <button
                                onClick={() => handleOpenModal()}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-8 rounded-lg transition"
                            >
                                Create Your First Plan
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Title</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Price</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Duration</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Created</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                {plans.map(plan => (
                                    <tr key={plan.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-800 max-w-xs truncate">
                                                {plan.title}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            ${plan.price}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {plan.duration} days
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {new Date(plan.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleOpenModal(plan)}
                                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(plan.id)}
                                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Modal */}
                <Modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    title={editingPlan ? 'Edit Plan' : 'Create New Plan'}
                >
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Plan Title *
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                placeholder="e.g., Fat Loss Beginner Plan"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description *
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                rows="4"
                                placeholder="Describe your fitness plan..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Price ($) *
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    step="0.01"
                                    placeholder="49.99"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Duration (days) *
                                </label>
                                <input
                                    type="number"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    required
                                    min="1"
                                    placeholder="30"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 justify-end pt-4">
                            <button
                                type="button"
                                onClick={handleCloseModal}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-6 rounded-lg transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-2 px-6 rounded-lg transition"
                            >
                                {editingPlan ? 'Update Plan' : 'Create Plan'}
                            </button>
                        </div>
                    </form>
                </Modal>
            </div>
        </div>
    );
};

export default TrainerDashboard;
