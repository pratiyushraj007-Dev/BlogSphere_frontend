import { useEffect, useState } from "react";
import "../css/authentication.css";
const VerifyOtp = () => {
    const [isAuthorized,setAuthorized]=useState(true);
    const [otp,setOtp]=useState('');
    useEffect(() => {
        const verify = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/verify/otpSession`, {
                    method: "GET",
                    credentials: "include"
                })
                const data = await res.json();
                if (data.message === "Unverified" && !res.ok) {
                    setAuthorized(false);
                }
            } catch (error) {
                console.log(error)
                setAuthorized(false)
            }
        }
        verify();
    }, [])

    const handleChange=(e)=>{
        setOtp(e.target.value);
    }

    const handleSubmit=async(e)=>{
        e.preventDefault();
        try {
            const res=await fetch("http://localhost:5000/api/auth/register",{
                method:"POST",
                credentials:"include",
                headers: {
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({otp})
            })
            const data=await res.json();
            alert(data.message)
            if(data.message==="You are registered"){
                window.location.href="/login"
            }
        } catch (error) {
            console.log(error)
            alert("server error")
        }
    }

    return (
       <>
         {isAuthorized ?
             <section id="otpFormContainer" onSubmit={handleSubmit}>
            <form action="" id="otpForm">
                <label htmlFor="userOtp">Enter your 6-digit OTP sent to your registered email</label>
                <input type="number" name="userOtp" id="userOtp" value={otp} autoComplete="off" onChange={handleChange} />
                <div className="formBtn">
                    <input type="submit" value="Submit"  />
                </div>
            </form>
        </section>:<p>unauthorised</p>}
       </>
    )
}
export default VerifyOtp;