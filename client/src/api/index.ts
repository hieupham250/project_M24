import axios from "axios";

const baseUrl = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "content-Type": "application/json",
  },
});

export default baseUrl;
