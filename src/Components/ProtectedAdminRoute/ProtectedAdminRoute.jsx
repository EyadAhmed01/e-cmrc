import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../../Context/UserContext';

export default function ProtectedAdminRoute({ children }) {
    const { token, isAdmin, isLoading } = useContext(UserContext);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg text-gray-400 animate-pulse">Loading...</div>
            </div>
        );
    }

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (!isAdmin) {
        return <Navigate to="/home" replace />;
    }

    return children;
}
