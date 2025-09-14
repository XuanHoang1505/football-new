import axios from "axios";
import { jwtDecode } from "jwt-decode";
import handleErrorResponse from "../utils/errors/ErrorHandler";
import { refreshToken } from "../services/site/AuthService";
import { toast } from "react-toastify";

// Axios có interceptor (dùng cho toàn site)
const axiosInstance = axios.create({
  baseURL: "http://localhost:5271/api/",
});

let isRefreshing = false;
let refreshSubscribers = [];

const onRefreshed = (newAccessToken) => {
  refreshSubscribers.forEach((callback) => callback(newAccessToken));
  refreshSubscribers = [];
};

const addSubscriber = (callback) => {
  refreshSubscribers.push(callback);
};

// Interceptor request: tự gắn accessToken vào header
axiosInstance.interceptors.request.use(
  async (config) => {
    let accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      const decodedToken = jwtDecode(accessToken);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        // accessToken hết hạn
        if (!isRefreshing) {
          isRefreshing = true;
          try {
            const tokenResponse = await refreshToken();
            localStorage.setItem("accessToken", tokenResponse.accessToken);
            localStorage.setItem("refreshToken", tokenResponse.refreshToken);
            isRefreshing = false;
            onRefreshed(tokenResponse.accessToken);
            accessToken = tokenResponse.accessToken;
          } catch (error) {
            isRefreshing = false;
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("userDetail");

             toast.warning("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
            window.location.href = "/";
            return Promise.reject(error);
          }
        } else {
          // Nếu đang refresh, queue request lại
          return new Promise((resolve) => {
            addSubscriber((newAccessToken) => {
              config.headers["Authorization"] = newAccessToken;
              resolve(config);
            });
          });
        }
      }

      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor response
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    handleErrorResponse(error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
