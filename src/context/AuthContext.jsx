import { jwtDecode } from "jwt-decode";
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");

        if (storedToken) {
        try {
            if (storedToken.split(".").length !== 3) {
                throw new Error("Invalid token format");
            }

            const decoded = jwtDecode(storedToken);

            setToken(storedToken);
            setUser(decoded);

        } catch (error) {
            console.log("Invalid token, clearing...", error.message);

            localStorage.removeItem("token");
            setToken(null);
            setUser(null);
        }
    }

        setLoading(false);
    }, []);

    const login = (token) => {
        try {
            if (token.split(".").length !== 3) {
                throw new Error("Invalid token");
            }

            localStorage.setItem("token", token);
            setToken(token);

            const decoded = jwtDecode(token);
            setUser(decoded);

        } catch (err) {
            console.log("Login token error:", err.message);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value = {{ token, user, login, logout, loading }}>
            { children }
        </AuthContext.Provider>
    )
}