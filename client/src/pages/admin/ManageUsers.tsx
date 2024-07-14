import { DataGrid, GridRenderCellParams, viVN } from "@mui/x-data-grid";
import {
  IconButton,
  Box,
  Button,
  Modal,
  Typography,
  TextField,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Delete,
  Lock,
  LockOpen,
  Close,
} from "@mui/icons-material";
import Swal from "sweetalert2";
import { User } from "../../interfaces";
import { useQuery, useQueryClient } from "react-query";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "../../services/service_user/serviceUser";
import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { validateEmail } from "../../util/validateData";
import bcrypt from "bcryptjs";
import Cookies from "js-cookie";

export default function ManageUsers() {
  const queryClient = useQueryClient();
  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: () => getAllUsers(),
  });

  const [userAdminLogin, setUserAdminLogin] = useState<any>();
  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      setUserAdminLogin(JSON.parse(userCookie));
    }
  }, []);

  const [open, setOpen] = useState<boolean>(false);
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

  const rows = useMemo(() => {
    if (!users) {
      return [];
    }
    return users?.data
      ?.filter((user: User) => user.id !== userAdminLogin?.id)
      .map((user: User, index: number) => ({
        id: user.id,
        serialNumber: index + 1,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        dayOfBirth: user.dayOfBirth
          ? format(new Date(user.dayOfBirth), "dd/MM/yyyy")
          : "",
        status: user.status ? "Không khóa" : "Khóa",
        created_at: user.created_at
          ? format(new Date(user.created_at), "dd/MM/yyyy HH:mm:ss")
          : "",
        role: user.role,
      }));
  }, [users]);

  const columns = [
    { field: "serialNumber", headerName: "STT", width: 40 },
    { field: "fullName", headerName: "Họ tên", width: 170 },
    { field: "email", headerName: "Email", width: 215 },
    { field: "phone", headerName: "Số điện thoại", width: 150 },
    { field: "dayOfBirth", headerName: "Ngày sinh", width: 120 },
    { field: "status", headerName: "Trạng thái", width: 120 },
    { field: "created_at", headerName: "Ngày tạo", width: 155 },
    {
      field: "role",
      headerName: "Vai trò",
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Select
          value={params.row.role}
          onChange={(event: any) =>
            handleRoleChange(event, params.row.id, event.target.value)
          }
          fullWidth
        >
          <MenuItem value={"User"}>User</MenuItem>
          <MenuItem value={"Admin"}>Admin</MenuItem>
        </Select>
      ),
    },
    {
      field: "actions",
      headerName: "Chức năng",
      width: 100,
      renderCell: (params: GridRenderCellParams) => (
        <>
          <IconButton
            color="warning"
            onClick={(event) => handleLockClick(event, params.row.id)}
          >
            {params.row.status === "Không khóa" ? <LockOpen /> : <Lock />}
          </IconButton>
          <IconButton
            color="error"
            onClick={(event) => handleDeleteClick(event, params.row.id)}
          >
            <Delete />
          </IconButton>
        </>
      ),
    },
  ];

  const handleLockClick = async (event: React.MouseEvent, id: number) => {
    event.stopPropagation();
    const user = await getUserById(id);
    Swal.fire({
      title: "Bạn có muốn thay đổi trạng thái người dùng này không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Tôi đồng ý!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (user?.data) {
          const userUpdate = user?.data;
          await updateUser({
            id: id, // id người dùng
            status: !userUpdate[0].status, // trạng thái người dùng
          });
          queryClient.invalidateQueries("users");
        }
        Swal.fire({
          title: "Success!",
          text: "Thay đổi trạng thái thành công.",
          icon: "success",
        });
      }
    });
  };

  const handleDeleteClick = async (event: React.MouseEvent, id: number) => {
    event.stopPropagation();
    Swal.fire({
      title: "Bạn có chắc muốn xóa?",
      text: "Bạn sẽ không thể khôi phục lại được!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Tôi đồng ý!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteUser(id);
        queryClient.invalidateQueries("users");
        Swal.fire({
          title: "Deleted!",
          text: "Bạn đã xóa người dùng thành công.",
          icon: "success",
        });
      }
    });
  };

  // hàm mở modal thêm
  const handleOpen = () => {
    setOpen(!open);
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
    setErrorDayOfBirth(false);
    setErrorPassword(false);
    setConfirmPassword("");
  };

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

  const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
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
      await createUser(newUserData);
      queryClient.invalidateQueries("users");
      Swal.fire({
        icon: "success",
        title: "Bạn đã thêm tài khoản thành công!",
        showConfirmButton: false,
        timer: 600,
      });
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
      setErrorDayOfBirth(false);
      setErrorPassword(false);
      setConfirmPassword("");
      setOpen(!open);
    } catch (err) {
      Swal.fire("Oops!", "Lỗi đăng ký không thành công!", "error");
    }
  };

  const handleRoleChange = async (
    event: React.ChangeEvent<{ value: unknown }>,
    id: number,
    newRole: string
  ) => {
    event.stopPropagation();
    const user = await getUserById(id);
    Swal.fire({
      title: `Bạn có muốn thay đổi vai trò của người dùng này không?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Tôi đồng ý!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (user?.data) {
          await updateUser({
            id: id,
            role: newRole,
          });
          queryClient.invalidateQueries("users");
        }
        Swal.fire({
          title: "Success!",
          text: "Thay đổi vai trò thành công.",
          icon: "success",
        });
      }
    });
  };

  return (
    <>
      <Box sx={{ marginBottom: "20px" }}>
        <Button variant="contained" size="small" onClick={handleOpen}>
          Thêm mới tài khoản
        </Button>
        <Modal
          open={open}
          onClose={() => setOpen(!open)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              position: "relative",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography sx={{ position: "absolute", top: 0, right: 0 }}>
              <IconButton onClick={handleOpen}>
                <Close />
              </IconButton>
            </Typography>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              align="center"
            >
              Thêm mới tài khoản
            </Typography>
            <Box
              component="form"
              action=""
              id="modal-modal-description"
              onSubmit={handleCreateUser}
              sx={{
                mt: 2,
                display: "flex",
                flexDirection: "column",
                gap: "15px",
              }}
            >
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
                    users?.data?.some(
                      (user: User) => user.email === addUser.email
                    ))
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
                <InputLabel htmlFor="confirmPassword">
                  Xác nhận mật khẩu
                </InputLabel>
                <OutlinedInput
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        edge="end"
                      >
                        {showConfirmPassword ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
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
                Thêm mới
              </Button>
            </Box>
          </Box>
        </Modal>
      </Box>
      <div style={{ height: 420, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[10, 15]}
          localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
          disableColumnSelector={true}
        />
      </div>
    </>
  );
}
