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
  createExamSubject,
  deleteExamSubject,
  getAllExamSubjects,
  getExamSubjectById,
  updateExamSubject,
} from "../../services/service_admin/serviceExamSubject";
import { useMemo, useState } from "react";
import { ExamSubject } from "../../interfaces";
import Swal from "sweetalert2";
import { getAllCourses } from "../../services/service_admin/serviceCourse";
import { format } from "date-fns";
import { useNavigate, useParams } from "react-router-dom";

export default function ManageExamSubjects() {
  let { courseId } = useParams();
  const queryClient = useQueryClient();
  const { data: examSubjects } = useQuery({
    queryKey: ["examSubjects", courseId],
    queryFn: () => getAllExamSubjects(courseId),
  });

  const { data: courses } = useQuery({
    queryKey: ["courses"],
    queryFn: () => getAllCourses(),
  });
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);
  const [errorTitle, setErrorTitle] = useState<boolean>(false);
  const [errorDescription, setErrorDescription] = useState<boolean>(false);
  const [typeButton, setTypeButton] = useState<string>("add");
  const [formAddOrUpdateExamSubject, setFormAddOrUpdateExamSubject] = useState({
    title: "",
    description: "",
    courseId: Number(courseId),
    created_at: "",
  });
  const [editExamSubjectId, setEditExamSubjectId] = useState<number | null>(
    null
  );

  const rows = useMemo(() => {
    if (!examSubjects) {
      return [];
    }
    return examSubjects?.data?.map(
      (examSubject: ExamSubject, index: number) => ({
        serialNumber: index + 1,
        id: examSubject.id,
        title: examSubject.title,
        description: examSubject.description,
        courseTitle: courses?.data?.find(
          (course: any) => course.id === examSubject.courseId
        )?.title,
        created_at: examSubject.created_at
          ? format(new Date(examSubject.created_at), "dd/MM/yyyy HH:mm:ss")
          : "",
      })
    );
  }, [examSubjects, courses]);

  const columns = [
    { field: "serialNumber", headerName: "STT", width: 90 },
    { field: "title", headerName: "Tiêu đề", width: 200 },
    { field: "description", headerName: "Mô tả", width: 230 },
    { field: "courseTitle", headerName: "Khóa học", width: 250 },
    { field: "created_at", headerName: "Ngày tạo", width: 200 },
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
    setFormAddOrUpdateExamSubject({
      title: "",
      description: "",
      courseId: Number(courseId),
      created_at: "",
    });
    setErrorTitle(false);
    setErrorDescription(false);
  };

  const handleInputOnchange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any
  ) => {
    const { id, value } = e.target;
    if (id === "title") {
      setErrorTitle(true);
    }
    if (id === "description") {
      setErrorDescription(true);
    }
    setFormAddOrUpdateExamSubject({
      ...formAddOrUpdateExamSubject,
      [id]: value,
    });
  };

  const handleEditClick = async (event: React.MouseEvent, id: number) => {
    event.stopPropagation();
    setTypeButton("edit");
    setEditExamSubjectId(id);
    try {
      const examSubject = await getExamSubjectById(id);
      setFormAddOrUpdateExamSubject({
        title: examSubject?.data[0]?.title,
        description: examSubject?.data[0]?.description,
        created_at: examSubject?.data[0]?.created_at,
        courseId: examSubject?.data[0]?.courseId,
      });
      setOpen(!open);
    } catch (err) {
      Swal.fire("Oops!", "Lỗi không thể tải thông tin môn học!", "error");
    }
  };

  const handleCreateOrUpdateExamSubject = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const currentDate = new Date();
    if (
      formAddOrUpdateExamSubject.title == "" ||
      formAddOrUpdateExamSubject.description == ""
    ) {
      setErrorTitle(true);
      setErrorDescription(true);
      return;
    }
    const courseData = {
      ...formAddOrUpdateExamSubject,
      created_at: currentDate,
    };
    if (typeButton === "add") {
      await createExamSubject(courseData);
      queryClient.invalidateQueries("examSubjects");
      Swal.fire({
        icon: "success",
        title: "Bạn đã thêm môn học thành công!",
      });
    }
    if (typeButton === "edit") {
      try {
        Swal.fire({
          title: "Bạn có chắc muốn sửa môn học không ?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Tôi đồng ý!",
        }).then(async (result) => {
          if (result.isConfirmed) {
            await updateExamSubject(editExamSubjectId, courseData);
            queryClient.invalidateQueries("examSubjects");
            Swal.fire({
              title: "success!",
              text: "Bạn đã sửa môn học thành công.",
              icon: "success",
            });
          }
        });
      } catch (err) {
        Swal.fire("Oops!", "Lỗi sửa không thành công!", "error");
      }
    }
    setFormAddOrUpdateExamSubject({
      title: "",
      description: "",
      courseId: Number(courseId),
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
        await deleteExamSubject(id);
        queryClient.invalidateQueries("examSubjects");
        Swal.fire({
          title: "Deleted!",
          text: "Bạn đã xóa môn học thành công.",
          icon: "success",
        });
      }
    });
  };

  const handleRowClick = (params: any) => {
    navigate(`/admin/courses/examSubjects/exams/${params.id}`, {
      replace: true,
    });
    // navigate(`/admin/courses/examSubjects/exams/${params.id}`);
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
          Thêm mới môn học
        </Button>
      </Box>
      <div style={{ height: 420, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
          localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
          disableColumnSelector={true}
          disableRowSelectionOnClick
          onRowClick={handleRowClick}
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
            {typeButton === "add" ? "Thêm mới môn thi" : "Cập nhật môn thi"}
          </Typography>
          <Box
            component="form"
            action=""
            id="modal-modal-description"
            onSubmit={handleCreateOrUpdateExamSubject}
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
              value={formAddOrUpdateExamSubject.title || ""}
              onChange={handleInputOnchange}
              error={
                (errorTitle &&
                  formAddOrUpdateExamSubject?.title?.trim() == "") ||
                (errorTitle &&
                  examSubjects?.data?.some(
                    (examSubject: ExamSubject) =>
                      examSubject.title == formAddOrUpdateExamSubject.title
                  ))
              }
              helperText={
                errorTitle && formAddOrUpdateExamSubject?.title?.trim() == ""
                  ? "Tiêu đề không hợp lệ!"
                  : errorTitle &&
                    examSubjects?.data?.some(
                      (examSubject: ExamSubject) =>
                        examSubject.title == formAddOrUpdateExamSubject.title
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
              value={formAddOrUpdateExamSubject.description || ""}
              onChange={handleInputOnchange}
              error={
                errorDescription &&
                formAddOrUpdateExamSubject?.description?.trim() == ""
              }
              helperText={
                errorDescription &&
                formAddOrUpdateExamSubject?.description?.trim() == ""
                  ? "Mô tả không hợp lệ!"
                  : ""
              }
            />
            <TextField
              id="examSubjectId"
              label="Môn thi"
              variant="outlined"
              sx={{ width: "100%" }}
              value={
                courses?.data?.find((course: any) => course.id == courseId)
                  ?.title
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
