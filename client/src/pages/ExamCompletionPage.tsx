import { Box, Typography, Button, Paper } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useQuery } from "react-query";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAllQuestions } from "../services/service_admin/serviceQuestion";
import {
  createUserAnswer,
  getAllUserAnswers,
  updateUserAnswer,
} from "../services/service_user/serviceUserAnswer";

export default function ExamCompletionPage() {
  let { examId } = useParams();

  const { data: questions } = useQuery({
    queryKey: ["questions", examId],
    queryFn: () => getAllQuestions(examId),
  });

  const [userLogin, setUserLogin] = useState<any>();
  const [userAnswer, setUserAnswer] = useState<any[]>([]);
  const [elapsedTimeLocal, setElapsedTimeLocal] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    const userLoginCookie = Cookies.get("user");
    const userAnswerCookie = Cookies.get("userAnswer");
    const elapsedTimeLocal = localStorage.getItem("elapsedTime");

    if (userLoginCookie) {
      setUserLogin(JSON.parse(userLoginCookie));
    } else {
      navigate("/404");
    }
    if (userAnswerCookie) {
      setUserAnswer(JSON.parse(userAnswerCookie));
    }
    if (elapsedTimeLocal) {
      setElapsedTimeLocal(Number(elapsedTimeLocal));
    }
  }, []);

  let count = 0;
  let score = 0;

  for (let i = 0; i < questions?.data.length; i++) {
    if (userAnswer[i] == questions?.data[i]?.correctAnswer) {
      count += 1;
    }
  }

  const formatTime = (seconds: any) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  // tính điểm hoàn thành bài thi
  score = Math.round((count / questions?.data.length) * 10);

  useEffect(() => {
    if (userLogin && userAnswer.length > 0) {
      const saveUserAnswer = async () => {
        try {
          const existingAnswers = await getAllUserAnswers(
            userLogin?.id,
            examId
          );
          if (existingAnswers.data.length === 0) {
            // Nếu chưa có dữ liệu thì tạo mới
            const newUserAnswer = {
              userId: userLogin?.id,
              examId: Number(examId),
              score: score,
            };
            await createUserAnswer(newUserAnswer);
          } else {
            // Nếu đã có dữ liệu thì cập nhật lại score
            const userAnswerId = existingAnswers.data[0].id; // Lấy id của câu trả lời của người dùng
            const updatedUserAnswer = {
              ...existingAnswers.data[0],
              score: score,
            };
            await updateUserAnswer(userAnswerId, updatedUserAnswer);
          }
        } catch (error) {
          console.error("Error saving user answer:", error);
        }
      };
      saveUserAnswer();
    }
  }, [score, userLogin, userAnswer]);

  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        bgcolor="#f5f5f5"
        padding={2}
      >
        <Paper elevation={3} sx={{ padding: 4, textAlign: "center" }}>
          <CheckCircleIcon color="primary" sx={{ fontSize: 50 }} />
          <Typography variant="h4" gutterBottom>
            Bạn đã hoàn thành bài thi!
          </Typography>
          <Typography variant="h6">
            Số câu trả lời đúng: {count} / {questions?.data.length}
          </Typography>
          <Typography variant="h6">Điểm số đạt được: {score} / 10</Typography>
          <Typography variant="h6">
            Thời gian làm bài: {formatTime(elapsedTimeLocal)}
          </Typography>
          <Box mt={3}>
            <Button
              variant="contained"
              color="primary"
              sx={{ marginRight: 2 }}
              onClick={() => {
                navigate("/");
              }}
            >
              Trang chủ
            </Button>
          </Box>
        </Paper>
      </Box>
    </>
  );
}
