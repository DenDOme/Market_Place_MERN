import axios from "axios";

const API = axios.create({
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;
