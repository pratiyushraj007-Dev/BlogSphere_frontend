import Navbar from "./Navbar";
import { Link, useNavigate } from "react-router-dom";
import "../css/dashboard.css";
import { useContext, useRef } from "react";
import { useState,useEffect } from "react";
import { UserContext } from "../context/UserDetails";
import AlertContainer from "./AlertContainer";
const DashBoard = () => {
    const [message,setMessage]=useState("Please wait while we process your request.");
    const [spinner,setSpinner]=useState(true);
    const [userBlogs,setUserBlogs]=useState(null);
    const [userBookmarked,setUserBookmarked]=useState(null);
    const [activeTab,setActiveTab]=useState("blogs");
    const navigate=useNavigate();
    const userInfo = useContext(UserContext);
    const alertContainer=useRef();
    const userDescriptionContainer = useRef();
    const userDescBtn = useRef();
    const [editable, setEditable] = useState(false);
    const [image,setImage]=useState(null);
    const userProfileRef=useRef();
    const previewBtnRef=useRef();
    const imageInputRef=useRef();

    const handleEdit = async () => {
        if (editable) {
            userDescBtn.current.textContent = "Edit";
            userDescriptionContainer.current.style.border = "0px ";
            setEditable(false);
            const descInfo = {
                email: userInfo.email,
                desc: userDescriptionContainer.current.textContent
            }
            alertContainer.current.style.display="flex";
            const res = await fetch(`${import.meta.env.VITE_API_URL}/blogApi/updateDesc`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(descInfo)
            })
            const data = await res.json();
            setMessage(data.message);
            setSpinner(false);
        } else {
            userDescBtn.current.textContent = "Done"
            userDescriptionContainer.current.style.border = "2px solid #ffffff";
            setEditable(true)
        }
    }

    const handleImageUpload=(e)=>{
        setImage(e.target.files[0])
        const previewLink=URL.createObjectURL(e.target.files[0]);
        previewBtnRef.current.style.display="block";
        userProfileRef.current.setAttribute("src",previewLink);
    }

    const handlePreview=()=>{
        previewBtnRef.current.style.display="none";
        imageInputRef.current.value="";
        userProfileRef.current.setAttribute("src",userInfo.profile);
    }

    const handleImageSubmit=async(e)=>{
        e.preventDefault();
        const formData=new FormData();
        formData.append("image",image);
        formData.append("userEmail",userInfo.email)
        alertContainer.current.style.display="flex";
        const res=await fetch(`${import.meta.env.VITE_API_URL}/api/auth/setProfile`,{
            method:"POST",
            body:formData,
            credentials:"include"
        })
        const data=await res.json();
        setMessage(data.message);
        setSpinner(false);
    }

    const handleLogout=async()=>{
        alertContainer.current.style.display="flex"
        const res=await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`,{
            method:"POST",
            credentials:"include"
        })
        const data=await res.json();
        if(data.message=="logout"){
            window.location.href="/"
        }
    }

    useEffect(()=>{
        const getUserBlogs=async()=>{
            const res=await fetch(`${import.meta.env.VITE_API_URL}/blogApi/dashBoard/userBlog`,{
                method:"GET",
                credentials:"include"
            })
            const data=await res.json();
            setUserBlogs(data.message=="retrieve" ? data.blog : []);
        }
        const getUserBookMark=async()=>{
            const res=await fetch(`${import.meta.env.VITE_API_URL}/blogApi/dashboard/bookmark`,{
                method:"GET",
                credentials:"include"
            })
            const data=await res.json();
            console.log(data)
            setUserBookmarked(data.message=="retrieve" ? data.blog : []);
        }
        getUserBlogs();
        getUserBookMark();
    },[])

    return (
        <>
            {userInfo?<>
                <Navbar />
            <AlertContainer isSpinner={spinner} para={message} ref={alertContainer}/>
            <section className="userProfileContainer">
                <div className="userProfileImage">
                    {userInfo? <img src={userInfo.profile} ref={userProfileRef}/>:<></>}
                    <button id="previewBtn" ref={previewBtnRef} onClick={handlePreview}>Cancel</button>
                    <form action="" encType="multipart/form-data" id="imageForm" onSubmit={handleImageSubmit}>
                        <input type="file" name="image" id="userProfile" onChange={handleImageUpload} ref={imageInputRef} />
                        <input type="submit" value="Submit" id="imageSubmitBtn" />
                    </form>
                </div>
                <div className="userProfile">
                    <p className="UserNamePara">Name: <span className="userName">{userInfo ? userInfo.name : <></>}</span></p>
                    <p className="userEmail">Email: <span className="userEmail">{userInfo ? userInfo.email : <></>}</span></p>
                    <p className="userDescriptionPara">Bio: <button onClick={handleEdit}>
                        <svg width="15px" height="15px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20.9888 4.28491L19.6405 2.93089C18.4045 1.6897 16.4944 1.6897 15.2584 2.93089L13.0112 5.30042L18.7416 11.055L21.1011 8.68547C21.6629 8.1213 22 7.33145 22 6.54161C22 5.75176 21.5506 4.84908 20.9888 4.28491Z" fill="#030D45" />
                            <path d="M16.2697 10.9422L11.7753 6.42877L2.89888 15.3427C2.33708 15.9069 2 16.6968 2 17.5994V21.0973C2 21.5487 2.33708 22 2.89888 22H6.49438C7.2809 22 8.06742 21.6615 8.74157 21.0973L17.618 12.1834L16.2697 10.9422Z" fill="#030D45" />
                        </svg>
                        <span ref={userDescBtn}>
                            Edit
                        </span>
                    </button></p>
                    <div className="userDescriptionContainer" ref={userDescriptionContainer} contentEditable={editable} suppressContentEditableWarning>
                        {userInfo ? userInfo.desc : <></>}
                    </div>
                    <div className="dashboardButtonsContainer">
                        <button className="postButton">
                            <Link to="/post">Create</Link>
                        </button>
                        <button className="seeButton">
                            <Link to="/blog">Explore</Link>
                        </button>
                        <button className="logoutButton" onClick={handleLogout}>
                            <Link to="/logout">Logout</Link>
                        </button>
                    </div>
                </div>
            </section>
            <section className="userActivity">
                <div className="userActivityInfo">
                    <div className="userActivityBtn">
                        <button
                            className={activeTab==="blogs" ? "activityTabActive" : ""}
                            onClick={()=>setActiveTab("blogs")}
                        >Your Blogs</button>
                        <button
                            className={activeTab==="bookmarks" ? "activityTabActive" : ""}
                            onClick={()=>setActiveTab("bookmarks")}
                        >Bookmark Blogs</button>
                    </div>
                    <div className="userActivityBlogList">
                        {(activeTab==="blogs" ? userBlogs : userBookmarked)?.length === 0 && (
                            <p className="noActivityMsg">
                                {activeTab==="blogs" ? "You haven't published any blogs yet." : "No bookmarked blogs found."}
                            </p>
                        )}
                        {(activeTab==="blogs" ? userBlogs : userBookmarked)?.map((value,index)=>(
                            <div className="blogCard" key={index}>
                                <div className="blogContent">
                                    <p className="blogTitle">{value.title}</p>
                                    <p className="blogDesc">{value.summary}</p>
                                </div>
                                <div className="viewButton">
                                    <button onClick={()=>navigate(`/blog/${value.blog_id}-${value.title}`)}>VIEW</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            </>:<>
             <p style={{textAlign:"center",fontSize:"2rem",marginTop:"40px"}}>Please Login to get access</p>
            </>}
        </>
    )
}
export default DashBoard;