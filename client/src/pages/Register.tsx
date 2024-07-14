import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";

import {
  Visibility,
  VisibilityOff,
  Google,
  Facebook,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { getAllUsers } from "../services/service_user/serviceUser";
import bcrypt from "bcryptjs";
import { validateEmail } from "../util/validateData";
import baseUrl from "../api";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { User } from "../interfaces";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import Cookies from "js-cookie";
export default function Register() {
  useEffect(() => {
    document.title = "Đăng ký";
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

  const [errorFullName, setErrorFullName] = useState<boolean>(false);
  const [errorEmail, setErrorEmail] = useState<boolean>(false);
  const [errorPassword, setErrorPassword] = useState<boolean>(false);
  const [errorDayOfBirth, setErrorDayOfBirth] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [addUser, setAddUser] = useState<User>({
    fullName: "",
    avatar: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    dayOfBirth: "",
    status: true,
    role: "User",
    created_at: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleInputOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (id === "fullName") {
      setErrorFullName(true);
    }
    if (id === "dayOfBirth") {
      const currentDate = new Date();
      const enteredDate = new Date(value);
      setErrorDayOfBirth(true);
      if (enteredDate > currentDate) {
        setErrorDayOfBirth(true);
      } else {
        setErrorDayOfBirth(false);
      }
    }
    if (id === "email") {
      setErrorEmail(true);
    }
    if (id === "password") {
      setErrorPassword(true);
    }

    setAddUser({
      ...addUser,
      [id]: value,
    });
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const currentDate = new Date();
    if (
      addUser.fullName == "" &&
      addUser.email == "" &&
      addUser.password == "" &&
      addUser.dayOfBirth == ""
    ) {
      setErrorFullName(true);
      setErrorDayOfBirth(true);
      setErrorEmail(true);
      setErrorPassword(true);
      return;
    }
    if (!validateEmail(addUser.email)) {
      setErrorEmail(true);
      return;
    }
    if (addUser.password.length < 5) {
      setErrorPassword(true);
      return;
    }
    if (users?.data?.some((user: User) => user.email === addUser.email)) {
      setErrorEmail(true);
      return;
    }
    if (addUser.password != confirmPassword) {
      setErrorPassword(true);
      return;
    } else {
      setErrorPassword(false);
    }
    const hashedPassword = await bcrypt.hash(addUser.password, 10);
    const newUserData = {
      ...addUser,
      password: hashedPassword,
      created_at: currentDate,
    };
    try {
      await baseUrl.post("users", newUserData);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Bạn đã đăng ký thành công!",
        showConfirmButton: false,
        timer: 600,
      });
      Cookies.remove("user");
      setAddUser({
        fullName: "",
        avatar: "",
        email: "",
        phone: "",

        address: "",
        password: "",
        dayOfBirth: "",
        status: true,
        role: "User",
        created_at: "",
      });
      setErrorFullName(false);
      setErrorEmail(false);
      setErrorPassword(false);
      setConfirmPassword("");
      setTimeout(() => {
        navigate("/login");
      }, 600);
    } catch (err) {
      Swal.fire("Oops!", "Lỗi đăng ký không thành công!", "error");
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
          onSubmit={handleRegister}
          sx={{
            width: "440px",
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: " rgba(0, 0, 0, 0.35) 0px 5px 15px",
          }}
        >
          <Typography variant="h5" align="center">
            Đăng ký
          </Typography>
          <TextField
            id="fullName"
            label="Họ và tên"
            variant="outlined"
            sx={{ width: "100%" }}
            value={addUser.fullName || ""}
            onChange={handleInputOnchange}
            error={errorFullName && addUser?.fullName?.trim() == ""}
            helperText={
              errorFullName && addUser?.fullName?.trim() == ""
                ? "Họ tên không hợp lệ!"
                : ""
            }
          />
          <TextField
            id="dayOfBirth"
            label="Ngày sinh"
            type="date"
            sx={{ width: "100%" }}
            value={addUser.dayOfBirth || ""}
            onChange={handleInputOnchange}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              max: new Date().toISOString().split("T")[0],
            }}
            error={errorDayOfBirth}
            helperText={errorDayOfBirth ? "Ngày sinh không hợp lệ!" : ""}
          />
          <TextField
            id="email"
            label="Email"
            variant="outlined"
            sx={{ width: "100%" }}
            value={addUser.email || ""}
            onChange={handleInputOnchange}
            error={
              (errorEmail && addUser?.email?.trim() == "") ||
              (errorEmail && !validateEmail(addUser?.email)) ||
              (errorEmail &&
                users?.data?.some((user: User) => user.email === addUser.email))
            }
            helperText={
              (errorEmail && addUser?.email?.trim() == "") ||
              (errorEmail && !validateEmail(addUser?.email))
                ? "Email không hợp lệ!"
                : errorEmail &&
                  users?.data?.some(
                    (user: User) => user.email === addUser.email
                  )
                ? "email đã tồn tại!"
                : ""
            }
          />
          <FormControl
            variant="outlined"
            sx={{ width: "100%" }}
            error={
              (errorPassword && addUser?.password?.trim() == "") ||
              (errorPassword && addUser?.password?.length < 5)
            }
          >
            <InputLabel htmlFor="password">Mật khẩu</InputLabel>
            <OutlinedInput
              id="password"
              type={showPassword ? "text" : "password"}
              value={addUser.password || ""}
              onChange={handleInputOnchange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              label="Mật khẩu"
            />
            {errorPassword && (
              <FormHelperText>
                {addUser?.password?.trim() === ""
                  ? "Mật khẩu không hợp lệ!"
                  : addUser?.password?.length < 5
                  ? "Mật khẩu quá ngắn!"
                  : ""}
              </FormHelperText>
            )}
          </FormControl>

          <FormControl
            variant="outlined"
            sx={{ width: "100%" }}
            error={
              confirmPassword?.trim() !== addUser?.password?.trim() &&
              errorPassword
            }
          >
            <InputLabel htmlFor="confirmPassword">Xác nhận mật khẩu</InputLabel>
            <OutlinedInput
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              label="Xác nhận mật khẩu"
            />
            {confirmPassword?.trim() !== addUser?.password?.trim() &&
              errorPassword && (
                <FormHelperText>Mật khẩu không khớp!</FormHelperText>
              )}
          </FormControl>

          <Button type="submit" variant="contained" sx={{ width: "100%" }}>
            Đăng ký
          </Button>

          <Box sx={{ flexGrow: 1 }}>
            <Grid
              container
              spacing={2}
              alignItems="center"
              justifyContent="space-between"
            >
              <Grid item>
                <Typography variant="body2">
                  <Link to="/login" color="inherit">
                    Quay lại đăng nhập
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
            <Grid item xs>
              <Button
                variant="outlined"
                startIcon={<Facebook />}
                sx={{ width: "100%" }}
              >
                Facebook
              </Button>
            </Grid>
            <Grid item xs>
              <Button
                variant="outlined"
                startIcon={<Google />}
                sx={{ width: "100%" }}
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
