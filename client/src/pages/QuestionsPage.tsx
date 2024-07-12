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

  const [answers, setAnswers] = useState<any[]>([]);
  const [timeLeft, setTimeLeft] = useState<number | null | any>(null);
  const navigate = useNavigate();

  const optionLetters = ["A", "B", "C", "D"];

  const handleAnswerChange = (event: any, index: any) => {
    const newAnswers = [...answers];
    newAnswers[index] = event.target.value;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    alert("Nộp bài");
    Cookies.set("userAnswer", JSON.stringify(answers));
    localStorage.setItem("ExamTimer", timeLeft.toString());
    localStorage.removeItem("timeLeft");
    navigate(`/examCompletionPage/${examId}`, {
      replace: true,
    });
  };

  useEffect(() => {
    if (exams && exams?.data) {
      const savedTimeLeft = localStorage.getItem("timeLeft");
      if (savedTimeLeft) {
        setTimeLeft(parseInt(savedTimeLeft));
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
        if (prevTime <= 1) {
          clearInterval(interval);
          handleSubmit();
          localStorage.removeItem("timeLeft");
          return 0;
        }
        const newTime = prevTime - 1;
        localStorage.setItem("timeLeft", newTime.toString()); // Lưu thời gian còn lại vào localStorage
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

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
              Thời gian: {formatTime(timeLeft)}
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
                    variant="outlined"
                    sx={{ minWidth: "45px", p: 1 }}
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
