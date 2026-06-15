import Navbar from "../components/Navbar";
import { CarouselCircular } from "@ddevkim/carousel-circular-3d";
import "@ddevkim/carousel-circular-3d/dist/index.css";
import "../css/home.css"
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
const images = [
  "https://images.unsplash.com/vector-1759549084841-c38debfdc406?q=80&w=1470&auto=format&fit=crop",
  "https://images.unsplash.com/vector-1756712056511-2020a487cdea?q=80&w=880&auto=format&fit=crop",
  "https://images.unsplash.com/vector-1773406300459-bc90eda02eb5?q=80&w=882&auto=format&fit=crop",
  "https://images.unsplash.com/vector-1741240041552-237362a08363?q=80&w=1374&auto=format&fit=crop",
  "https://images.unsplash.com/vector-1753854003925-7845798cf5c3?q=80&w=880&auto=format&fit=crop",
];
const features = [
  {
    "title": "Post Blog",
    "img": "https://images.unsplash.com/vector-1759549084841-c38debfdc406?q=80&w=1470&auto=format&fit=crop",
    "desc": "Share your ideas, knowledge, and experiences with a global audience. Create engaging, well-structured articles using our intuitive editor and express your thoughts without limitations."
  },
  {
    "title": "See Blog",
    "img": "https://images.unsplash.com/vector-1756712056511-2020a487cdea?q=80&w=880&auto=format&fit=crop",
    "desc": "Discover a diverse collection of blogs covering technology, science, programming, lifestyle, personal development, and much more. Stay informed, inspired, and connected."
  },
  {
    "title": "Bookmark",
    "img": "https://images.unsplash.com/vector-1773406300459-bc90eda02eb5?q=80&w=882&auto=format&fit=crop",
    "desc": "Never lose track of valuable content. Save your favorite blogs, organize your reading list, and return to inspiring articles whenever you want.."
  },
  {
    "title": "DashBoard",
    "img": "https://images.unsplash.com/vector-1741240041552-237362a08363?q=80&w=1374&auto=format&fit=crop",
    "desc": "Take full control of your blogging journey. Manage your published articles, drafts, profile settings, and activity from a centralized and user-friendly dashboard."
  }
]

const items = [
  {
    id: 1,
    image: "https://images.unsplash.com/vector-1759549084841-c38debfdc406?q=80&w=1470&auto=format&fit=crop",
    alt: "Image 1"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/vector-1756712056511-2020a487cdea?q=80&w=880&auto=format&fit=crop",
    alt: "Image 2"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/vector-1773406300459-bc90eda02eb5?q=80&w=882&auto=format&fit=crop",
    alt: "Image 3"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/vector-1741240041552-237362a08363?q=80&w=1374&auto=format&fit=crop",
    alt: "Image 3"
  },
  {
    id: 5,
    image: "https://images.unsplash.com/vector-1759549084841-c38debfdc406?q=80&w=1470&auto=format&fit=crop",
    alt: "Image 1"
  },
  {
    id: 6,
    image: "https://images.unsplash.com/vector-1756712056511-2020a487cdea?q=80&w=880&auto=format&fit=crop",
    alt: "Image 2"
  },
  {
    id: 7,
    image: "https://images.unsplash.com/vector-1773406300459-bc90eda02eb5?q=80&w=882&auto=format&fit=crop",
    alt: "Image 3"
  },
  {
    id: 8,
    image: "https://images.unsplash.com/vector-1741240041552-237362a08363?q=80&w=1374&auto=format&fit=crop",
    alt: "Image 3"
  },
];
const Home = () => {
  const isLogin = useContext(AuthContext);
  const navigate=useNavigate();
  return (
    <>
      <Navbar />
      <section className="websiteDescription">
        <div className="imgCarousel">
          <CarouselCircular
            items={items}
            containerHeight={400}
            geometry={{
              radius: 400,
              cameraAngle: -1,
            }}
            visualEffect={{
              minScale: 0.5,
              enableReflection: true,
            }}
            interaction={{
              dragSensitivity: 1,
              enableMomentum: true,
            }}
            autoRotateConfig={{
              enabled: true,
              speed: 0.5,
              resumeDelay: 500
            }}
          />
        </div>
        <div className="websiteIntro">
          <p>Welcome to <span>Blog Sphere</span></p>
          <p style={{ textAlign: "center" }}>Blog Sphere is a place where ideas, knowledge, and creativity come together. Whether you're passionate about technology, science, programming, personal growth, or everyday experiences, share your insights and inspire others.</p>
        </div>

        <div className="websiteIntroBtn">
          {isLogin ? <>
          <button id='postBtn' onClick={()=>navigate("/post")}>Post</button>
            <button id="seeBtn" onClick={()=>navigate("/blog")}>Blog</button>
          </> : <>
            <button id='signUpBtn' onClick={()=>navigate("/registration")}>SignUp</button>
            <button id="signInBtn" onClick={()=>navigate("/login")}>LogIn</button>
          </>}
        </div>

        <div className="missionContainer">
           <p className="featuresContainerTitle">
            <span>Mission</span>
          </p>
          <p>Our mission is to create a community where readers can discover new perspectives and writers can share their expertise with the world. From in-depth tutorials and industry trends to thought-provoking discussions and practical guides, Blog Sphere offers content for learners, creators, and enthusiasts alike At Blog Sphere, we believe that every idea has the power to inspire change, solve problems, and create new opportunities.</p>
        </div>


        <div className="featuresContainer">
          <p className="featuresContainerTitle">
            <span>Features</span>
          </p>
          <div className="featuresCardArea">
            {features.map((src, i) => (
              <div className={`featuresCard`}>
                <div className="featuresImg">
                  <img src={src['img']} alt="" srcset="" />
                </div>
                <div className="featuresInfo">
                  <p className="featuresTitle">{src['title']}</p>
                  <p className="featuresDesc">{src['desc']}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default Home;