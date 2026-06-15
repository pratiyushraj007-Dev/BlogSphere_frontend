import { useEffect } from "react";
import { createContext, useState } from "react";

const AuthContext = createContext();
const AuthProvider = ({ children }) => {
    const [credentials, setCredentials] = useState(null);
    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/verify/token`, {
                    method: "GET",
                    credentials: "include"
                })
                const data = await res.json();
                if (data.message === "userCredentials") {
                    setCredentials({ BlogSphereToken: data.BlogSphereToken });
                }
            } catch (error) {
                setCredentials(null)
            }
        }
        getUser()
    }, []);
    return (
        <AuthContext.Provider value={credentials}>
            {children}
        </AuthContext.Provider>
    )
}
export { AuthContext, AuthProvider };