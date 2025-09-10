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

const getPlayerTransfers = async (playerId) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/${playerId}/transfers`);
    return response.data;
  } catch (error) {
    console.error("Error fetching player transfers:", error);
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

/**
 * Tìm cầu thủ bên API-Football theo name + dob
 * @param {string} name - Tên cầu thủ
 * @param {string} dob - Ngày sinh (yyyy-mm-dd) (optional)
 */
const findPlayer = async (name, dob = null) => {
  try {
    let url = `${API_URL}/find?name=${encodeURIComponent(name)}`;
    if (dob) url += `&dob=${encodeURIComponent(dob)}`;

    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error("Error finding player:", error);
    throw error;
  }
};

/**
 * Lấy transfer bằng name + dob (tìm ID rồi trả transfers luôn)
 */
const getTransfersByNameDob = async (name, dob = null) => {
  try {
    let url = `${API_URL}/transfers/find?name=${encodeURIComponent(name)}`;
    if (dob) url += `&dob=${encodeURIComponent(dob)}`;

    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching transfers by name/dob:", error);
    throw error;
  }
};

export const PlayerService = {
  getPlayerDetail,
  getPlayerMatches,
  getPlayerCareer,
  getPlayerTransfers,
  findPlayer,
  getTransfersByNameDob,
};
