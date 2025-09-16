import axios from "axios";
import handleErrorResponse from "../../utils/errors/ErrorHandler";

const baseAxios = axios.create({
  baseURL: "http://localhost:5271/api/externalAuth",
});

// Login với Google
export const googleLogin = async (accessToken) => {
  try {
    const response = await baseAxios.post("/google", {
      accessToken,
    });

    let { accessToken: jwtToken, refreshToken } = response.data;

    if (jwtToken && jwtToken.startsWith("Bearer ")) {
      jwtToken = jwtToken.replace("Bearer ", "");
    }
    if (refreshToken && refreshToken.startsWith("Bearer ")) {
      refreshToken = refreshToken.replace("Bearer ", "");
    }

    if (jwtToken) localStorage.setItem("accessToken", jwtToken);
    if (refreshToken) localStorage.setItem("refreshToken", refreshToken);

    return response.data;
  } catch (error) {
    handleErrorResponse(error);
    throw error;
  }
};

// Login với Facebook
export const facebookLogin = async (accessToken) => {
  try {
    const response = await baseAxios.post("/facebook", {
      accessToken,
    });

    let { accessToken: jwtToken, refreshToken } = response.data;

    if (jwtToken && jwtToken.startsWith("Bearer ")) {
      jwtToken = jwtToken.replace("Bearer ", "");
    }
    if (refreshToken && refreshToken.startsWith("Bearer ")) {
      refreshToken = refreshToken.replace("Bearer ", "");
    }

    if (jwtToken) localStorage.setItem("accessToken", jwtToken);
    if (refreshToken) localStorage.setItem("refreshToken", refreshToken);

    return response.data;
  } catch (error) {
    handleErrorResponse(error);
    throw error;
  }
};

// Refresh token
export const refreshExternalToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) throw new Error("Refresh token not found");

    const response = await baseAxios.post(
      "/refresh-token",
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    );

    let { accessToken, refreshToken: newRefreshToken } = response.data;

    if (accessToken) localStorage.setItem("accessToken", accessToken);
    if (newRefreshToken) localStorage.setItem("refreshToken", newRefreshToken);

    return response.data;
  } catch (error) {
    handleErrorResponse(error);
    throw error;
  }
};
