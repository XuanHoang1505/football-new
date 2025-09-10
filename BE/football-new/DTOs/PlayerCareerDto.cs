
namespace footballnew.DTOs
{
    public class PlayerCareerDto
    {
        public string Season { get; set; } = "";
        public string Competition { get; set; } = "";
        public string Team { get; set; } = "";
        public string Crest { get; set; } = "";

        public int Matches { get; set; }

        public int Wins { get; set; }
        public int Draws { get; set; }
        public int Losses { get; set; }
    }

}
