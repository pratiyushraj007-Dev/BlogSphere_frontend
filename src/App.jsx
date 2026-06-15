import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import VerifyOtp from "./components/VerifyOtp";
import DashBoard from "./components/Dashboard";
import Post from "./components/Post";
import Registration from "./components/Registration";
import Login from "./components/Login";
import Blog from "./components/Blog";
import BlogPage from "./components/BlogPage";
import ConfirmationEmail from "./components/ConfirmationEmail";
import ResetPassword from "./components/ResetPassword";
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/post" element={<Post />} />
      <Route path="/dashboard" element={<DashBoard />} />
      <Route path="/registration" element={<Registration />} />
      <Route path="/login" element={<Login />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:BlogID" element={<BlogPage/>} />
      <Route path="/confirmation-email" element={<ConfirmationEmail/>} />
      <Route path="/reset-password/:ID" element={<ResetPassword/>}/>
    </Routes>
  )
}
export default App;