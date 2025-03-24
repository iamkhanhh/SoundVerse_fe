import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "@/lib/utils";

const AuthContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isArtist, setIsArtist] = useState(false);
    const [role, setRole] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    
    const getCurrentUser = async () => {
        try {
            const response = await fetch(`${apiUrl.baseURL}/auth/me`, {
                method: "GET",
                credentials: "include",
            });
            if (response.ok) {
                const data = await response.json();
                setUser(data);
                setRole(data.role); 
                setIsArtist(data.role === "ARTIST");
                setIsAdmin(data.role === "ADMIN"); 
            } else {
                setUser(null);
                setRole(null);
                setIsArtist(false);
                setIsAdmin(false);

                navigate("/auth");
            }
        } catch (error) {
            console.error("Error fetching user:", error);
            setUser(null);
            setRole(null);
            setIsArtist(false);
            setIsAdmin(false);

            navigate("/auth");
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            const response = await fetch(`${apiUrl.baseURL}/auth/logout`, {
                method: "POST",
                credentials: "include",
            });
            if (response.ok) {
                setUser(null);
                navigate("/auth");
            }
        } catch (error) {
            console.error("Error logout:", error);
            setUser(null);
        }
    };

    useEffect(() => {
        getCurrentUser();
    }, []);

    useEffect(() => {
        if (!loading && user === null) {
            const currentPath = window.location.pathname;
            if (currentPath == "/auth" || currentPath == "/auth/signup") {
                navigate("/auth");
            }
        }
    }, [user, loading, navigate]);    

    return (
        <AuthContext.Provider value={{ user, loading, setUser, getCurrentUser, isArtist, role, isAdmin, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);