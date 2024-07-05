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
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
export default function Header() {
  const [userLogin, setUserLogin] = useState<any>();
  const [isUserLogin, setIsUserLogin] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      setUserLogin(JSON.parse(userCookie));
      setIsUserLogin(!isUserLogin);
    }
  }, []);

  const handleMenuOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    Cookies.remove("user");
    setUserLogin(null);
    setIsUserLogin(false);
    handleMenuClose();
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
            {isUserLogin ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                <Avatar
                  src={userLogin?.avatar}
                  sx={{ width: 25, height: 25 }}
                />
                <Typography variant="body1" sx={{ marginLeft: 1 }}>
                  {userLogin ? userLogin.fullName : ""}
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
                  <MenuItem onClick={handleMenuClose}>
                    Tài khoản của tôi
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
                </Menu>
              </Box>
            ) : (
              <Link to="login">
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
