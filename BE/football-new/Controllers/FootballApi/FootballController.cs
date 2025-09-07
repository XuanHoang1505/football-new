using footballnew.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace footballnew.Controllers.FootballApi
{
    [ApiController]
    [Route("api/football")]
    public class FootballController : ControllerBase
    {
        private readonly IFootballDataService _footballService;

        public FootballController(IFootballDataService footballService)
        {
            _footballService = footballService;
        }

        [HttpGet("competitions/{leagueCode}")]
        public async Task<IActionResult> GetCompetition(string leagueCode)
        {
            var competition = await _footballService.GetCompetitionAsync(leagueCode);
            return Ok(competition);
        }

        [HttpGet("standings/{leagueCode}")]
        public async Task<IActionResult> GetStandings(string leagueCode, int season)
        {
            var standings = await _footballService.GetStandingsAsync(leagueCode, season);
            return Ok(standings);
        }

        [HttpGet("matches/{leagueCode}")]
        public async Task<IActionResult> GetMatches(string leagueCode, int season)
        {
            var matches = await _footballService.GetMatchesAsync(leagueCode, season);
            return Ok(matches);
        }

        [HttpGet("scorers/{leagueCode}")]
        public async Task<IActionResult> GetTopScorers(string leagueCode, int season)
        {
            var scorers = await _footballService.GetTopScorersAsync(leagueCode, season);
            return Ok(scorers);
        }

        [HttpGet("teams/{leagueCode}")]
        public async Task<IActionResult> GetTeams(string leagueCode, int season)
        {
            var teams = await _footballService.GetTeamsAsync(leagueCode, season);
            return Ok(teams);
        }
    }
}
