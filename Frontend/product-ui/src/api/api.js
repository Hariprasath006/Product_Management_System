import axios from "axios";

export const API = axios.create({
  baseURL: "https://product-management-system-dtzj.onrender.com",
});

export const authConfig = (username, password) => ({
  auth: { username, password }
});
