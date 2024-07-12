import { DataGrid, GridRenderCellParams, viVN } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { useQuery } from "react-query";
import { getAllUserAnswers } from "../../services/service_user/serviceUserAnswer";
import { getAllExams } from "../../services/service_admin/serviceExam";
import { useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";
import { useNavigate } from "react-router-dom";

export default function ExamHistory() {
  const { data: userAnswers } = useQuery({
    queryKey: ["userAnswers"],
    queryFn: () => getAllUserAnswers(),
  });

  const { data: exams } = useQuery({
    queryKey: ["exams"],
    queryFn: () => getAllExams(),
  });

  const [userLogin, setUserLogin] = useState<any>();
  const navigate = useNavigate();

  useEffect(() => {
    const userLoginCookie = Cookies.get("user");
    if (userLoginCookie) {
      setUserLogin(JSON.parse(userLoginCookie));
    } else {
      navigate("/404");
    }
  }, []);

  const rows = useMemo(() => {
    if (!userAnswers) {
      return [];
    }
    return userAnswers?.data
      ?.filter((userAnswer: any) => userAnswer.userId == userLogin.id)
      .map((userAnswer: any, index: number) => ({
        serialNumber: index + 1,
        id: userAnswer.id,
        examTitle: exams?.data?.find(
          (exam: any) => exam.id === userAnswer.examId
        )?.title,
        score: userAnswer.score,
      }));
  }, [userAnswers, exams]);

  const columns = [
    { field: "serialNumber", headerName: "STT", width: 120 },
    { field: "examTitle", headerName: "Đề thi", width: 270 },
    { field: "score", headerName: "Điểm", width: 270 },
  ];

  return (
    <>
      <Header></Header>
      <Box
        sx={{
          height: 400,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "20px 0",
        }}
      >
        <div style={{ height: 400, width: "50%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[5, 10]}
            localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
            disableColumnSelector={true}
            disableRowSelectionOnClick
          />
        </div>
      </Box>
      <Footer></Footer>
    </>
  );
}
