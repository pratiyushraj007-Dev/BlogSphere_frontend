import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Subscript from '@tiptap/extension-subscript';
import Highlight from "@tiptap/extension-highlight";
import Superscript from '@tiptap/extension-superscript';
import TextAlign from "@tiptap/extension-text-align";
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import MenuBar from './MenuBar';
import "../css/editor.css";
import { useRef, useState } from 'react';
import AlertContainer from './AlertContainer';

const Editor = () => {
    const [message, setMessage] = useState("Please wait while we process your request.");
    const [spinner, setSpinner] = useState(true);
    const alertContainer = useRef();
    const [tiptapImage, setTipTapImage] = useState([]);
    const blogTitle = useRef();
    const blogSummary = useRef();

    const editor = useEditor({
        extensions: [
            StarterKit,
            Subscript,
            Superscript,
            Highlight,
            Image,
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'editor-link',
                    rel: 'noopener noreferrer',
                    target: '_blank',
                },
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
        ],
        content: '',
    });

    const handlePush = async () => {
        if (!blogTitle.current.value.trim()) {
            alert("Please write blog title")
            return;
        }
        if (!blogSummary.current.value.trim()) {
            alert("please write blog summary")
            return;
        }
        if (editor.isEmpty) {
            alert("Please write blog in editor");
            return;
        }
        alertContainer.current.style.display = "flex";
        const rawContent = editor.getJSON();
        const content = structuredClone(rawContent);

        const imageMap = new Map();

        for (const img of tiptapImage) {
            imageMap.set(img.src, img.imgFile);
        }
        if (content.content) {
            for (const child of content.content) {
                if (child.type === "image") {
                    const file = imageMap.get(child.attrs?.src);
                    if (!file) continue;

                    const formData = new FormData();
                    formData.append("image", file);

                    const res = await fetch(
                        `${import.meta.env.VITE_API_URL}/blogApi/tiptapImage`,
                        {
                            method: "POST",
                            credentials: "include",
                            body: formData
                        }
                    );

                    const data = await res.json();
                    if (data.message === "Image added") {
                        child.attrs.src = data.secure_URL;
                    }
                }
            }
        }
        const res = await fetch(`${import.meta.env.VITE_API_URL}/blogApi/postBlog`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: blogTitle.current.value,
                summary: blogSummary.current.value,
                content: content
            })
        });
        const data = await res.json();
        setMessage(data.message);
        setSpinner(false);
        if (data.message == "updated") {
            blogTitle.current.value = ""
            editor?.commands.setContent("");
            blogSummary.current.value = "";
        }
    }

    const discardBtn = () => {
        blogTitle.current.value = ""
        editor?.commands.setContent("");
        blogSummary.current.value = "";
    }

    return (
        <>
            <AlertContainer isSpinner={spinner} para={message} ref={alertContainer} />
            <div className="authorInfo">
                <label htmlFor="title">Blog Title: </label>
                <input type="text" name="title" id="title" ref={blogTitle} />
                <label htmlFor="summary">Blog Summary: </label>
                <textarea name="summary" id="summary" ref={blogSummary}>
                </textarea>
            </div>
            <p className='blogContentPara'>Blog Content: </p>
            <div className="menubar">
                <MenuBar editor={editor} setTipTapImage={setTipTapImage} />
            </div>
            <EditorContent editor={editor} className='textEditor' style={{overflow:"auto"}}/>
            <div className='contentButtonGroup'>
                <button id='publishButton' onClick={handlePush} className='contentButton'>Publish</button>
                <button id="discardButton" onClick={discardBtn} className='contentButton'>Discard</button>
            </div>
        </>
    )
}

export default Editor;
