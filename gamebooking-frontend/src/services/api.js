import axios from "axios";

const API = axios.create({
  baseURL: "https://localhost:7020/api"
});

export default API;
