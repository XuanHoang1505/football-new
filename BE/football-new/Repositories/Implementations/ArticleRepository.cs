using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using footballnew.Data;
using footballnew.Models;
using footballnew.Repositories.Interfaces;
using footballnew.DTOs;

namespace footballnew.Repositories.Implementations
{
    public class ArticleRepository : IArticleRepository
    {
        private readonly FootballContext _context;

        public ArticleRepository(FootballContext context)
        {
            _context = context;
        }

        public async Task<Article?> GetByIdAsync(int id)
        {
            return await _context.Articles
                .Include(a => a.Author)
                .Include(a => a.Images)
                .Include(a => a.ArticleCategories).ThenInclude(ac => ac.Category)
                .Include(a => a.ArticleTags).ThenInclude(at => at.Tag)
                .FirstOrDefaultAsync(a => a.Id == id);
        }

        public async Task<Article?> GetBySlugAsync(string slug)
        {
            return await _context.Articles
                .Include(a => a.Author)
                .Include(a => a.Images)
                .Include(a => a.ArticleCategories).ThenInclude(ac => ac.Category)
                .Include(a => a.ArticleTags).ThenInclude(at => at.Tag)
                .FirstOrDefaultAsync(a => a.Slug == slug);
        }

        public async Task<IEnumerable<Article>> GetAllAsync()
        {
            return await _context.Articles
                .Include(a => a.Author)
                .Include(a => a.Images) // nạp luôn ảnh
                .Include(a => a.ArticleCategories)
                    .ThenInclude(ac => ac.Category) // nạp luôn Category
                .OrderByDescending(a => a.DatePublished)
                .ToListAsync();
        }


        public async Task<Article> AddAsync(Article article)
        {
            article.DatePublished = DateTime.UtcNow;
            await _context.Articles.AddAsync(article);
            await _context.SaveChangesAsync();
            return article;
        }

        public async Task UpdateAsync(Article article)
        {
            _context.Articles.Update(article);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var article = await _context.Articles.FindAsync(id);
            if (article != null)
            {
                _context.Articles.Remove(article);
                await _context.SaveChangesAsync();
            }
        }

        // 📌 Tìm kiếm & phân trang
        public async Task<(IEnumerable<Article> Articles, int TotalCount)> GetPagedAsync(
            int pageIndex, int pageSize,
            string? search = null,
            string? status = null,
            string? category = null,
            string? tag = null)
        {
            var query = _context.Articles
                .Include(a => a.Author)
                .Include(a => a.ArticleCategories).ThenInclude(ac => ac.Category)
                .Include(a => a.ArticleTags).ThenInclude(at => at.Tag)
                .AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(a => a.Title.Contains(search) || a.Summary.Contains(search));
            }

            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(a => a.Status == status);
            }

            if (!string.IsNullOrEmpty(category))
            {
                query = query.Where(a => a.ArticleCategories.Any(ac => ac.Category.Name == category));
            }

            if (!string.IsNullOrEmpty(tag))
            {
                query = query.Where(a => a.ArticleTags.Any(at => at.Tag.Name == tag));
            }

            var totalCount = await query.CountAsync();
            var articles = await query
                .OrderByDescending(a => a.DatePublished)
                .Skip((pageIndex - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (articles, totalCount);
        }

        // 📌 Quản lý thống kê
        public async Task IncrementViewCountAsync(int id)
        {
            var article = await _context.Articles.FindAsync(id);
            if (article != null)
            {
                article.ViewCount++;
                await _context.SaveChangesAsync();
            }
        }

        public async Task IncrementShareCountAsync(int id)
        {
            var article = await _context.Articles.FindAsync(id);
            if (article != null)
            {
                article.ShareCount++;
                await _context.SaveChangesAsync();
            }
        }

        public async Task IncrementCommentCountAsync(int id)
        {
            var article = await _context.Articles.FindAsync(id);
            if (article != null)
            {
                article.CommentCount++;
                await _context.SaveChangesAsync();
            }
        }

        // 📌 Quản lý trạng thái
        public async Task<IEnumerable<Article>> GetByStatusAsync(string status)
        {
            return await _context.Articles
                .Where(a => a.Status == status)
                .ToListAsync();
        }

        public async Task<IEnumerable<Article>> GetByCategoryAsync(int categoryId)
        {
            return await _context.Articles
                .Where(a => a.ArticleCategories.Any(ac => ac.CategoryId == categoryId))
                .ToListAsync();
        }

        public async Task<IEnumerable<Article>> GetByTagAsync(int tagId)
        {
            return await _context.Articles
                .Where(a => a.ArticleTags.Any(at => at.TagId == tagId))
                .ToListAsync();
        }

        // 📌 Lấy bài viết theo ngày
        public async Task<IEnumerable<Article>> GetArticlesByDateAsync(DateTime date)
        {
            return await _context.Articles
                .Where(a => a.DatePublished.Date == date.Date)
                .Include(a => a.Images)
                .ToListAsync();
        }

        // 📌 Lịch sử xem
        public async Task AddViewHistoryAsync(int articleId, string userId)
        {
            var history = new ArticleViewHistory
            {
                ArticleId = articleId,
                UserId = userId,
                ViewAt = DateTime.UtcNow
            };

            await _context.ArticleViewHistories.AddAsync(history);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<ArticleViewHistory>> GetArticlesViewedByUserAsync(string userId)
        {
            return await _context.ArticleViewHistories
                .Where(v => v.UserId == userId)
                .Include(v => v.Article).ThenInclude(a => a.Author)
                .Include(v => v.Article).ThenInclude(a => a.Images)
                .OrderByDescending(v => v.ViewAt)
                .ToListAsync();
        }
    }
}
