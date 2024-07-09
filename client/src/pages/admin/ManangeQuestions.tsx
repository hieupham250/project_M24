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
import { useParams } from "react-router-dom";
import {
  createQuestion,
  deleteQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestion,
} from "../../services/service_admin/serviceQuestion";
import { Question } from "../../interfaces";
import { getAllExamsSelect } from "../../services/service_admin/serviceExam";
import { useMemo, useState } from "react";
import Swal from "sweetalert2";

export default function ManangeQuestions() {
  let { id } = useParams();

  const queryClient = useQueryClient();
  const { data: questions } = useQuery({
    queryKey: ["questions", id],
    queryFn: () => getAllQuestions(id),
  });

  const { data: exams } = useQuery({
    queryKey: ["exams"],
    queryFn: () => getAllExamsSelect(),
  });

  const [open, setOpen] = useState<boolean>(false);
  const [typeButton, setTypeButton] = useState<string>("add");
  const [formAddOrUpdateQuestion, setFormAddOrUpdateQuestion] =
    useState<Question>({
      question: "",
      examId: Number(id),
      options: ["", "", "", ""],
      correctAnswer: "",
    });

  const [errorQuestion, setErrorQuestion] = useState<boolean>(false);
  const [errorOptionA, setErrorOptionA] = useState<boolean>(false);
  const [errorOptionB, setErrorOptionB] = useState<boolean>(false);
  const [errorOptionC, setErrorOptionC] = useState<boolean>(false);
  const [errorOptionD, setErrorOptionD] = useState<boolean>(false);
  const [errorCorrectAnswer, setErrorCorrectAnswer] = useState<boolean>(false);
  const [editQuestionId, setEditQuestionId] = useState<number | null>(null);

  const rows = useMemo(() => {
    if (!questions) {
      return [];
    }
    return questions?.data?.map((question: Question, index: number) => ({
      serialNumber: index + 1,
      id: question.id,
      question: question.question,
      examId: exams?.data?.find((exam: any) => exam.id === question.examId)
        ?.title,
    }));
  }, [questions, exams]);

  const columns = [
    { field: "serialNumber", headerName: "STT", width: 70 },
    { field: "question", headerName: "Câu hỏi", width: 500 },
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
    setFormAddOrUpdateQuestion({
      question: "",
      examId: Number(id),
      options: ["", "", "", ""],
      correctAnswer: "",
    });
    setErrorQuestion(false);
    setErrorOptionA(false);
    setErrorOptionB(false);
    setErrorOptionC(false);
    setErrorOptionD(false);
    setErrorCorrectAnswer(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;

    setFormAddOrUpdateQuestion((prev) => {
      if (id.startsWith("option")) {
        // kiểm tra trường đáp án A
        if (id === "option_0") {
          setErrorOptionA(true);
        }
        // Kiểm tra trường đáp án B
        if (id === "option_1") {
          setErrorOptionB(true);
        }
        // Kiểm tra trường đáp án C
        if (id === "option_2") {
          setErrorOptionC(true);
        }
        // Kiểm tra trường đáp án D
        if (id === "option_3") {
          setErrorOptionD(true);
        }
        const index = parseInt(id.split("_")[1], 10);
        const options = [...prev.options];
        options[index] = value;
        return { ...prev, options };
      } else {
        if (id === "question") {
          setErrorQuestion(true);
        }
        if (id === "correctAnswer") {
          setErrorCorrectAnswer(true);
        }
        return { ...prev, [id]: value };
      }
    });
  };

  const handleEditClick = async (event: React.MouseEvent, id: number) => {
    event.stopPropagation();
    setTypeButton("edit");
    setEditQuestionId(id);
    try {
      const question = await getQuestionById(id);
      setFormAddOrUpdateQuestion({
        question: question?.data[0]?.question,
        examId: question?.data[0]?.examId,
        options: [...question?.data[0]?.options],
        correctAnswer: question?.data[0]?.correctAnswer,
      });
      setOpen(!open);
    } catch {
      Swal.fire("Oops!", "Lỗi không thể tải thông tin câu hỏi!", "error");
    }
  };

  const handleCreateOrUpdateQuestion = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (
      formAddOrUpdateQuestion.question == "" ||
      formAddOrUpdateQuestion.options.some((opt) => opt == "") ||
      formAddOrUpdateQuestion.correctAnswer == ""
    ) {
      setErrorQuestion(true);
      setErrorOptionA(true);
      setErrorOptionB(true);
      setErrorOptionC(true);
      setErrorOptionD(true);
      setErrorCorrectAnswer(true);
      return;
    }
    if (typeButton === "add") {
      await createQuestion(formAddOrUpdateQuestion);
      queryClient.invalidateQueries("questions");
      setOpen(false);
      await Swal.fire({
        icon: "success",
        title: "Bạn đã thêm câu hỏi thành công!",
      });
      setOpen(true);
    }
    if (typeButton === "edit") {
      try {
        setOpen(!open);
        Swal.fire({
          title: "Bạn có chắc muốn sửa câu hỏi không ?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Tôi đồng ý!",
        }).then(async (result) => {
          if (result.isConfirmed) {
            await updateQuestion(editQuestionId, formAddOrUpdateQuestion);
            queryClient.invalidateQueries("questions");
            Swal.fire({
              title: "success!",
              text: "Bạn đã sửa câu hỏi thành công.",
              icon: "success",
            });
          }
        });
      } catch (err) {
        Swal.fire("Oops!", "Lỗi sửa không thành công!", "error");
      }
    }
    setFormAddOrUpdateQuestion({
      question: "",
      examId: Number(id),
      options: ["", "", "", ""],
      correctAnswer: "",
    });
    setErrorQuestion(false);
    setErrorOptionA(false);
    setErrorOptionB(false);
    setErrorOptionC(false);
    setErrorOptionD(false);
    setErrorCorrectAnswer(false);
  };

  const handleDeleteClick = (event: React.MouseEvent, id: number) => {
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
        await deleteQuestion(id);
        queryClient.invalidateQueries("questions");
        Swal.fire({
          title: "Deleted!",
          text: "Bạn đã xóa câu hỏi thành công.",
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
          Thêm mới câu hỏi
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
            {typeButton === "add" ? "Thêm mới câu hỏi" : "Cập nhật câu hỏi"}
          </Typography>
          <Box
            component="form"
            action=""
            id="modal-modal-description"
            onSubmit={handleCreateOrUpdateQuestion}
            sx={{
              mt: 2,
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
          >
            <TextField
              id="question"
              label="Câu hỏi"
              variant="outlined"
              value={formAddOrUpdateQuestion.question}
              onChange={handleChange}
              sx={{ width: "100%" }}
              size="small"
              error={
                (errorQuestion &&
                  formAddOrUpdateQuestion?.question?.trim() == "") ||
                (errorQuestion &&
                  questions?.data?.some(
                    (question: Question) =>
                      question.question == formAddOrUpdateQuestion.question
                  ))
              }
              helperText={
                errorQuestion && formAddOrUpdateQuestion?.question?.trim() == ""
                  ? "Câu hỏi không hợp lệ!"
                  : errorQuestion &&
                    questions?.data?.some(
                      (question: Question) =>
                        question.question == formAddOrUpdateQuestion.question
                    )
                  ? "Câu hỏi đã tồn tại!"
                  : ""
              }
            />
            <TextField
              id="option_0"
              label="Đáp án A"
              variant="outlined"
              value={formAddOrUpdateQuestion.options[0] || ""}
              onChange={handleChange}
              sx={{ width: "100%" }}
              size="small"
              error={
                errorOptionA &&
                formAddOrUpdateQuestion?.options[0]?.trim() == ""
              }
              helperText={
                errorOptionA &&
                formAddOrUpdateQuestion?.options[0]?.trim() == ""
                  ? "Đáp án không hợp lệ!"
                  : ""
              }
            />
            <TextField
              id="option_1"
              label="Đáp án B"
              variant="outlined"
              value={formAddOrUpdateQuestion.options[1] || ""}
              onChange={handleChange}
              sx={{ width: "100%" }}
              size="small"
              error={
                errorOptionB &&
                formAddOrUpdateQuestion?.options[1]?.trim() == ""
              }
              helperText={
                errorOptionB &&
                formAddOrUpdateQuestion?.options[1]?.trim() == ""
                  ? "Đáp án không hợp lệ!"
                  : ""
              }
            />
            <TextField
              id="option_2"
              label="Đáp án C"
              variant="outlined"
              value={formAddOrUpdateQuestion.options[2] || ""}
              onChange={handleChange}
              sx={{ width: "100%" }}
              size="small"
              error={
                errorOptionC &&
                formAddOrUpdateQuestion?.options[2]?.trim() == ""
              }
              helperText={
                errorOptionC &&
                formAddOrUpdateQuestion?.options[2]?.trim() == ""
                  ? "Đáp án không hợp lệ!"
                  : ""
              }
            />
            <TextField
              id="option_3"
              label="Đáp án D"
              variant="outlined"
              value={formAddOrUpdateQuestion.options[3] || ""}
              onChange={handleChange}
              sx={{ width: "100%" }}
              size="small"
              error={
                errorOptionD &&
                formAddOrUpdateQuestion?.options[3]?.trim() == ""
              }
              helperText={
                errorOptionD &&
                formAddOrUpdateQuestion?.options[3]?.trim() == ""
                  ? "Đáp án không hợp lệ!"
                  : ""
              }
            />
            <TextField
              id="correctAnswer"
              label="Đáp án đúng"
              variant="outlined"
              value={formAddOrUpdateQuestion.correctAnswer || ""}
              onChange={handleChange}
              sx={{ width: "100%" }}
              size="small"
              error={
                errorCorrectAnswer &&
                formAddOrUpdateQuestion?.correctAnswer?.trim() == ""
              }
              helperText={
                errorQuestion &&
                formAddOrUpdateQuestion?.correctAnswer?.trim() == ""
                  ? "Đáp án đúng không hợp lệ!"
                  : ""
              }
            />
            <Button variant="contained" type="submit" size="small">
              {typeButton === "add" ? "Thêm mới" : "Cập nhật"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
