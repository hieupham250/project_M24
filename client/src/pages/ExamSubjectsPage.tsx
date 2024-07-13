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
import { getAllExamSubjects } from "../services/service_admin/serviceExamSubject";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

export default function ExamSubjectsPage() {
  let { courseId } = useParams();
  const [examSubjectSearch, setExamSubjectSearch] = useState<string>("");
  const { data: examSubjects } = useQuery({
    queryKey: ["examSubjects", courseId, examSubjectSearch],
    queryFn: () => getAllExamSubjects(courseId, examSubjectSearch),
  });
  const navigate = useNavigate();

  const handleExamSubjectClick = (examSubjectId: number) => {
    navigate(`/course/examSubject/exam/${examSubjectId}`, {
      replace: true,
    });
  };

  const [page, setPage] = useState(1);
  const examSubjectsPerPage = 4;
  let pageCount = Math.ceil(examSubjects?.data?.length / examSubjectsPerPage);

  const handleChangePage = (event: any, value: any) => {
    setPage(value);
  };

  const startIndex = (page - 1) * examSubjectsPerPage;
  const visibleExamSubjects = examSubjects?.data?.slice(
    startIndex,
    startIndex + examSubjectsPerPage
  );

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
              Tất cả môn thi
            </Typography>
            <Grid container spacing={2}>
              {visibleExamSubjects?.map((examSubject: any, index: number) => (
                <Grid item xs={6} key={index}>
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
                      borderRadius: "10px 10px 0 0",
                      "&:hover": {
                        cursor: "pointer",
                      },
                    }}
                    onClick={() => handleExamSubjectClick(examSubject.id)}
                  >
                    <Typography
                      sx={{
                        position: "absolute",
                        top: "0",
                        left: "0 ",
                        color: "white",
                        backgroundColor: "#145da0",
                        fontSize: "20px",
                        padding: "3px 10px",
                        borderRadius: "10px 0 10px 0",
                        wordBreak: "break-word",
                        maxWidth: "90%",
                      }}
                    >
                      {examSubject.title}
                    </Typography>
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
                  </Box>
                  <Typography
                    sx={{
                      backgroundColor: "white",
                      padding: "10px",
                      borderTop: "1px solid black",
                      borderRadius: "0 0 10px 10px",
                      wordBreak: "break-word",
                    }}
                  >
                    {examSubject.description}
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
                value={examSubjectSearch}
                sx={{ width: "100%" }}
                onChange={(e) => setExamSubjectSearch(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                sx={{ width: "100%" }}
                variant="contained"
                onClick={() => setExamSubjectSearch("")}
              >
                Bỏ lọc
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
