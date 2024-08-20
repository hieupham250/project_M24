import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import GoogleIcon from "@mui/icons-material/Google";
import Swal from "sweetalert2";
import bcrypt from "bcryptjs";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User } from "../interfaces";
import { useQuery } from "react-query";
import { getAllUsers } from "../services/service_user/serviceUser";
import Header from "../layout/Header";
import Footer from "../layout/Footer";

export default function Login() {
  useEffect(() => {
    document.title = "Đăng nhập";
    // kiểm tra xem nếu nhập url là /login trên cookie có giá trị thì chuyển sang trang home hoặc admin thì sang admin
    const userCookie = Cookies.get("user");
    if (userCookie) {
      let user = JSON.parse(userCookie);
      if (user.role == "User") {
        navigate(`/`, {
          replace: true,
        });
      } else {
        navigate(`/admin`, {
          replace: true,
        });
      }
    }
  }, []);

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = users?.data?.find(
      (user: User) =>
        user.email === email && bcrypt.compareSync(password, user.password)
    );
    if (user) {
      if (user.status) {
        if (user.role === "Admin") {
          Cookies.set("user", JSON.stringify(user));
          Swal.fire({
            icon: "success",
            title: "Đăng nhập thành công",
            text: "Xin chào Admin!",
            showConfirmButton: false,
            timer: 500,
          });
          setTimeout(() => {
            navigate("/admin");
          }, 510);
        } else if (user.role === "User") {
          Cookies.set("user", JSON.stringify(user));
          Swal.fire({
            icon: "success",
            title: "Đăng nhập thành công",
            text: "Cảm ơn bạn!",
            showConfirmButton: false,
            timer: 500,
          });
          setTimeout(() => {
            navigate("/");
          }, 510);
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Tài khoản đã bị khóa, hãy liên hệ admin!",
        });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Kiểm tra lại đăng nhập, nếu bạn chưa có tài khoản nhớ đăng kí!",
      });
    }
  };
  return (
    <>
      <Header></Header>
      <Box
        component="section"
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          component="form"
          action=""
          onSubmit={handleLogin}
          sx={{
            width: "440px",
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
          }}
        >
          <Typography variant="h5" align="center" gutterBottom>
            Đăng nhập
          </Typography>
          <TextField
            id="login-email"
            label="Email"
            variant="outlined"
            sx={{ width: "100%" }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FormControl variant="outlined">
            <InputLabel htmlFor="password">Mật khẩu</InputLabel>
            <OutlinedInput
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              label="Mật khẩu"
            />
          </FormControl>
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>
            Đăng nhập
          </Button>
          <Box sx={{ flexGrow: 1 }}>
            <Grid
              container
              spacing={2}
              alignItems="center"
              justifyContent={"space-between"}
            >
              <Grid item>
                <Typography variant="body2">
                  <Link to="/register" color="inherit">
                    Đăng ký tài khoản mới
                  </Link>
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="body2">
                  <Link to={""} color="inherit">
                    Quên mật khẩu
                  </Link>
                </Typography>
              </Grid>
            </Grid>
          </Box>
          <Box>
            <Grid container alignItems="center" spacing={1}>
              <Grid item xs>
                <Box
                  sx={{
                    width: "100%",
                    height: "1px",
                    backgroundColor: "#dbdbdb",
                  }}
                />
              </Grid>
              <Grid item>
                <Typography sx={{ mx: 1, color: "#dbdbdb" }}>HOẶC</Typography>
              </Grid>
              <Grid item xs>
                <Box
                  sx={{
                    width: "100%",
                    height: "1px",
                    backgroundColor: "#dbdbdb",
                  }}
                />
              </Grid>
            </Grid>
          </Box>

          <Grid container spacing={2} justifyContent="space-between">
            <Grid item>
              <Button
                sx={{ width: "160px", border: "1px solid #dbdbdb" }}
                startIcon={<FacebookRoundedIcon fontSize="large" />}
              >
                Facebook
              </Button>
            </Grid>
            <Grid item>
              <Button
                sx={{ width: "160px", border: "1px solid #dbdbdb" }}
                startIcon={<GoogleIcon />}
              >
                Google
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Footer></Footer>
    </>
  );
}
