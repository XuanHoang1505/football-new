namespace footballnew.DTOs
{
    public class ArticleListDTO
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string Summary { get; set; } = null!;
        public string Slug { get; set; } = null!;
        public DateTime DatePublished { get; set; }
        public string AuthorName { get; set; } = null!;
        public string? ImageUrl { get; set; }
        public DateTime? ViewAt { get; set; }
        public string? CategoryName { get; set; }
    }
}