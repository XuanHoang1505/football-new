namespace footballnew.Models
{
    public class ArticleCategory
    {
        public int ArticleId { get; set; }
        public int CategoryId { get; set; }
        public bool IsPrimary { get; set; }

        // Navigation
        public Article Article { get; set; } = null!;
        public Category Category { get; set; } = null!;
    }
}
