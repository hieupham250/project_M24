import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { getAllQuestions } from "../services/service_admin/serviceQuestion";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getAllExams } from "../services/service_admin/serviceExam";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

export default function QuestionsPage() {
  let { examId } = useParams();
  const { data: questions } = useQuery({
    queryKey: ["questions", examId],
    queryFn: () => getAllQuestions(examId),
  });

  const { data: exams } = useQuery({
    queryKey: ["exams", examId],
    queryFn: () => getAllExams(examId),
  });
  let answersLocal = JSON.parse(localStorage.getItem("answers") || "[]");
  const [answers, setAnswers] = useState<any[]>(answersLocal || []);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const navigate = useNavigate();

  const optionLetters = ["A", "B", "C", "D"];

  const handleAnswerChange = (event: any, index: any) => {
    const newAnswers = [...answers];
    newAnswers[index] = event.target.value;
    setAnswers(newAnswers);
    localStorage.setItem("answers", JSON.stringify(newAnswers));
  };

  // lấy thời gian từ exam
  useEffect(() => {
    if (exams && exams?.data) {
      const savedTimeLeft = localStorage.getItem("timeLeft");
      if (savedTimeLeft) {
        setTimeLeft(Number(savedTimeLeft));
      } else {
        const duration = exams.data[0]?.duration || 0;
        setTimeLeft(duration * 60); // Chuyển đổi từ phút sang giây
      }
    }
  }, [exams]);

  useEffect(() => {
    if (!timeLeft) {
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prevTime: any) => {
        prevTime = prevTime - 1;
        if (prevTime == 0) {
          clearInterval(interval);
          handleTimeout();
          localStorage.removeItem("timeLeft");
          return 0;
        } else {
          localStorage.setItem("timeLeft", prevTime.toString()); // Lưu thời gian còn lại vào localStorage
          return prevTime;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const handleSubmit = () => {
    Swal.fire({
      title: "Bạn có muốn nộp bài?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Đúng vậy!",
    }).then((result) => {
      if (result.isConfirmed) {
        Cookies.set("userAnswer", JSON.stringify(answers));
        let timeLeftLocal = localStorage.getItem("timeLeft");
        localStorage.setItem(
          "elapsedTime",
          (exams?.data[0]?.duration * 60 - Number(timeLeftLocal)).toString()
        ); // lưu thời gian trôi qua sau khi kết thúc bài thi

        localStorage.removeItem("timeLeft");
        localStorage.removeItem("answers");

        navigate(`/examCompletionPage/${examId}`, {
          replace: true,
        });
      }
    });
  };

  const handleTimeout = () => {
    Swal.fire({
      title: "Hết giờ!",
      text: "Bài thi của bạn đã hết giờ.",
      icon: "info",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "OK",
    }).then(() => {
      Cookies.set("userAnswer", JSON.stringify(answers));
      let timeLeft = localStorage.getItem("timeLeft");
      localStorage.setItem(
        "elapsedTime",
        (exams?.data[0]?.duration * 60 - Number(timeLeft)).toString()
      ); // lưu thời gian trôi qua sau khi kết thúc bài thi

      localStorage.removeItem("timeLeft");
      navigate(`/examCompletionPage/${examId}`, {
        replace: true,
      });
    });
  };

  const formatTime = (seconds: any) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <>
      <Box component="section">
        <Grid container>
          <Grid
            item
            xs={9.4}
            sx={{
              backgroundColor: "white",
              marginRight: "10px",
              padding: "16px 36px",
              maxHeight: "565px",
              overflow: "auto",
              "&::-webkit-scrollbar": {
                width: "10px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#888",
                borderRadius: "4px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "#f1f1f1",
              },
            }}
          >
            {questions &&
              questions?.data?.map((question: any, index: number) => (
                <Box key={index}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">
                      {index + 1}. {question?.question}
                    </FormLabel>
                    <RadioGroup
                      name={`question-${index}`}
                      value={answers[index]}
                      onChange={(event) => handleAnswerChange(event, index)}
                    >
                      {question?.options.map((option: any, index: number) => (
                        <FormControlLabel
                          key={index}
                          value={option}
                          control={<Radio />}
                          label={`${optionLetters[index]}. ${option}`}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                </Box>
              ))}
          </Grid>
          <Grid item xs={2.5} sx={{ backgroundColor: "white", p: 2 }}>
            <Typography sx={{ textAlign: "center", marginBottom: "15px" }}>
              Thời gian còn lại: {formatTime(timeLeft)}
            </Typography>
            <Grid
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                marginBottom: "15px",
                maxHeight: "435px",
                overflow: "auto",
                "&::-webkit-scrollbar": {
                  width: "5px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#888",
                  borderRadius: "4px",
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: "#f1f1f1",
                },
              }}
            >
              {questions &&
                questions?.data?.map((_: any, index: any) => (
                  <Button
                    key={index}
                    variant={answers[index] ? "contained" : "outlined"}
                    sx={{
                      minWidth: "45px",
                      p: 1,
                    }}
                  >
                    {index + 1}
                  </Button>
                ))}
            </Grid>
            <Button
              variant="contained"
              sx={{ width: "100%" }}
              onClick={handleSubmit}
            >
              nộp bài
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
