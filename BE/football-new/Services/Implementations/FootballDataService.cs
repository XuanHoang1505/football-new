using System.Net.Http.Headers;
using System.Text.Json;
using footballnew.Services.Interfaces;

namespace footballnew.Services.Implementations
{
    public class FootballDataService : IFootballDataService
    {
        private readonly HttpClient _httpClient;

        public FootballDataService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _httpClient.BaseAddress = new Uri("https://api.football-data.org/v4/");
            _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var apiKey = configuration["FootballData:ApiKey"];
            _httpClient.DefaultRequestHeaders.Add("X-Auth-Token", apiKey);
        }

        public async Task<object> GetStandingsAsync(string leagueCode, int season)
        {
            var response = await _httpClient.GetAsync($"competitions/{leagueCode}/standings?season={season}");
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<object>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        }

        public async Task<object> GetMatchesAsync(string leagueCode, int season)
        {
            var response = await _httpClient.GetAsync($"competitions/{leagueCode}/matches?season={season}");
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<object>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        }

        public async Task<object> GetTopScorersAsync(string leagueCode, int season)
        {
            var response = await _httpClient.GetAsync($"competitions/{leagueCode}/scorers?season={season}");
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<object>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        }
    }

}