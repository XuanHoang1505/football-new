using Microsoft.AspNetCore.Mvc;
using footballnew.Services.Interfaces;


namespace footballnew.Controllers.FootballApi
{
    [ApiController]
    [Route("api/club")]
    public class ClubController : ControllerBase
    {
        private readonly IFootballDataService _footballService;
        private readonly IApiFootballService _apiFootball;
        public ClubController(IFootballDataService footballService, IApiFootballService apiFootball)
        {
            _footballService = footballService;
            _apiFootball = apiFootball;
        }
        [HttpGet("{id}/detail")]
        public async Task<IActionResult> GetClubDetail(int id)
        {
            var result = await _footballService.GetClubDetailAsync(id);
            return Ok(result);
        }

        [HttpGet("{id}/matches")]
        public async Task<IActionResult> GetClubMatches(int id, [FromQuery] int? season = null)
        {
            var result = await _footballService.GetClubMatchesAsync(id, season);
            return Ok(result);
        }

        [HttpGet("{clubId}/transfers")]
        public async Task<IActionResult> GetTransfersByClub(int clubId)
        {
            var data = await _apiFootball.GetTransfersByTeamAsync(clubId);
            return Ok(data);
        }

    }
}