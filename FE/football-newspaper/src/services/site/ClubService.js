import axiosInstance from "../../config/axiosInstance";

const API_URL = "/club";

const getClubDetail = async (clubId) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/${clubId}/detail`);
    return response.data;
  } catch (error) {
    console.error("Error fetching club detail:", error);
    throw error;
  }
};

const getClubMatches = async (clubId, season = null) => {
  try {
    let url = `${API_URL}/${clubId}/matches`;
    if (season) url += `?season=${season}`;

    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching club matches:", error);
    throw error;
  }
};

const getClubTransfers = async (clubId) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/${clubId}/transfers`);
    return response.data.response;
  } catch (error) {
    console.error("Error fetching club transfers:", error);
    throw error;
  }
};

export const ClubService = {
  getClubDetail,
  getClubMatches,
  getClubTransfers,
};
