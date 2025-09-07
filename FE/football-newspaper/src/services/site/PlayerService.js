import axiosInstance from "../../config/axiosInstance";

const API_URL = "/player";

const getPlayerDetail = async (playerId) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/${playerId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching player detail:", error);
    throw error;
  }
};

const getPlayerMatches = async (playerId, season = null) => {
  try {
    let url = `${API_URL}/${playerId}/matches`;
    if (season) url += `?season=${season}`;

    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching player matches:", error);
    throw error;
  }
};

const getPlayerCareer = async (playerId) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/${playerId}/career`);
    return response.data;
  } catch (error) {
    console.error("Error fetching player career:", error);
    throw error;
  }
};

export const PlayerService = {
  getPlayerDetail,
  getPlayerMatches,
  getPlayerCareer,
};
