import { forwardRef } from "react";
import BlogSphere from "../assets/BlogSphere.png"
import "../css/alertContainer.css";
const AlertContainer =forwardRef((props,ref)=>{
    return(
         <div className="overlay" ref={ref}>
         <div className="alertContainer">
            <div className="websiteContainer">
                <img src={BlogSphere} alt="" srcset="" width="50px" />
                <p>BlogSphere</p>
            </div>
            <div className="alertPara">
                <p>{props.para}</p>
            </div>
            {props.isSpinner?<div class="spinner"></div>:<></>}
            <div className="alertBtn">
                {props.isSpinner?<></>:<button onClick={()=>window.location.reload()}>OK</button>}
            </div>
        </div>
       </div>
    )
})
export default AlertContainer;