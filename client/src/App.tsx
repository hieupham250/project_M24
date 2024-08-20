import { Route, Routes } from "react-router-dom";
import NotFound from "./components/NotFound";
import Login from "./pages/Login";
import HomeAdmin from "./pages/admin/HomeAdmin";
import UserProfile from "./components/UserProfile";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ExamHistory from "./pages/user/ExamHistory";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/*" element={<Home></Home>}></Route>
        <Route path="/login" element={<Login></Login>}></Route>
        <Route path="/register" element={<Register></Register>}></Route>
        <Route path="/profile" element={<UserProfile></UserProfile>}></Route>
        <Route path="/admin/*" element={<HomeAdmin></HomeAdmin>}></Route>
        <Route
          path="/examHistory"
          element={<ExamHistory></ExamHistory>}
        ></Route>
        <Route path="/404" element={<NotFound />}></Route>
      </Routes>
    </>
  );
}
