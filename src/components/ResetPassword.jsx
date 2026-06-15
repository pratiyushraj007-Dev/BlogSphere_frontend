import { useRef ,useState} from "react";
import { useParams } from "react-router-dom"
import AlertContainer from "./AlertContainer";
const ResetPassword = () => {
    const [message,setMessage]=useState("Please wait while we process your request.");
    const [spinner,setSpinner]=useState(true);
    const alertContainer=useRef();
    const {ID}=useParams();
    const [email,token]=ID.split("-");
    const newPassword=useRef();
    const confirmNewPassword=useRef();

    const handleSubmit=async(e)=>{
        e.preventDefault();
        const password=newPassword.current.value;
        const confirmPassword=confirmNewPassword.current.value;
        alertContainer.current.style.display="flex";
        const res=await fetch(`${import.meta.env.VITE_API_URL}/api/auth/resetPassword`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({email,password,confirmPassword,token})
        })
        const data=await res.json();
        setMessage(data.message);
        setSpinner(false);
        if(data.message==="Password Changed Successfully"){
            window.location.href="/login"
        }

    }

    return (
        <>
         <AlertContainer para={message} isSpinner={spinner} ref={alertContainer}/>
            <section id="resetContainer">
                <form action="" id="userForm" onSubmit={handleSubmit}>
                    <p style={{ textAlign: "center", marginBottom: "30px", fontSize: "1.8rem", color: "#fca311" }}>Enter Your new Password.</p>
                    <label htmlFor="userPassword">New Password:</label>
                    <input type="password" name="userPassword" id="userPassword" required="true" ref={newPassword}/>
                    <label htmlFor="userPassword">Confirm Password:</label>
                    <input type="password" name="userConfirmPassword" id="userConfirmPassword" required="true" ref={confirmNewPassword}/>
                    <div className="formBtn">
                        <input type="submit" value="Submit" />
                    </div>
                </form>
            </section>
        </>
    )
}
export default ResetPassword