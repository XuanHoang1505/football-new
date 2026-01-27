using System.Collections.Generic;
using System.Threading.Tasks;
using footballnew.DTOs;
using footballnew.Models;

namespace footballnew.Repositories.Interfaces
{
    public interface IArticleRepository
    {
        Task<Article?> GetByIdAsync(int id);
        Task<Article?> GetBySlugAsync(string slug);
        Task<IEnumerable<Article>> GetAllAsync();
        Task<Article> AddAsync(Article article);
        Task UpdateAsync(Article article);
        Task DeleteAsync(int id);

        Task<(IEnumerable<Article> Articles, int TotalCount)> GetPagedAsync(
            int pageIndex, int pageSize, 
            string? search = null, 
            string? status = null, 
            string? category = null, 
            string? tag = null);

        Task IncrementViewCountAsync(int id);
        Task IncrementShareCountAsync(int id);
        Task IncrementCommentCountAsync(int id);

        Task<IEnumerable<Article>> GetByStatusAsync(string status);
        Task<IEnumerable<Article>> GetByCategoryAsync(int categoryId);
        Task<IEnumerable<Article>> GetByTagAsync(int tagId);

        Task AddViewHistoryAsync(int articleId, string userId);
        Task<IEnumerable<ArticleViewHistory>> GetArticlesViewedByUserAsync(string userId);
    }
}
