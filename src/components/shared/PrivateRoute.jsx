import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ publicPage = false, adminOnly = false, staffOnly = false }) => {
    const { user } = useSelector((state) => state.auth);

    if (publicPage) {
        if (!user) return <Outlet />
        return user.role === "ROLE_ADMIN" ? <Navigate to="/admin" /> : <Navigate to="/" />
    }

    if (!user) {
        return <Navigate to="/signin" />
    }

    if (adminOnly) {
        return user.role !== "ROLE_ADMIN" ? <Navigate to="/" /> : <Outlet />
    }

    if (staffOnly) {
        return user.role !== "ROLE_STAFF" ? <Navigate to="/" /> : <Outlet />
    }

    return <Outlet />
}

export default PrivateRoute