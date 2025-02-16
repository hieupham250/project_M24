import {
  AppBar,
  Avatar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { MoreVert, People, LibraryBooksOutlined } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { NavLink, Route, Routes, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import ManageUsers from "./ManageUsers";
import ManageCourses from "./ManageCourses";
import ManageExamSubjects from "./ManageExamSubjects";
import ManageExams from "./ManageExams";
import ManangeQuestions from "./ManangeQuestions";

export default function HomeAdmin() {
  const [userAdminLogin, setUserAdminLogin] = useState<any>();
  const navigate = useNavigate();
  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      let user = JSON.parse(userCookie);
      if (user.role == "User") {
        navigate(`/404`, {
          replace: true,
        });
      }
      setUserAdminLogin(user);
    } else {
      navigate(`/404`, {
        replace: true,
      });
    }
  }, []);

  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(true);
  const handleMenuOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    Cookies.remove("user");
    setUserAdminLogin(null);
    handleMenuClose();
    Swal.fire({
      icon: "success",
      title: "Đăng xuất thành công!",
      showConfirmButton: false,
      timer: 500,
    });
    setTimeout(() => {
      navigate("/");
    }, 510);
  };
  return (
    <>
      <AppBar
        position="sticky"
        sx={{ width: "100%", top: 0, marginBottom: "20px" }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              position: "relative",
            }}
          >
            <Avatar
              src={userAdminLogin?.avatar}
              sx={{ width: 25, height: 25 }}
            />
            <Typography variant="body1" sx={{ marginLeft: 1 }}>
              {userAdminLogin ? userAdminLogin?.fullName : ""}
            </Typography>
            <IconButton color="inherit" onClick={handleMenuOpen}>
              <MoreVert />
            </IconButton>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              sx={{ position: "absolute", top: "5px", left: "-24px" }}
            >
              <MenuItem onClick={() => navigate("/profile")}>
                Tài khoản của tôi
              </MenuItem>
              <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer open={drawerOpen}>
        <Box sx={{ width: 250 }}>
          <Typography variant="h5" sx={{ padding: 2 }}>
            Tổng quan
          </Typography>
          <List>
            <ListItem>
              <ListItemButton component={NavLink} to="/admin/users">
                <ListItemIcon>
                  <People />
                </ListItemIcon>
                <ListItemText primary="Tài khoản" />
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton component={NavLink} to="/admin/courses">
                <ListItemIcon>
                  <LibraryBooksOutlined />
                </ListItemIcon>
                <ListItemText primary="Khóa luyện thi" />
              </ListItemButton>
            </ListItem>
          </List>
          <IconButton
            sx={{ position: "absolute", top: "13px", right: "10px" }}
            onClick={() => setDrawerOpen(false)}
          >
            <MenuOpenIcon />
          </IconButton>
        </Box>
      </Drawer>
      <Box sx={{ m: 3 }}>
        <Routes>
          <Route path="users" element={<ManageUsers></ManageUsers>}></Route>
          <Route
            path="courses"
            element={<ManageCourses></ManageCourses>}
          ></Route>
          <Route
            path="courses/examSubjects/:courseId"
            element={<ManageExamSubjects></ManageExamSubjects>}
          ></Route>
          <Route
            path="courses/examSubjects/exams/:examSubjectId"
            element={<ManageExams></ManageExams>}
          ></Route>
          <Route
            path="courses/examSubjects/exams/questions/:examId"
            element={<ManangeQuestions></ManangeQuestions>}
          ></Route>
        </Routes>
      </Box>
    </>
  );
}
