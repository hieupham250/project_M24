import { Box, Grid, Typography } from "@mui/material";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import FmdGoodIcon from "@mui/icons-material/FmdGood";
import EmailIcon from "@mui/icons-material/Email";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";

export default function Footer() {
  return (
    <>
      <Box
        component="footer"
        sx={{ padding: "10px 30px", backgroundColor: "white" }}
      >
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <img src="/src/assets/images/logo/trac-nghiem-online.png" alt="" />
            <Typography sx={{ paddingRight: "1rem" }}>
              Thi trắc nghiệm online với hàng ngàn đề thi, ngân hàng câu hỏi
              phong phú đa dạng trên nhiều lĩnh vực
            </Typography>
            <Grid container spacing={2}>
              <Grid item>
                <a href="#">
                  <FacebookRoundedIcon sx={{ fontSize: "45px" }} />
                </a>
              </Grid>
              <Grid item>
                <a href="#">
                  <InstagramIcon sx={{ fontSize: "45px" }} />
                </a>
              </Grid>
              <Grid item>
                <a href="#">
                  <TwitterIcon sx={{ fontSize: "45px" }} />
                </a>
              </Grid>
              <Grid item>
                <a href="#">
                  <LinkedInIcon sx={{ fontSize: "45px" }} />
                </a>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={3}>
            <Typography
              sx={{
                fontSize: "1.125rem",
                fontWeight: 700,
                marginBottom: "20px",
              }}
            >
              Liên hệ
            </Typography>
            <ul>
              <li style={{ display: "flex", textAlign: "center", gap: "4px" }}>
                <span>
                  <FmdGoodIcon></FmdGoodIcon>
                </span>
                <span>Hà Đông, Hà Nội</span>
              </li>
              <li style={{ display: "flex", textAlign: "center", gap: "4px" }}>
                <span>
                  <EmailIcon></EmailIcon>
                </span>
                <span>ptrunghieu2507@gmail.com</span>
              </li>
              <li style={{ display: "flex", textAlign: "center", gap: "4px" }}>
                <span>
                  <LocalPhoneIcon></LocalPhoneIcon>
                </span>
                <span>0846462676</span>
              </li>
            </ul>
          </Grid>
          <Grid item xs={3}>
            <Typography
              sx={{
                fontSize: "1.125rem",
                fontWeight: 700,
                marginBottom: "20px",
              }}
            >
              Liên kết
            </Typography>
            <ul>
              <li style={{ marginBottom: "5px" }}>
                <a href="#" style={{ color: "black" }}>
                  liên hệ
                </a>
              </li>
              <li style={{ marginBottom: "5px" }}>
                <a href="#" style={{ color: "black" }}>
                  Đề thi
                </a>
              </li>
              <li style={{ marginBottom: "5px" }}>
                <a href="#" style={{ color: "black" }}>
                  Thời tiết
                </a>
              </li>
              <li style={{ marginBottom: "5px" }}>
                <a href="#" style={{ color: "black" }}>
                  Công cụ online
                </a>
              </li>
            </ul>
          </Grid>
          <Grid item xs={3}>
            <Typography
              sx={{
                fontSize: "1.125rem",
                fontWeight: 700,
                marginBottom: "20px",
              }}
            >
              Điều khoản & điều kiện
            </Typography>
            <ul>
              <li style={{ marginBottom: "5px" }}>
                <a href="#" style={{ color: "black" }}>
                  Hướng dẫn dành cho học sinh
                </a>
              </li>
              <li style={{ marginBottom: "5px" }}>
                <a href="#" style={{ color: "black" }}>
                  Hướng dẫn dành cho giáo viên
                </a>
              </li>
              <li style={{ marginBottom: "5px" }}>
                <a href="#" style={{ color: "black" }}>
                  Chính sách quyền riêng tư
                </a>
              </li>
              <li style={{ marginBottom: "5px" }}>
                <a href="#" style={{ color: "black" }}>
                  Điều khoản dịch vụ
                </a>
              </li>
            </ul>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
