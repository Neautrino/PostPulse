import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignIn from "./pages/SigninPage";
import SignUp from "./pages/SignupPage";
import Homepage from "./pages/Homepage";
import CreateBlog from "./pages/CreateBlog";
import BlogPage from "./pages/BlogPage";
import ProfilePage from "./pages/ProfilePage";
import Dashboard from "./pages/Dashboard";

function App() {

  return (
    <BrowserRouter>
    <div className="font-serif">
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/" element={<Homepage />} />
      <Route path='/new' element={<CreateBlog />} />
      <Route path='/post/:id' element={<BlogPage />} />
      <Route path='/profile' element={<ProfilePage />} />
      <Route path='/dashboard' element={<Dashboard />} />
    </Routes>
    </div>
    </BrowserRouter>
  )
}

export default App
