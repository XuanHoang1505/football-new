using footballnew.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http;

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
    }

}
