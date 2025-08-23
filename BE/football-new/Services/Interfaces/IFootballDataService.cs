namespace footballnew.Services.Interfaces
{
    public interface IFootballDataService
    {
        Task<object> GetStandingsAsync(string leagueCode, int season);
        Task<object> GetMatchesAsync(string leagueCode, int season);
        Task<object> GetTopScorersAsync(string leagueCode, int season);
    }

}