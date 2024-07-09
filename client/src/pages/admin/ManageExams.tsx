import {
  Box,
  IconButton,
  Button,
  Modal,
  Typography,
  TextField,
} from "@mui/material";
import { DataGrid, GridRenderCellParams, viVN } from "@mui/x-data-grid";
import { Edit, Delete, Close } from "@mui/icons-material";
import { useQuery, useQueryClient } from "react-query";
import {
  createExam,
  deleteExam,
  getAllExams,
  getExamById,
  updateExam,
} from "../../services/service_admin/serviceExam";
import { getAllExamSubjectsSelect } from "../../services/service_admin/serviceExamSubject";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Exam } from "../../interfaces";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
export default function ManageExams() {
  const queryClient = useQueryClient();
  let { id } = useParams();

  const { data: exams } = useQuery({
    queryKey: ["exams", id],
    queryFn: () => getAllExams(id),
  });

  const { data: examSubjects } = useQuery({
    queryKey: ["examSubjects"],
    queryFn: () => getAllExamSubjectsSelect(),
  });

  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);
  const [errorTitle, setErrorTitle] = useState<boolean>(false);
  const [errorDescription, setErrorDescription] = useState<boolean>(false);
  const [errorDuration, setErrorDuration] = useState<boolean>(false);
  const [typeButton, setTypeButton] = useState<string>("add");
  const [formAddOrUpdateExam, setFormAddOrUpdateExam] = useState({
    title: "",
    description: "",
    duration: "",
    examSubjectId: Number(id),
    created_at: "",
  });
  const [editExamId, setEditExamId] = useState<number | null>(null);

  const rows = useMemo(() => {
    if (!exams) {
      return [];
    }
    return exams?.data?.map((exam: Exam, index: number) => ({
      serialNumber: index + 1,
      id: exam.id,
      title: exam.title,
      description: exam.description,
      duration: exam.duration,
      examSubjectId: examSubjects?.data?.find(
        (examSubject: any) => examSubject.id === exam.examSubjectId
      )?.title,
      created_at: exam.created_at
        ? format(new Date(exam.created_at), "dd/MM/yyyy HH:mm:ss")
        : "",
    }));
  }, [exams, examSubjects]);
  const columns = [
    { field: "serialNumber", headerName: "STT", width: 30 },
    { field: "title", headerName: "Tiêu đề", width: 340 },
    { field: "description", headerName: "Mô tả", width: 340 },
    { field: "duration", headerName: "Thời gian (phút)", width: 120 },
    { field: "examSubjectId", headerName: "Môn thi", width: 150 },
    { field: "created_at", headerName: "Ngày tạo", width: 160 },
    {
      field: "actions",
      headerName: "Chức năng",
      width: 120,
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
    setFormAddOrUpdateExam({
      title: "",
      description: "",
      duration: "",
      examSubjectId: Number(id),
      created_at: "",
    });
    setErrorTitle(false);
    setErrorDescription(false);
    setErrorDuration(false);
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
    if (id === "duration") {
      setErrorDuration(true);
    }
    setFormAddOrUpdateExam({
      ...formAddOrUpdateExam,
      [id]: value,
    });
  };

  const handleEditClick = async (event: React.MouseEvent, id: number) => {
    event.stopPropagation();
    setTypeButton("edit");
    setEditExamId(id);
    try {
      const exam = await getExamById(id);
      setFormAddOrUpdateExam({
        title: exam?.data[0]?.title,
        description: exam?.data[0]?.description,
        duration: exam?.data[0]?.duration,
        examSubjectId: exam?.data[0]?.examSubjectId,
        created_at: exam?.data[0]?.created_at,
      });
      setOpen(!open);
    } catch (err) {
      Swal.fire("Oops!", "Lỗi không thể tải thông tin đề thi!", "error");
    }
  };

  const handleCreateOrUpdateExam = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const currentDate = new Date();
    if (
      formAddOrUpdateExam.title == "" ||
      formAddOrUpdateExam.description == "" ||
      formAddOrUpdateExam.duration == ""
    ) {
      setErrorTitle(true);
      setErrorDescription(true);
      setErrorDuration(true);
      return;
    }
    if (isNaN(Number(formAddOrUpdateExam.duration))) {
      setErrorDuration(true);
      return;
    }
    const examData = {
      ...formAddOrUpdateExam,
      duration: Number(formAddOrUpdateExam.duration),
      created_at: currentDate,
    };
    if (typeButton === "add") {
      await createExam(examData);
      queryClient.invalidateQueries("exams");
      Swal.fire({
        icon: "success",
        title: "Bạn đã thêm đề thi thành công!",
      });
    }
    if (typeButton === "edit") {
      try {
        Swal.fire({
          title: "Bạn có chắc muốn sửa đề thi không ?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Tôi đồng ý!",
        }).then(async (result) => {
          if (result.isConfirmed) {
            await updateExam(editExamId, examData);
            queryClient.invalidateQueries("exams");
            Swal.fire({
              title: "success!",
              text: "Bạn đã sửa đề thi thành công.",
              icon: "success",
            });
          }
        });
      } catch (err) {
        Swal.fire("Oops!", "Lỗi sửa không thành công!", "error");
      }
    }
    setFormAddOrUpdateExam({
      title: "",
      description: "",
      duration: "",
      examSubjectId: Number(id),
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
        await deleteExam(id);
        queryClient.invalidateQueries("exams");
        Swal.fire({
          title: "Deleted!",
          text: "Bạn đã xóa đề thi thành công.",
          icon: "success",
        });
      }
    });
  };

  const handleRowClick = (params: any) => {
    navigate(`/admin/courses/examSubjects/exams/questions/${params.id}`, {
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
          Thêm mới đề thi
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
            onSubmit={handleCreateOrUpdateExam}
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
              value={formAddOrUpdateExam.title || ""}
              onChange={handleInputOnchange}
              error={
                (errorTitle && formAddOrUpdateExam?.title?.trim() == "") ||
                (errorTitle &&
                  exams?.data?.some(
                    (exam: Exam) => exam.title == formAddOrUpdateExam.title
                  ))
              }
              helperText={
                errorTitle && formAddOrUpdateExam?.title?.trim() == ""
                  ? "Tiêu đề không hợp lệ!"
                  : errorTitle &&
                    exams?.data?.some(
                      (exam: Exam) => exam.title == formAddOrUpdateExam.title
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
              value={formAddOrUpdateExam.description || ""}
              onChange={handleInputOnchange}
              error={
                errorDescription &&
                formAddOrUpdateExam?.description?.trim() == ""
              }
              helperText={
                errorDescription &&
                formAddOrUpdateExam?.description?.trim() == ""
                  ? "Mô tả không hợp lệ!"
                  : ""
              }
            />
            <TextField
              id="duration"
              label="Thời gian ( phút )"
              variant="outlined"
              sx={{ width: "100%" }}
              value={formAddOrUpdateExam.duration || ""}
              onChange={handleInputOnchange}
              error={
                (errorDuration && formAddOrUpdateExam?.duration == "") ||
                (errorDuration && isNaN(Number(formAddOrUpdateExam.duration)))
              }
              helperText={
                (errorDuration && formAddOrUpdateExam?.duration == "") ||
                (errorDuration && isNaN(Number(formAddOrUpdateExam.duration)))
                  ? "Thời gian không hợp lệ!"
                  : ""
              }
            />
            <TextField
              id="examSubjectId"
              label="Môn thi"
              variant="outlined"
              sx={{ width: "100%" }}
              value={
                examSubjects?.data?.find(
                  (examSubject: any) => examSubject.id == id
                )?.title
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
