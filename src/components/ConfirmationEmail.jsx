import { useRef,useState } from "react";
import AlertContainer from "./AlertContainer";

const ConfirmationEmail = () => {
    const [message, setMessage] = useState("Please wait while we process your request.");
    const [spinner, setSpinner] = useState(true);
    const alertContainer = useRef();
    const email = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const emailValue = email.current.value;
        alertContainer.current.style.display="flex";
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/confirmEmail`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ emailValue })
        })
        const data = await res.json();
        setMessage(data.message);
        setSpinner(false);
    }

    return (
        <>
            <AlertContainer para={message} isSpinner={spinner} ref={alertContainer} />
            <section id="confirmationContainer">
                <form action="" id="userForm" onSubmit={handleSubmit}>
                    <p style={{ textAlign: "center", marginBottom: "30px", fontSize: "1.8rem", color: "#fca311" }}>Enter your registered Email.</p>
                    <label htmlFor="userEmail" >Email:</label>
                    <input type="email" name="userEmail" id="userEmail" required="true" ref={email} />
                    <div className="formBtn">
                        <input type="submit" value="Submit" />
                    </div>
                </form>
            </section>
        </>
    )
}

export default ConfirmationEmail;