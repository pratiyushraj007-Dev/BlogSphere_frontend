import Navbar from "./Navbar";
import { useRef, useState } from "react";
import { useContext } from "react";
import "../css/authentication.css";
import { AuthContext } from "../context/AuthProvider";
import AlertContainer from "./AlertContainer";
const Registration = () => {

    const userCredentials = useContext(AuthContext);
    const [message, setMessage] = useState("sending otp to you registered email address");
    const [spinner, setSpinner] = useState(true)
    const alertContainer = useRef();
    const [inputData, setInputdata] = useState({
        userName: "",
        userEmail: "",
        userPassword: "",
        userConfirmPassword: "",
        userDesc: "",
        userProfile: ""
    })

    const handleChange = (e) => {
        console.log(inputData);
        setInputdata({
            ...inputData,
            [e.target.name]: e.target.value
        })
    }

    const handleInputImage = (e) => {
        const file = e.target.files[0];
        setInputdata(prev => ({
            ...prev,
            userProfile: file
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        alertContainer.current.style.display = "flex";
        const formData = new FormData();
        formData.append("userName", inputData.userName);
        formData.append("userEmail", inputData.userEmail);
        formData.append("userPassword", inputData.userPassword);
        formData.append("userConfirmPassword", inputData.userConfirmPassword);
        formData.append("userDesc", inputData.userDesc);
        formData.append("userProfile", inputData.userProfile);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/validatedUser`, {
                method: "POST",
                credentials: "include",
                body: formData
            })
            const data = await res.json();
            if (data.message === "Verified") {
                window.location.href = "/verify-otp"
            } else {
                setMessage(data.message)
            }
        } catch (error) {
            setMessage("Server error")
        }
        setSpinner(false);
    }
    return (
        <>
            <AlertContainer para={message} ref={alertContainer} isSpinner={spinner} />
            <Navbar />
            <section id="registartionFormContainer">
                {userCredentials?.BlogSphereToken ?
                    <p>You are Logged in</p> :
                    <form action="" id="userForm" onSubmit={handleSubmit} encType="multipart/form-data">
                        <p style={{ textAlign: "center", marginBottom: "30px", fontSize: "1.8rem", color: "#fca311" }}>Create an account and start sharing your ideas with the world.</p>
                        <label htmlFor="userName">Name:</label>
                        <input type="text" name="userName" id="userName" value={inputData.userName} required={true} onChange={handleChange} />
                        <label htmlFor="userEmail">Email:</label>
                        <input type="email" name="userEmail" id="userEmail" value={inputData.userEmail} required={true} onChange={handleChange} />
                        <label htmlFor="userImage" style={{ marginTop: "10px" }}>Upload Image for profile: (OPTIONAL)</label>
                        <input type="file" name="userImage" id="userImage" style={{ marginBottom: "10px", color: "#ffffff" }} onChange={handleInputImage} accept="image/*" />
                        <label htmlFor="userPassword">Password:</label>
                        <input type="password" name="userPassword" id="userPassword" value={inputData.userPassword} required={true} onChange={handleChange} />
                        <label htmlFor="userConfirmPassword">Confirm Password:  </label>
                        <input type="password" name="userConfirmPassword" id="userConfirmPassword" value={inputData.userConfirmPassword} required={true} onChange={handleChange} />
                        <label htmlFor="userDesc">Write something about yourself:  (OPTIONAL)</label>
                        <textarea name="userDesc" id="userDesc" cols="30" rows="10" value={inputData.userDesc} onChange={handleChange}></textarea>
                        <div className="formBtn">
                            <input type="submit" value="Submit" />
                            <input type="reset" value="Reset" />
                        </div>
                    </form>}
            </section>

        </>
    )
}
export default Registration;