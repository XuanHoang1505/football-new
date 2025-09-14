using footballnew.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace footballnew.Data
{
    public class FootballContext : IdentityDbContext<ApplicationUser>
    {
        public FootballContext(DbContextOptions<FootballContext> options) : base(options)
        {
        }

        // DbSet cho các entity
        public DbSet<Article> Articles { get; set; }
        public DbSet<Image> Images { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<ArticleCategory> ArticleCategories { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<ArticleTag> ArticleTags { get; set; }
        public DbSet<ArticleViewHistory> ArticleViewHistories { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Đổi tên bảng Identity (bỏ tiền tố AspNet)
            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            {
                var tableName = entityType.GetTableName();
                if (tableName.StartsWith("AspNet"))
                {
                    entityType.SetTableName(tableName.Substring(6));
                }
            }

            // =====================
            // Fluent API Config
            // =====================

            // Article - Author (1 User -> nhiều Articles)
            modelBuilder.Entity<Article>()
                .HasOne(a => a.Author)
                .WithMany(u => u.ArticlesAuthored)
                .HasForeignKey(a => a.AuthorId)
                .OnDelete(DeleteBehavior.Restrict);

            // Article - UpdatedByUser (1 User -> nhiều Articles Updated)
            modelBuilder.Entity<Article>()
                .HasOne(a => a.UpdatedByUser)
                .WithMany(u => u.ArticlesUpdated)
                .HasForeignKey(a => a.UpdatedBy)
                .OnDelete(DeleteBehavior.Restrict);

            // ArticleViewHistory - User (1 User -> nhiều ViewHistories)
            modelBuilder.Entity<ArticleViewHistory>()
                .HasOne(vh => vh.User)
                .WithMany(u => u.ArticleViewHistories)
                .HasForeignKey(vh => vh.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Article - Image (1-nhiều)
            modelBuilder.Entity<Image>()
                .HasOne(i => i.Article)
                .WithMany(a => a.Images)
                .HasForeignKey(i => i.ArticleId)
                .OnDelete(DeleteBehavior.Cascade);

            // Category self reference (Parent - Children)
            modelBuilder.Entity<Category>()
                .HasOne(c => c.Parent)
                .WithMany(c => c.Children)
                .HasForeignKey(c => c.ParentId)
                .OnDelete(DeleteBehavior.Restrict);

            // Article - Category (nhiều-nhiều thông qua ArticleCategory)
            modelBuilder.Entity<ArticleCategory>()
                .HasKey(ac => new { ac.ArticleId, ac.CategoryId });

            modelBuilder.Entity<ArticleCategory>()
                .HasOne(ac => ac.Article)
                .WithMany(a => a.ArticleCategories)
                .HasForeignKey(ac => ac.ArticleId);

            modelBuilder.Entity<ArticleCategory>()
                .HasOne(ac => ac.Category)
                .WithMany(c => c.ArticleCategories)
                .HasForeignKey(ac => ac.CategoryId);

            // Article - Tag (nhiều-nhiều thông qua ArticleTag)
            modelBuilder.Entity<ArticleTag>()
                .HasKey(at => new { at.ArticleId, at.TagId });

            modelBuilder.Entity<ArticleTag>()
                .HasOne(at => at.Article)
                .WithMany(a => a.ArticleTags)
                .HasForeignKey(at => at.ArticleId);

            modelBuilder.Entity<ArticleTag>()
                .HasOne(at => at.Tag)
                .WithMany(t => t.ArticleTags)
                .HasForeignKey(at => at.TagId);

            // Article - ViewHistory (1-nhiều)
            modelBuilder.Entity<ArticleViewHistory>()
                .HasOne(vh => vh.Article)
                .WithMany(a => a.ViewHistories)
                .HasForeignKey(vh => vh.ArticleId)
                .OnDelete(DeleteBehavior.Cascade);

            // Unique cho Slug (nếu bạn muốn)
            modelBuilder.Entity<Article>()
                .HasIndex(a => a.Slug)
                .IsUnique();

            modelBuilder.Entity<Category>()
                .HasIndex(c => c.Slug)
                .IsUnique();

            modelBuilder.Entity<Tag>()
                .HasIndex(t => t.Slug)
                .IsUnique();
        }
    }
}
