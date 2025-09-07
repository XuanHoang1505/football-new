using Microsoft.AspNetCore.Mvc;
using footballnew.Services.Interfaces;

namespace footballnew.Controllers.FootballApi
{
    [ApiController]
    [Route("api/player")]
    public class PlayerController : ControllerBase
    {
        private readonly IFootballDataService _footballService;

        public PlayerController(IFootballDataService footballService)
        {
            _footballService = footballService;
        }
        [HttpGet("{playerId}")]
        public async Task<IActionResult> GetPlayerDetail(int playerId)
        {
            var result = await _footballService.GetPlayerDetailAsync(playerId);
            return Ok(result);
        }

        [HttpGet("{playerId}/matches")]
        public async Task<IActionResult> GetPlayerMatches(int playerId, [FromQuery] int? season)
        {
            var result = await _footballService.GetPlayerMatchesAsync(playerId, season);
            return Ok(result);
        }

        [HttpGet("{playerId}/career")]
        public async Task<IActionResult> GetPlayerCareer(int playerId)
        {
            var result = await _footballService.GetPlayerCareerAsync(playerId);
            return Ok(result);
        }

    }
}