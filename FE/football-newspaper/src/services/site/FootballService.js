import axiosInstance from "../../config/axiosInstance";

const API_URL = "/football";

const getStandings = async (leagueId, season) => {
  try {
    let url = `${API_URL}/standings/${leagueId}`;
    if (season) {
      url += `?season=${season}`;
    }
    
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching standings:", error);
    throw error;
  }
};

const getMatches = async (leagueId, season) => {
  try {
    const response = await axiosInstance.get(
      `${API_URL}/matches/${leagueId}?season=${season}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching matches:", error);
    throw error;
  }
};

export const FootballService = {
  getStandings,
  getMatches,
};
