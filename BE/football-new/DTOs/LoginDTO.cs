using System.Text.Json.Serialization;

namespace footballnew.DTOs
{
    public class LoginDTO
    {
        [JsonPropertyName("username")]
        public string UserName { get; set; }
        [JsonPropertyName("password")]
        public string Password { get; set; }
    }
}