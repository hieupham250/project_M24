import {
  Box,
  Button,
  Grid,
  Pagination,
  TextField,
  Typography,
} from "@mui/material";
import { Favorite } from "@mui/icons-material";
import { useQuery } from "react-query";
import { getAllExams } from "../services/service_admin/serviceExam";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function ExamsPage() {
  let { examSubjectId } = useParams();
  const [examSearch, setExamSearch] = useState<string>("");
  const { data: exams } = useQuery({
    queryKey: ["exams", examSubjectId, examSearch],
    queryFn: () => getAllExams(examSubjectId, examSearch),
  });
  const [userLogin, setUserLogin] = useState<any>();

  useEffect(() => {
    const userLoginCookie = Cookies.get("user");

    if (userLoginCookie) {
      setUserLogin(JSON.parse(userLoginCookie));
    }
  }, []);

  const navigate = useNavigate();

  const handleExamClick = (examId: any) => {
    if (userLogin) {
      localStorage.removeItem("elapsedTime");
      localStorage.removeItem("timeLeft");
      localStorage.removeItem("answers");
      navigate(`/course/examSubject/exam/question/${examId}`);
    } else {
      Swal.fire({
        title: "Bạn chưa đăng nhập!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Đăng nhập",
      }).then(async (result) => {
        if (result.isConfirmed) {
          navigate(`/login`);
        }
      });
    }
  };

  const [page, setPage] = useState(1);
  const examsPerPage = 4;
  let pageCount = Math.ceil(exams?.data?.length / examsPerPage);

  const handleChangePage = (event: any, value: any) => {
    setPage(value);
  };

  const startIndex = (page - 1) * examsPerPage;
  const visibleExam = exams?.data?.slice(startIndex, startIndex + examsPerPage);

  return (
    <>
      <Grid container>
        <Grid item xs={8.8} sx={{ marginRight: "10px" }}>
          <Box sx={{ padding: "0 5px" }}>
            <Typography
              sx={{
                padding: "5px 10px",
                margin: "0 0 20px 0",
                fontSize: "30px",
                backgroundColor: "white",
                borderRadius: "10px",
              }}
            >
              Tất cả đề thi
            </Typography>
            <Grid container spacing={2}>
              {visibleExam?.map((exam: any, index: any) => (
                <Grid item xs={6} key={index}>
                  <Typography
                    sx={{
                      color: "white",
                      backgroundColor: "#145da0",
                      fontSize: "20px",
                      padding: "3px 10px",
                      borderRadius: "10px 10px 0 0",
                    }}
                  >
                    {exam.title}
                  </Typography>
                  <Box
                    sx={{
                      position: "relative",
                      backgroundColor: "black",
                      height: "220px",
                      padding: "20px",
                      backgroundImage: `url(https://storage.tracnghiem.vn/public/trac-nghiem-online-mon-toan.jpg)`,
                      backgroundSize: "cover",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        position: "absolute",
                        top: "5px",
                        right: "10px",
                        color: "white",
                        fontSize: "20px",
                      }}
                    >
                      <Favorite
                        sx={{
                          "&:hover": {
                            cursor: "pointer",
                          },
                        }}
                      />
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{
                        position: "absolute",
                        bottom: "5px",
                        right: "10px",
                      }}
                      onClick={() => handleExamClick(exam.id)}
                    >
                      Làm bài thi
                    </Button>
                  </Box>
                  <Typography
                    sx={{
                      backgroundColor: "white",
                      padding: "10px",
                      borderTop: "1px solid black",
                      borderRadius: "0 0 10px 10px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {exam.description}
                  </Typography>
                </Grid>
              ))}
            </Grid>
            <Pagination
              count={pageCount || 0}
              page={page}
              onChange={handleChangePage}
              color="primary"
              size="large"
              sx={{
                marginTop: "20px",
                padding: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "white",
                borderRadius: "10px",
              }}
            />
          </Box>
        </Grid>
        <Grid
          item
          xs={3}
          sx={{
            padding: "16px",
            backgroundColor: "white",
            borderRadius: "10px",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                id="outlined-basic"
                label="Nhập từ khóa tìm kiếm"
                value={examSearch}
                sx={{ width: "100%" }}
                onChange={(e) => setExamSearch(e.target.value)}
              />
            </Grid>
            {/* <Grid item xs={12}>
              <Button
                sx={{ width: "100%" }}
                variant="contained"
                onClick={() => setExamSearch("")}
              >
                Bỏ lọc
              </Button>
            </Grid> */}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
