import Navbar from "./Navbar";
import Editor from "./Editor";
const Post = () => {
    return (
        <>
            <Navbar />
            <p style={{
                textAlign:"center",
                margin:"20px 0px 20px 0px",
                fontSize:"1.8rem",
                color:"#f77f00"
            }}>
                Share your thoughts, inspire the world.
            </p>
            <section className="editorContainer">
                <Editor />
            </section>
        </>
    )
}
export default Post;