import Navbar from "./Navbar";
import "../css/authentication.css";
import { useState ,useRef} from "react";
import { AuthContext } from "../context/AuthProvider";
import { useContext } from "react";
import AlertContainer from "./AlertContainer";
const Login = () => {
    const userCredentials = useContext(AuthContext);
    const [message,setMessage]=useState("Please wait, we're verifying your account...");
    const [spinner,setSpinner]=useState(true);
    const alertContainer=useRef();
    const [formData, setFormData] = useState({
        userEmail: "",
        userPassword: ""
    })

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        alertContainer.current.style.display="flex";
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/loginUser`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })
        const data = await res.json();
        setSpinner(false);
        setMessage(data.message)
        if(data.message=="success"){
            window.location.href="/"
        }
    }

    return (
        <>
        <AlertContainer para={message} isSpinner={spinner} ref={alertContainer}/>
            <Navbar />
            {userCredentials?.BlogSphereToken ?
                <p>You are logged IN</p> :
                <section id="loginFormContainer">
                    <form action="" id="userForm" onSubmit={handleSubmit}>
                        <p style={{textAlign:"center",marginBottom:"30px",fontSize:"1.8rem",color:"#fca311"}}>Welcome back! Sign in to access your dashboard, blogs, and bookmarks.</p>
                        <label htmlFor="userEmail" >Email:</label>
                        <input type="email" name="userEmail" id="userEmail" required="true" onChange={handleChange} />
                        <label htmlFor="userPassword">Password:</label>
                        <input type="password" name="userPassword" id="userPassword" required="true" onChange={handleChange} />
                        <div className="formBtn">
                            <input type="submit" value="Submit" />
                            <input type="reset" value="Reset" />
                        </div>
                    <p className="forgotPara" onClick={()=>window.location.href="/confirmation-email"}><u>Forgot password?</u></p>
                    </form>
                </section>
            }
        </>
    )
}
export default Login;