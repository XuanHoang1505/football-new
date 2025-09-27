namespace footballnew.DTOs
{
    public class ImageDTO
    {
        public int Id { get; set; }
        public string Url { get; set; } = null!;
        public string? AltText { get; set; }
        public string? Caption { get; set; }
        public bool IsMain { get; set; }
        public DateTime UploadDate { get; set; }
        public string? Credits { get; set; }
    }
}
