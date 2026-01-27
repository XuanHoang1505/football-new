using System.Collections.Generic;

namespace footballnew.Models
{
    public class Tag
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Slug { get; set; } = null!;

        // Navigation
        public ICollection<ArticleTag> ArticleTags { get; set; } = new List<ArticleTag>();
    }
}
