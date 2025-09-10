using System.Net.Http.Headers;
using System.Text.Json;
using Microsoft.Extensions.Caching.Memory;
using footballnew.Services.Interfaces;
using footballnew.DTOs;

namespace footballnew.Services.Implementations
{
    public class FootballDataService : IFootballDataService
    {
        private readonly HttpClient _httpClient;
        private readonly IMemoryCache _cache;

        public FootballDataService(HttpClient httpClient, IConfiguration configuration, IMemoryCache cache)
        {
            _httpClient = httpClient;
            _cache = cache;

            _httpClient.BaseAddress = new Uri("https://api.football-data.org/v4/");
            _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var apiKey = configuration["FootballData:ApiKey"];
            _httpClient.DefaultRequestHeaders.Add("X-Auth-Token", apiKey);
        }

        private async Task<T> GetOrSetCacheAsync<T>(string cacheKey, Func<Task<T>> factory, int minutes = 15)
        {
            if (!_cache.TryGetValue(cacheKey, out T? cached))
            {
                cached = await factory();
                _cache.Set(cacheKey, cached, TimeSpan.FromMinutes(minutes));
            }
            return cached!;
        }

        public async Task<object> GetCompetitionAsync(string leagueCode)
        {
            string cacheKey = $"competition_{leagueCode}";
            return await GetOrSetCacheAsync(cacheKey, async () =>
            {
                var response = await _httpClient.GetAsync($"competitions/{leagueCode}");
                response.EnsureSuccessStatusCode();

                var json = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<object>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true })!;
            });
        }

        public async Task<object> GetStandingsAsync(string leagueCode, int season)
        {
            string cacheKey = $"standings_{leagueCode}_{season}";
            return await GetOrSetCacheAsync(cacheKey, async () =>
            {
                var response = await _httpClient.GetAsync($"competitions/{leagueCode}/standings?season={season}");
                response.EnsureSuccessStatusCode();

                var json = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<object>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true })!;
            });
        }

        public async Task<object> GetMatchesAsync(string leagueCode, int season)
        {
            string cacheKey = $"matches_{leagueCode}_{season}";
            return await GetOrSetCacheAsync(cacheKey, async () =>
            {
                var response = await _httpClient.GetAsync($"competitions/{leagueCode}/matches?season={season}");
                response.EnsureSuccessStatusCode();

                var json = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<object>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true })!;
            });
        }

        public async Task<object> GetTopScorersAsync(string leagueCode, int season)
        {
            string cacheKey = $"scorers_{leagueCode}_{season}";
            return await GetOrSetCacheAsync(cacheKey, async () =>
            {
                var response = await _httpClient.GetAsync($"competitions/{leagueCode}/scorers?season={season}");
                response.EnsureSuccessStatusCode();

                var json = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<object>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true })!;
            });
        }

        public async Task<object> GetTeamsAsync(string leagueCode, int season)
        {
            string cacheKey = $"teams_{leagueCode}_{season}";
            return await GetOrSetCacheAsync(cacheKey, async () =>
            {
                var response = await _httpClient.GetAsync($"competitions/{leagueCode}/teams?season={season}");
                response.EnsureSuccessStatusCode();

                var json = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<object>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true })!;
            });
        }
        public async Task<object> GetClubDetailAsync(int clubId)
        {
            string cacheKey = $"club_detail_{clubId}";
            return await GetOrSetCacheAsync(cacheKey, async () =>
            {
                var response = await _httpClient.GetAsync($"teams/{clubId}");
                response.EnsureSuccessStatusCode();

                var json = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<object>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true })!;
            });
        }

        public async Task<object> GetClubMatchesAsync(int clubId, int? season = null)
        {
            string cacheKey = $"club_matches_{clubId}_{season}";

            return await GetOrSetCacheAsync(cacheKey, async () =>
            {
                var url = $"teams/{clubId}/matches";

                if (season.HasValue)
                {
                    var dateFrom = new DateTime(season.Value, 8, 1).ToString("yyyy-MM-dd");
                    var dateTo = new DateTime(season.Value + 1, 5, 31).ToString("yyyy-MM-dd");

                    url += $"?dateFrom={dateFrom}&dateTo={dateTo}";
                }
                var response = await _httpClient.GetAsync(url);
                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    throw new Exception($"API Error {response.StatusCode}: {errorContent}");
                }
                var json = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<object>(json, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                })!;
            });
        }

        public async Task<object> GetPlayerDetailAsync(int playerId)
        {
            string cacheKey = $"player_detail_{playerId}";
            return await GetOrSetCacheAsync(cacheKey, async () =>
            {
                var response = await _httpClient.GetAsync($"persons/{playerId}");
                response.EnsureSuccessStatusCode();

                var json = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<object>(json, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                })!;
            });
        }

        public async Task<object> GetPlayerMatchesAsync(int playerId, int? season = null)
        {
            string cacheKey = $"player_matches_{playerId}_{season}";
            return await GetOrSetCacheAsync(cacheKey, async () =>
            {
                var url = $"persons/{playerId}/matches";

                if (season.HasValue)
                {
                    url += $"?season={season.Value}";
                }

                var response = await _httpClient.GetAsync(url);
                response.EnsureSuccessStatusCode();

                var json = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<object>(json, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                })!;
            });
        }
        public async Task<IEnumerable<PlayerCareerDto>> GetPlayerCareerAsync(int playerId)
        {
            // Lấy thông tin player để biết team hiện tại
            var playerDetail = await GetPlayerDetailAsync(playerId);
            var playerJson = JsonSerializer.Serialize(playerDetail);
            using var playerDoc = JsonDocument.Parse(playerJson);

            int playerTeamId = 0;
            if (playerDoc.RootElement.TryGetProperty("currentTeam", out var teamElement))
            {
                playerTeamId = teamElement.GetProperty("id").GetInt32();
            }
            else if (playerDoc.RootElement.TryGetProperty("team", out var teamElement2))
            {
                playerTeamId = teamElement2.GetProperty("id").GetInt32();
            }

            // Giống như code cũ nhưng bỏ tham số playerTeamId ở hàm
            var allMatches = new List<JsonElement>();
            int currentYear = DateTime.Now.Year;

            var matchesData = await GetPlayerMatchesAsync(playerId, currentYear);
            var matchesJson = JsonSerializer.Serialize(matchesData);
            using var doc = JsonDocument.Parse(matchesJson);

            if (doc.RootElement.TryGetProperty("matches", out var matchesElement))
            {
                allMatches.AddRange(matchesElement.EnumerateArray());
            }

var careerStats = allMatches
    .GroupBy(m =>
    {
        var season = $"{m.GetProperty("season").GetProperty("startDate").GetString()?.Substring(0, 4)}/" +
                     $"{m.GetProperty("season").GetProperty("endDate").GetString()?.Substring(0, 4)}";

        var competition = m.GetProperty("competition").GetProperty("name").GetString();

        var homeTeamId = m.GetProperty("homeTeam").GetProperty("id").GetInt32();
        var awayTeamId = m.GetProperty("awayTeam").GetProperty("id").GetInt32();

        string teamName;
        string teamCrest;

        if (homeTeamId == playerTeamId)
        {
            teamName = m.GetProperty("homeTeam").GetProperty("name").GetString();
            teamCrest = m.GetProperty("homeTeam").GetProperty("crest").GetString();
        }
        else
        {
            teamName = m.GetProperty("awayTeam").GetProperty("name").GetString();
            teamCrest = m.GetProperty("awayTeam").GetProperty("crest").GetString();
        }

        return new { Season = season, Competition = competition, Team = teamName, Crest = teamCrest };
    })
    .Select(g => new PlayerCareerDto
    {
        Season = g.Key.Season ?? "",
        Competition = g.Key.Competition ?? "",
        Team = g.Key.Team ?? "",
        Crest = g.Key.Crest ?? "",
        Matches = g.Count(),
        Wins = g.Count(m =>
        {
            var homeGoals = m.GetProperty("score").GetProperty("fullTime").GetProperty("home").GetInt32();
            var awayGoals = m.GetProperty("score").GetProperty("fullTime").GetProperty("away").GetInt32();

            var homeTeamId = m.GetProperty("homeTeam").GetProperty("id").GetInt32();
            var awayTeamId = m.GetProperty("awayTeam").GetProperty("id").GetInt32();

            if (homeTeamId == playerTeamId)
                return homeGoals > awayGoals;
            else if (awayTeamId == playerTeamId)
                return awayGoals > homeGoals;

            return false;
        }),
        Draws = g.Count(m =>
        {
            var homeGoals = m.GetProperty("score").GetProperty("fullTime").GetProperty("home").GetInt32();
            var awayGoals = m.GetProperty("score").GetProperty("fullTime").GetProperty("away").GetInt32();
            return homeGoals == awayGoals;
        }),
        Losses = g.Count(m =>
        {
            var homeGoals = m.GetProperty("score").GetProperty("fullTime").GetProperty("home").GetInt32();
            var awayGoals = m.GetProperty("score").GetProperty("fullTime").GetProperty("away").GetInt32();

            var homeTeamId = m.GetProperty("homeTeam").GetProperty("id").GetInt32();
            var awayTeamId = m.GetProperty("awayTeam").GetProperty("id").GetInt32();

            if (homeTeamId == playerTeamId)
                return homeGoals < awayGoals;
            else if (awayTeamId == playerTeamId)
                return awayGoals < homeGoals;

            return false;
        })
    })
    .OrderByDescending(x => x.Season)
    .ToList();


            return careerStats;
        }



    }
}
