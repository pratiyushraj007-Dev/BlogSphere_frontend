import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import "../css/blog.css";

const Blog = () => {
    const [blogArray, setBlogArray] = useState();
    const navigate=useNavigate();
    useEffect(() => {
        const seeBlogs = async () => {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/blogApi/seeBlogs`, {
                method: "GET",
                credentials: "include"
            })
            const data = await res.json();
            if (data.message === "success") {
                setBlogArray(data.blogArray);
            } else {
                alert(data.message)
            }
        }
        seeBlogs();
    }, [])

    const handleBlogBtn=(e)=>{
        const navLink=e.target.dataset.id;
        navigate(`/blog/${navLink}`)
    }

    return (
        <>
            <Navbar />
            <section className="blogSection">
                <p className="blogSectionIntro">Recent Blogs</p>
                <div className="blogContainer">
                    {blogArray?.map((value, index) => {
                        return (
                            <div className="blogCard" key={index}>
                                <div className="blogContent">
                                    <p className="blogTitle">{value.blog_title}</p>
                                    <p className="blogDesc">{value.blog_summary}</p>
                                </div>
                                <div className="blogFeatures">
                                    <p className="blogAuthor">Author : <span>{value.authorName}</span></p>
                                </div>
                                <div className="viewButton" >
                                    <button onClick={handleBlogBtn} data-id={value.blog_link}>VIEW</button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </section>
        </>
    )
}

export default Blog;