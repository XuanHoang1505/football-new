using System;
using footballnew.Data;

namespace footballnew.Models
{
    public class ArticleViewHistory
    {
        public int Id { get; set; }

        public string UserId { get; set; } = null!;
        public ApplicationUser User { get; set; } = null!;

        public int ArticleId { get; set; }
        public Article Article { get; set; } = null!;

        public DateTime ViewAt { get; set; }
    }
}
