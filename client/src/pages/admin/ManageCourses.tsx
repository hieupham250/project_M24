import { DataGrid, GridRenderCellParams, viVN } from "@mui/x-data-grid";
import {
  Box,
  IconButton,
  Button,
  Modal,
  Typography,
  TextField,
} from "@mui/material";
import { Edit, Delete, Close } from "@mui/icons-material";
import { useQuery, useQueryClient } from "react-query";
import {
  getAllCourses,
  createCourse,
  getCourseById,
  updateCourse,
  deleteCourse,
} from "../../services/service_admin/serviceCourse";
import { useMemo, useState } from "react";
import { Course } from "../../interfaces";
import { format } from "date-fns";
import Swal from "sweetalert2";

export default function ManageCourses() {
  const queryClient = useQueryClient();
  const { data: courses } = useQuery({
    queryKey: ["courses"],
    queryFn: () => getAllCourses(),
  });

  const [open, setOpen] = useState<boolean>(false);
  const [errorTitle, setErrorTitle] = useState<boolean>(false);
  const [errorDescription, setErrorDescription] = useState<boolean>(false);
  const [typeButton, setTypeButton] = useState<string>("add");
  const [formAddOrUpdateCourse, setFormAddOrUpdateCourse] = useState<Course>({
    title: "",
    description: "",
    created_at: "",
  });
  const [editCourseId, setEditCourseId] = useState<number | null>(null);

  const rows = useMemo(() => {
    if (!courses) {
      return [];
    }
    return courses?.data?.map((course: Course, index: number) => ({
      serialNumber: index + 1,
      id: course.id,
      title: course.title,
      description: course.description,
      created_at: course.created_at
        ? format(new Date(course.created_at), "dd/MM/yyyy HH:mm:ss")
        : "",
    }));
  }, [courses]);
  const columns = [
    { field: "serialNumber", headerName: "STT", width: 90 },
    { field: "title", headerName: "Tiêu đề", width: 220 },
    { field: "description", headerName: "Mô tả", width: 450 },
    { field: "created_at", headerName: "Ngày tạo", width: 165 },
    {
      field: "actions",
      headerName: "Chức năng",
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <>
          <IconButton
            color="warning"
            onClick={(event) => handleEditClick(event, params.row.id)}
          >
            <Edit />
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

  // hàm mở modal
  const handleOpen = () => {
    setOpen(!open);
    setFormAddOrUpdateCourse({
      title: "",
      description: "",
      created_at: "",
    });
    setErrorTitle(false);
    setErrorDescription(false);
  };

  const handleInputOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (id === "title") {
      setErrorTitle(true);
    }
    if (id === "description") {
      setErrorDescription(true);
    }
    setFormAddOrUpdateCourse({
      ...formAddOrUpdateCourse,
      [id]: value,
    });
  };

  const handleEditClick = async (event: React.MouseEvent, id: number) => {
    event.stopPropagation();
    setTypeButton("edit");
    setEditCourseId(id);
    try {
      const course = await getCourseById(id);
      setFormAddOrUpdateCourse({
        title: course?.data[0]?.title,
        description: course?.data[0]?.description,
        created_at: course?.data[0]?.created_at,
      });
      setOpen(!open);
    } catch (err) {
      Swal.fire("Oops!", "Lỗi không thể tải thông tin khóa học!", "error");
    }
  };

  const handleCreateOrUpdateCourse = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const currentDate = new Date();
    if (
      formAddOrUpdateCourse.title == "" &&
      formAddOrUpdateCourse.description == ""
    ) {
      setErrorTitle(true);
      setErrorDescription(true);
      return;
    }
    const courseData = {
      ...formAddOrUpdateCourse,
      created_at: currentDate,
    };
    if (typeButton === "add") {
      await createCourse(courseData);
      queryClient.invalidateQueries("courses");
      Swal.fire({
        icon: "success",
        title: "Bạn đã thêm khóa học thành công!",
      });
    }
    if (typeButton === "edit") {
      try {
        Swal.fire({
          title: "Bạn có chắc muốn sửa khóa học không ?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Tôi đồng ý!",
        }).then(async (result) => {
          if (result.isConfirmed) {
            await updateCourse(editCourseId, courseData);
            queryClient.invalidateQueries("courses");
            Swal.fire({
              title: "success!",
              text: "Bạn đã sửa khóa học thành công.",
              icon: "success",
            });
          }
        });
      } catch (err) {
        Swal.fire("Oops!", "Lỗi sửa không thành công!", "error");
      }
    }
    setFormAddOrUpdateCourse({
      title: "",
      description: "",
      created_at: "",
    });
    setErrorTitle(false);
    setErrorDescription(false);
    setOpen(!open);
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
        await deleteCourse(id);
        queryClient.invalidateQueries("courses");
        Swal.fire({
          title: "Deleted!",
          text: "Bạn đã xóa khóa học thành công.",
          icon: "success",
        });
      }
    });
  };
  return (
    <>
      <Box sx={{ marginBottom: "20px" }}>
        <Button
          variant="contained"
          size="small"
          onClick={() => {
            setTypeButton("add");
            handleOpen();
          }}
        >
          Thêm mới khóa học
        </Button>
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
          checkboxSelection
          localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
          disableColumnSelector={true}
        />
      </div>
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
            {typeButton === "add" ? "Thêm mới khóa học" : "Cập nhật khóa học"}
          </Typography>
          <Box
            component="form"
            action=""
            id="modal-modal-description"
            onSubmit={handleCreateOrUpdateCourse}
            sx={{
              mt: 2,
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
          >
            <TextField
              id="title"
              label="Tiêu đề"
              variant="outlined"
              sx={{ width: "100%" }}
              value={formAddOrUpdateCourse.title || ""}
              onChange={handleInputOnchange}
              error={
                (errorTitle && formAddOrUpdateCourse?.title?.trim() == "") ||
                (errorTitle &&
                  courses?.data?.some(
                    (course: Course) =>
                      course.title == formAddOrUpdateCourse.title
                  ))
              }
              helperText={
                errorTitle && formAddOrUpdateCourse?.title?.trim() == ""
                  ? "Tiêu đề không hợp lệ!"
                  : errorTitle &&
                    courses?.data?.some(
                      (course: Course) =>
                        course.title == formAddOrUpdateCourse.title
                    )
                  ? "Tiêu đề đã tồn tại!"
                  : ""
              }
            />
            <TextField
              id="description"
              label="Mô tả"
              variant="outlined"
              sx={{ width: "100%" }}
              value={formAddOrUpdateCourse.description || ""}
              onChange={handleInputOnchange}
              error={
                errorDescription &&
                formAddOrUpdateCourse?.description?.trim() == ""
              }
              helperText={
                errorDescription &&
                formAddOrUpdateCourse?.description?.trim() == ""
                  ? "Mô tả không hợp lệ!"
                  : ""
              }
            />
            <Button type="submit" variant="contained" sx={{ width: "100%" }}>
              {typeButton === "add" ? "Thêm mới" : "Cập nhật"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
