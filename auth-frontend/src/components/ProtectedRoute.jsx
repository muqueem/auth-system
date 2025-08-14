import { Navigate } from "react-router-dom"
import { verifyUser } from "../api/auth";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children }) => {
    const [isVerified, setIsVerified] = useState(null);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const checkAuth = async () => {
            if (!token) {
                setIsVerified(false);
                return;
            }
            try {
                const res = await verifyUser(token);
                setIsVerified(res.isUserLoggedIn);
            } catch (err) {
                setIsVerified(false);
            }
        };

        checkAuth();
    }, [token]);

    if (isVerified === null) return <p>Loading...</p>;
    return isVerified ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
