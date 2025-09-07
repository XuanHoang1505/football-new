using footballnew.DTOs.footballnew.DTOs;

namespace footballnew.Services.Interfaces
{
    public interface IFootballDataService
    {
        Task<object> GetCompetitionAsync(string leagueCode);  // ✅ Thông tin giải đấu
        Task<object> GetStandingsAsync(string leagueCode, int season);
        Task<object> GetMatchesAsync(string leagueCode, int season);
        Task<object> GetTopScorersAsync(string leagueCode, int season);
        Task<object> GetTeamsAsync(string leagueCode, int season); // ✅ Danh sách CLB


        // ✅ Câu lạc bộ
        Task<object> GetClubDetailAsync(int clubId);
        Task<object> GetClubMatchesAsync(int clubId, int? season = null);

        // ✅ Player
        Task<object> GetPlayerDetailAsync(int playerId);
        Task<object> GetPlayerMatchesAsync(int playerId, int? season = null);
        Task<IEnumerable<PlayerCareerDto>> GetPlayerCareerAsync(int playerId);

    }

}