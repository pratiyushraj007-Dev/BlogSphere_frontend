import { useState, useEffect, createContext } from "react";

const UserContext = createContext();
const UserDetails = ({ children }) => {
    const [details, setDetails] = useState();
    useEffect(() => {
        const getUserDetails = async () => {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/verify/currentUser`, {
                method: "GET",
                credentials: "include"
            })
            const data = await res.json();
            if (data.message === "verified") {
                setDetails({
                    name: data.userName,
                    email: data.userEmail,
                    desc: data.userDesc,
                    profile:data.userProfile
                })
            }
        }
        getUserDetails();
    }, [])
    return (
        <UserContext.Provider value={details}>
            {children}
        </UserContext.Provider>
    )
}
export { UserContext, UserDetails }