using Microsoft.AspNetCore.Mvc;
using footballnew.Services.Interfaces;

namespace footballnew.Controllers.FootballApi
{
    [ApiController]
    [Route("api/player")]
    public class PlayerController : ControllerBase
    {
        private readonly IFootballDataService _footballService;
        private readonly IApiFootballService _apiService;

        public PlayerController(IFootballDataService footballService, IApiFootballService apiService)
        {
            _footballService = footballService;
            _apiService = apiService;
        }

        [HttpGet("find")]
        public async Task<IActionResult> FindPlayer([FromQuery] string name, [FromQuery] string? dob)
        {
            var playerId = await _apiService.FindPlayerIdAsync(name, dob);

            if (playerId == null)
                return NotFound(new { message = "Không tìm thấy cầu thủ" });

            return Ok(new { ApiFootballId = playerId });
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

        [HttpGet("{playerId}/transfers")]
        public async Task<IActionResult> GetPlayerTransfers(int playerId)
        {
            var result = await _apiService.GetTransfersByPlayerAsync(playerId);
            return Ok(result);
        }

        [HttpGet("transfers/find")]
        public async Task<IActionResult> GetTransfersByNameDob([FromQuery] string name, [FromQuery] string? dob)
        {
            var playerId = await _apiService.FindPlayerIdAsync(name, dob);
            if (playerId == null)
                return NotFound(new { message = "Không tìm thấy cầu thủ" });

            var transfers = await _apiService.GetTransfersByPlayerAsync(playerId.Value);
            return Ok(transfers);
        }

    }
}