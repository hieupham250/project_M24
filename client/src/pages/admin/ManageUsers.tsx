import { DataGrid, GridRenderCellParams, viVN } from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import * as locales from "@mui/material/locale";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import LockIcon from "@mui/icons-material/Lock";
import Swal from "sweetalert2";
import { User } from "../../interfaces";
import { useQuery, useQueryClient } from "react-query";
import {
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "../../services/service_user/serviceUser";
import { useMemo } from "react";

export default function ManageUsers() {
  const theme = createTheme();
  const queryClient = useQueryClient();
  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: () => getAllUsers(),
  });

  const rows = useMemo(() => {
    if (!users) {
      return [];
    }
    return users?.data
      ?.filter((user: User) => user.role !== "Admin")
      .map((user: User, index: number) => ({
        id: user.id,
        serialNumber: index + 1,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        dayOfBirth: user.dayOfBirth,
        status: user.status ? "Không khóa" : "Khóa",
        created_at: user.created_at,
      }));
  }, [users]);

  const columns = [
    { field: "serialNumber", headerName: "STT", width: 40 },
    { field: "fullName", headerName: "Họ tên", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "phone", headerName: "Số điện thoại", width: 130 },
    { field: "gender", headerName: "Giới tính", width: 80 },
    { field: "dayOfBirth", headerName: "Ngày sinh", width: 150 },
    { field: "status", headerName: "Trạng thái", width: 120 },
    { field: "created_at", headerName: "Ngày tạo", width: 100 },
    {
      field: "actions",
      headerName: "Chức năng",
      width: 100,
      renderCell: (params: GridRenderCellParams) => (
        <>
          <IconButton
            color="primary"
            onClick={(event) => handleLockClick(event, params.row.id)}
          >
            {params.row.status === "Không khóa" ? (
              <LockOpenIcon />
            ) : (
              <LockIcon />
            )}
          </IconButton>
          <IconButton
            color="secondary"
            onClick={(event) => handleDeleteClick(event, params.row.id)}
          >
            <DeleteIcon />
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

  return (
    <div style={{ height: 400, width: "100%" }}>
      <ThemeProvider theme={theme}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10, 15]}
          checkboxSelection
          localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
          disableColumnSelector={true}
        />
      </ThemeProvider>
    </div>
  );
}
