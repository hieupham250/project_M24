import {
  Avatar,
  Box,
  Button,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { MoreVert } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getUserById } from "../services/service_user/serviceUser";
import Swal from "sweetalert2";

export default function Header() {
  const [userLoginCookie, setUserLogin] = useState<any>();
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      setUserLogin(JSON.parse(userCookie));
    }
  }, []);

  const { data: userLogin } = useQuery({
    queryKey: ["userHeader", userLoginCookie],
    queryFn: () => getUserById(userLoginCookie?.id),
  });

  const handleMenuOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    Cookies.remove("user");
    setUserLogin(null);
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
      <Box
        component="header"
        sx={{
          p: 2,
          backgroundColor: "white",
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Link to="/">
              <img
                src="/src/assets/images/logo/trac-nghiem-online.png"
                alt=""
              />
            </Link>
          </Grid>
          <Grid item>
            {userLogin?.data[0] ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                <Avatar
                  src={userLogin?.data[0]?.avatar}
                  sx={{ width: 25, height: 25 }}
                />
                <Typography variant="body1" sx={{ marginLeft: 1 }}>
                  {userLogin ? userLogin?.data[0]?.fullName : ""}
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
            ) : (
              <Link to="/login">
                <Button
                  variant="contained"
                  sx={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  <AccountCircleIcon />
                  <span>Đăng nhập</span>
                </Button>
              </Link>
            )}
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
