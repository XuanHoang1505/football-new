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

// 🆕 Lấy thông tin giải đấu
const getCompetitions = async () => {
  try {
    const response = await axiosInstance.get(`${API_URL}/competitions`);
    return response.data;
  } catch (error) {
    console.error("Error fetching competitions:", error);
    throw error;
  }
};

// 🆕 Lấy thông tin chi tiết 1 giải đấu
const getCompetitionDetail = async (leagueId) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/competitions/${leagueId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching competition detail:", error);
    throw error;
  }
};

const getTopScorers = async (leagueId, season) => {
  try {
    let url = `${API_URL}/scorers/${leagueId}`;
    if (season) url += `?season=${season}`;
    
    const { data } = await axiosInstance.get(url);
    return data;
  } catch (error) {
    console.error("Error fetching top scorers:", error);
    throw error;
  }
};

const getTeams = async (leagueId, season) => {
  try {
    const response = await axiosInstance.get(
      `${API_URL}/teams/${leagueId}?season=${season}`
    );
    return response.data;
    
  } catch (error) {
    console.error("Error fetching teams:", error);
    throw error;
  }
}

export const FootballService = {
  getStandings,
  getMatches,
  getCompetitions,       
  getCompetitionDetail,  
  getTopScorers,
  getTeams
};
