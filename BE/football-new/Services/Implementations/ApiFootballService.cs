using System.Net.Http.Headers;
using System.Text.Json;
using Microsoft.Extensions.Caching.Memory;
using footballnew.Services.Interfaces;

namespace footballnew.Services.Implementations
{
    public class ApiFootballService : IApiFootballService
    {
        private readonly HttpClient _httpClient;
        private readonly IMemoryCache _cache;

        public ApiFootballService(HttpClient httpClient, IConfiguration configuration, IMemoryCache cache)
        {
            _httpClient = httpClient;
            _cache = cache;

            _httpClient.BaseAddress = new Uri("https://v3.football.api-sports.io/");
            _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var apiKey = configuration["ApiFootball:ApiKey"];
            _httpClient.DefaultRequestHeaders.Add("x-apisports-key", apiKey);
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

        public async Task<object> GetTransfersByTeamAsync(int teamId)
        {
            string cacheKey = $"transfers_team_{teamId}";
            return await GetOrSetCacheAsync(cacheKey, async () =>
            {
                var response = await _httpClient.GetAsync($"transfers?team={teamId}");
                response.EnsureSuccessStatusCode();

                var json = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<object>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true })!;
            });
        }

        public async Task<object> GetTransfersByPlayerAsync(int playerId)
        {
            string cacheKey = $"transfers_player_{playerId}";
            return await GetOrSetCacheAsync(cacheKey, async () =>
            {
                var response = await _httpClient.GetAsync($"transfers?player={playerId}");
                response.EnsureSuccessStatusCode();

                var json = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<object>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true })!;
            });
        }
        public async Task<int?> FindPlayerIdAsync(string name, string? dob, int season = 2024)
        {
            // Tạo cache key để tránh gọi API nhiều lần
            string cacheKey = $"find_player_{name}_{dob}_{season}";

            return await GetOrSetCacheAsync(cacheKey, async () =>
            {
                var url = $"players?search={Uri.EscapeDataString(name)}&season={season}";
                var response = await _httpClient.GetAsync(url);
                response.EnsureSuccessStatusCode();

                var json = await response.Content.ReadAsStringAsync();
                using var doc = JsonDocument.Parse(json);

                foreach (var p in doc.RootElement.GetProperty("response").EnumerateArray())
                {
                    var birth = p.GetProperty("player").GetProperty("birth").GetProperty("date").GetString();

                    if (!string.IsNullOrEmpty(dob))
                    {
                        if (NormalizeDate(birth) == NormalizeDate(dob))
                        {
                            return p.GetProperty("player").GetProperty("id").GetInt32();
                        }
                    }
                    else
                    {
                        // Nếu không có dob thì chỉ match theo tên
                        return p.GetProperty("player").GetProperty("id").GetInt32();
                    }
                }
                return (int?)null;
            });
        }

        private static string NormalizeDate(string? date)
        {
            if (string.IsNullOrEmpty(date)) return "";
            return DateTime.TryParse(date, out var d) ? d.ToString("yyyy-MM-dd") : date;
        }

    }
}
