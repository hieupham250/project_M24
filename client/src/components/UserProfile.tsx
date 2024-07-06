import {
  Avatar,
  Box,
  Button,
  Grid,
  IconButton,
  TextField,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import Cookies from "js-cookie";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebase";
import { useEffect, useState } from "react";
import { updateUser } from "../services/service_user/serviceUser";
import { isVietnamesePhoneNumber } from "../util/validateData";
import { useQueryClient } from "react-query";
import Swal from "sweetalert2";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
export default function UserProfile() {
  const queryClient = useQueryClient();
  const [userLogin, setUserLogin] = useState<any>();
  const [errorFullName, setErrorFullName] = useState<boolean>(false);
  const [errorDayOfBirth, setErrorDayOfBirth] = useState<boolean>(false);
  const [errorPhone, setErrorPhone] = useState<boolean>(false);
  const [errorAddress, setErrorAddress] = useState<boolean>(false);
  const [editUser, setEditUser] = useState<any>({
    fullName: "",
    dayOfBirth: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      const user = JSON.parse(userCookie);
      setUserLogin(user);
      setEditUser({
        fullName: user?.fullName,
        dayOfBirth: user?.dayOfBirth,
        phone: user?.phone,
        address: user?.address,
      });
    }
  }, []);
  console.log(userLogin);

  const handleInputOnChange = (e: any) => {
    const { id, value } = e.target;
    if (id === "avatar-upload") {
      const file = e.target.files[0];
      if (file) {
        const imageRef = ref(storage, `avatars/${file.name}`);
        uploadBytes(imageRef, file).then((snapshot) => {
          getDownloadURL(snapshot.ref).then((downloadURL) => {
            setEditUser((prevData: any) => ({
              ...prevData,
              avatar: downloadURL,
            }));
          });
        });
      }
    } else {
      setEditUser((prevData: any) => ({ ...prevData, [id]: value }));
      if (id === "fullName") {
        setErrorFullName(true);
      }
      if (id === "dayOfBirth") {
        const currentDate = new Date();
        const enteredDate = new Date(value);
        if (enteredDate > currentDate) {
          setErrorDayOfBirth(true);
        } else {
          setErrorDayOfBirth(false);
        }
      }
      if (id === "phone") {
        setErrorPhone(true);
      }
      if (id === "address") {
        setErrorAddress(true);
      }
    }
  };

  const handleEditSubmit = async (e: any) => {
    e.preventDefault();
    try {
      Swal.fire({
        title: `Bạn có muốn thay đổi thông tin không?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Tôi đồng ý!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const updatedUser = {
            ...editUser,
            id: userLogin.id,
            avatar: editUser.avatar || userLogin.avatar,
            email: userLogin.email,
          };
          await updateUser(updatedUser);
          Cookies.set("user", JSON.stringify(updatedUser));
          queryClient.invalidateQueries("userHeader");
          Swal.fire({
            title: "Success!",
            text: "Thay đổi thông tin thành công.",
            icon: "success",
          });
        }
      });
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <>
      <Header></Header>
      <Box
        component="section"
        sx={{
          p: 5,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Grid
          container
          component="form"
          onSubmit={handleEditSubmit}
          sx={{ width: "85%" }}
        >
          <Grid
            item
            xs={4}
            sx={{
              backgroundColor: "white",
              p: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Grid>
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="avatar-upload"
                type="file"
                onChange={handleInputOnChange}
              />
              <label htmlFor="avatar-upload">
                <IconButton
                  color="primary"
                  aria-label="upload picture"
                  component="span"
                >
                  <Avatar
                    src={editUser.avatar || userLogin?.avatar || ""}
                    sx={{ width: 160, height: 160 }}
                  >
                    <PhotoCamera />
                  </Avatar>
                </IconButton>
              </label>
            </Grid>
          </Grid>
          <Grid item xs={8} sx={{ backgroundColor: "white", p: 2 }}>
            <TextField
              id="fullName"
              label="Họ tên"
              variant="outlined"
              value={editUser.fullName || ""}
              onChange={handleInputOnChange}
              error={errorFullName && editUser.fullName.trim() === ""}
              helperText={
                errorFullName && editUser.fullName.trim() === ""
                  ? "Họ tên không hợp lệ!"
                  : ""
              }
              size="small"
              sx={{ width: "100%", marginBottom: "20px" }}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              id="dayOfBirth"
              label="Ngày sinh"
              type="date"
              value={editUser.dayOfBirth || ""}
              onChange={handleInputOnChange}
              size="small"
              sx={{ width: "100%", marginBottom: "20px" }}
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
              disabled
              id="email"
              label="Email"
              value={userLogin?.email || ""}
              size="small"
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                width: "100%",
                marginBottom: "20px",
                backgroundColor: "#f4f4f4",
              }}
            />
            <TextField
              id="phone"
              label="Số diện thoại"
              variant="outlined"
              value={editUser.phone || ""}
              onChange={handleInputOnChange}
              error={
                (errorPhone && editUser.phone.trim() === "") ||
                (errorPhone && !isVietnamesePhoneNumber(editUser.phone))
              }
              size="small"
              sx={{ width: "100%", marginBottom: "20px" }}
              InputLabelProps={{
                shrink: true,
              }}
              helperText={
                (errorPhone && editUser.phone.trim() === "") ||
                (errorPhone && !isVietnamesePhoneNumber(editUser.phone))
                  ? "Số điện thoại không hợp lệ!"
                  : ""
              }
            />
            <TextField
              id="address"
              label="Địa chỉ"
              variant="outlined"
              value={editUser.address || ""}
              onChange={handleInputOnChange}
              error={errorAddress && editUser.address.trim() === ""}
              size="small"
              sx={{ width: "100%", marginBottom: "20px" }}
              InputLabelProps={{
                shrink: true,
              }}
              helperText={
                errorAddress && editUser.address.trim() === ""
                  ? "Địa chỉ không được để trống!"
                  : ""
              }
            />
            <Button type="submit" variant="contained">
              Lưu thay đổi
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Footer></Footer>
    </>
  );
}
