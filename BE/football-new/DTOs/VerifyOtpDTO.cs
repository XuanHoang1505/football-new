using System.Text.Json.Serialization;

namespace footballnew.DTOs
{
    public class VerifyOtpDTO
    {
        [JsonPropertyName("identifier")]
        public string Identifier { get; set; }
        [JsonPropertyName("otp")]
        public string Otp { get; set; }
    }
}
