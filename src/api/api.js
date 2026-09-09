import axios from "axios";

const apiBaseUrl = (
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:8081"
).replace(/\/+$/, "");

const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 180000,
});

api.interceptors.request.use(
  (config) => {
    const accessToken =
      localStorage.getItem("accessToken");

    if (accessToken) {
      config.headers.Authorization =
        `Bearer ${accessToken}`;
    }

    if (config.data instanceof FormData) {
      if (typeof config.headers.delete === "function") {
        config.headers.delete("Content-Type");
      } else {
        delete config.headers["Content-Type"];
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorCode = error.response?.data?.code;

    if (
      error.response?.status === 429 &&
      errorCode === "DAILY_AI_LIMIT_EXCEEDED"
    ) {
      const message =
        error.response?.data?.message ||
        "오늘 쓸 수 있는 AI기능을 다 썼습니다. 내일 다시 시도해주세요.";
      window.alert(message);
    }

    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userId");
      localStorage.removeItem("loginId");
      localStorage.removeItem("nickname");

      if (
        window.location.pathname !== "/login"
      ) {
        window.location.replace("/login");
      }
    }

    return Promise.reject(error);
  }
);

export default api;