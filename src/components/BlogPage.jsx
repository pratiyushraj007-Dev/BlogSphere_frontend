import { useParams } from "react-router-dom";
import "../css/blogPage.css";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Highlight from "@tiptap/extension-highlight";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import { useEffect } from "react";
import { useState,useRef } from "react";
import { useNavigate } from "react-router-dom";
import AlertContainer from "./AlertContainer";


const BlogPage = () => {
    const [blogInfo, setBlogInfo] = useState();
    const [message, setMessage] = useState("Please wait while we process your request.");
    const [spinner, setSpinner] = useState(true);
    const alertContainer = useRef();
    const navigate = useNavigate();
    const editor = useEditor({
        extensions: [
            StarterKit,
            Image,
            Highlight,
            Subscript,
            Superscript,
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
        ],
        editable: false,
        content: blogInfo?.blog_desc || "",
    });
    const { BlogID } = useParams();
    useEffect(() => {
        const getBlog = async () => {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/blogApi/blog/${BlogID}`, {
                method: "GET"
            })
            const data = await res.json();
            setBlogInfo({
                authorName: data.authorName,
                authorEmail: data.authorEmail,
                blog_title: data.blog_title,
                blog_desc: data.blog_desc,
                blog_summary: data.blog_summary,
                blog_id: data.blog_id,
                like: data.like
            })
            editor.commands.setContent(data.blog_desc)
        }
        getBlog();
    }, [editor])

    const handleShare = async () => {
        const url = window.location.href;
        if (navigator.share) {
            await navigator.share({
                title: document.title,
                url: url
            })
        } else {
            await navigator.clipboard.writeText(url);
            alert("Link Copied")
        }
    }

    const handleBookMark = async () => {
        const title = blogInfo.blog_title;
        const summary = blogInfo.blog_summary;
        const author = blogInfo.authorName;
        const blog_id = blogInfo.blog_id;
        alertContainer.current.style.display="flex";
        const res = await fetch(`${import.meta.env.VITE_API_URL}/blogApi/toBookmark`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({ title, summary, author, blog_id })
        })
        const data = await res.json();
        setMessage(data.message);
        setSpinner(false);
    }

    return (
        <>
            <AlertContainer isSpinner={spinner} para={message} ref={alertContainer} />
            <div className="blogPageContainer">
                <button className="previousButton" onClick={() => navigate(-1)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-left-icon lucide-chevron-left"><path d="m15 18-6-6 6-6" /></svg>
                </button>
                {blogInfo ? <>
                    <div className="blogInfoContainer">
                        <div className="blogInfoTitle">
                            <p>{blogInfo.blog_title}</p>
                            <div className="authorInfo">
                                <p>Author Name:<span>{blogInfo.authorName}</span></p>
                                <p>Author Email:<span>{blogInfo.authorEmail}</span></p>
                            </div>
                        </div>
                        <div className="blogButton">
                            <button id="shareBtn" onClick={handleShare}>
                                Share <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-forward-icon lucide-forward"><path d="m15 17 5-5-5-5" /><path d="M4 18v-2a4 4 0 0 1 4-4h12" /></svg>
                            </button>
                            <button id="downloadBtn" onClick={() => window.print()}>
                                Download <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-download-icon lucide-download"><path d="M12 15V3" /><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="m7 10 5 5 5-5" /></svg>
                            </button>
                            <button id="bookmarkBtn" onClick={handleBookMark}>
                                Bookmark <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bookmark-icon lucide-bookmark"><path d="M17 3a2 2 0 0 1 2 2v15a1 1 0 0 1-1.496.868l-4.512-2.578a2 2 0 0 0-1.984 0l-4.512 2.578A1 1 0 0 1 5 20V5a2 2 0 0 1 2-2z" /></svg>
                            </button>
                        </div>
                        <div className="blogContent">
                            <EditorContent editor={editor} />
                        </div>
                    </div>
                </> : <></>}
            </div>
        </>
    )
}
export default BlogPage;