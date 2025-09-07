namespace footballnew.DTOs
{
namespace footballnew.DTOs
{
    public class PlayerCareerDto
    {
        public string Season { get; set; } = string.Empty;
        public string Competition { get; set; } = string.Empty;
        public string Team { get; set; } = string.Empty;
        public int Matches { get; set; }
        public int Goals { get; set; }
        public int YellowCards { get; set; }
        public int RedCards { get; set; }
    }
}

}