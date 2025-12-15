import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PlanDetails from './pages/PlanDetails';
import UserFeed from './pages/UserFeed';
import MySubscriptions from './pages/MySubscriptions';
import TrainersList from './pages/TrainersList';
import TrainerProfile from './pages/TrainerProfile';
import TrainerDashboard from './pages/TrainerDashboard';

function App() {
    return (
        <Router>
            <AuthProvider>
                <div className="min-h-screen bg-gray-50">
                    <Navbar />
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Landing />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />

                        {/* Protected Routes */}
                        <Route
                            path="/plans/:id"
                            element={
                                <PrivateRoute>
                                    <PlanDetails />
                                </PrivateRoute>
                            }
                        />

                        {/* User Routes */}
                        <Route
                            path="/feed"
                            element={
                                <PrivateRoute requiredRole="USER">
                                    <UserFeed />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/subscriptions"
                            element={
                                <PrivateRoute requiredRole="USER">
                                    <MySubscriptions />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/trainers"
                            element={
                                <PrivateRoute requiredRole="USER">
                                    <TrainersList />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/trainers/:id"
                            element={
                                <PrivateRoute requiredRole="USER">
                                    <TrainerProfile />
                                </PrivateRoute>
                            }
                        />

                        {/* Trainer Routes */}
                        <Route
                            path="/trainer/dashboard"
                            element={
                                <PrivateRoute requiredRole="TRAINER">
                                    <TrainerDashboard />
                                </PrivateRoute>
                            }
                        />

                        {/* 404 */}
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;