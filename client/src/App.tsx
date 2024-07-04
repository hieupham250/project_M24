import { Route, Routes } from "react-router-dom";
import NotFound from "./components/NotFound";
import Login from "./pages/Login";
import HomeAdmin from "./pages/admin/HomeAdmin";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login></Login>}></Route>
        <Route path="/admin/*" element={<HomeAdmin></HomeAdmin>}></Route>
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </>
  );
}
