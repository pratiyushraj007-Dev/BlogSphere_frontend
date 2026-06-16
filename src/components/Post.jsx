import Navbar from "./Navbar";
import Editor from "./Editor";
import { AuthContext } from "../context/AuthProvider";
import { useContext } from "react";
const Post = () => {
    const userCredentials = useContext(AuthContext);
    console.log(userCredentials)
    return (
        <>
            {userCredentials ? <>
                <Navbar />
                <p style={{
                    textAlign: "center",
                    margin: "20px 0px 20px 0px",
                    fontSize: "1.8rem",
                    color: "#f77f00"
                }}>
                    Share your thoughts, inspire the world.
                </p>
                <section className="editorContainer">
                    <Editor />
                </section>
            </> : <>
                <p style={{textAlign:"center",fontSize:"2rem",marginTop:"40px"}}>Please Login to get access</p>
            </>}
        </>
    )
}
export default Post;