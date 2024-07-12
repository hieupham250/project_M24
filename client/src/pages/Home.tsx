import { Box } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Footer from "../layout/Footer";
import Header from "../layout/Header";
import { Route, Routes } from "react-router-dom";
import CoursesPage from "./CoursesPage";
import ExamSubjectsPage from "./ExamSubjectsPage";
import ExamsPage from "./ExamsPage";
import QuestionsPage from "./QuestionsPage";
import ExamCompletionPage from "./ExamCompletionPage";

export default function Home() {
  const carouselItems = [
    {
      imgPath: "/src/assets/images/banners/banner1.jpg",
    },
    {
      imgPath: "/src/assets/images/banners/banner2.jpg",
    },
    {
      imgPath: "/src/assets/images/banners/banner3.jpg",
    },
    {
      imgPath: "/src/assets/images/banners/banner4.jpg",
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
  };

  return (
    <>
      <Header></Header>
      <Box component="section" sx={{ margin: "30px 20px" }}>
        <Box sx={{ width: "98.5%", marginBottom: "20px", marginLeft: "10px" }}>
          <Slider {...settings}>
            {carouselItems.map((item, index) => (
              <div key={index}>
                <Box
                  component="img"
                  sx={{
                    height: 400,
                    display: "block",
                    overflow: "hidden",
                    width: "100%",
                  }}
                  src={item.imgPath}
                />
              </div>
            ))}
          </Slider>
        </Box>
        <Box sx={{ flexGrow: 1, padding: 2, marginLeft: "15px" }}>
          <Routes>
            <Route path="/" element={<CoursesPage></CoursesPage>}></Route>
            <Route
              path="course/examSubject/:courseId"
              element={<ExamSubjectsPage></ExamSubjectsPage>}
            ></Route>
            <Route
              path="course/examSubject/exam/:examSubjectId"
              element={<ExamsPage></ExamsPage>}
            ></Route>
            <Route
              path="course/examSubject/exam/question/:examId"
              element={<QuestionsPage></QuestionsPage>}
            ></Route>
            <Route
              path="/examCompletionPage/:examId"
              element={<ExamCompletionPage></ExamCompletionPage>}
            ></Route>
          </Routes>
        </Box>
      </Box>
      <Footer></Footer>
    </>
  );
}
