namespace footballnew.DTOs
{
    public class ArticleDetailDTO
{
    public int Id { get; set; }
    public string Title { get; set; } = null!;
    public string Content { get; set; } = null!;
    public string Slug { get; set; } = null!;
    public string AuthorName { get; set; } = null!;
    public DateTime DatePublished { get; set; }
    public int ViewCount { get; set; }
    public List<string> Tags { get; set; } = new();
    public List<string> Categories { get; set; } = new();
    public List<string> Images { get; set; } = new();
}
}