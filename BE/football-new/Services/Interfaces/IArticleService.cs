using footballnew.DTOs;

namespace footballnew.Services.Interfaces
{
    public interface IArticleService
    {
        Task<ArticleDetailDTO?> GetByIdAsync(int id);
        Task<ArticleDetailDTO?> GetBySlugAsync(string slug);
        Task<IEnumerable<ArticleListDTO>> GetAllAsync();
        Task<ArticleDetailDTO> CreateAsync(ArticleDetailDTO dto);
        Task<bool> UpdateAsync(int id, ArticleDetailDTO dto);
        Task<bool> DeleteAsync(int id);

        Task<(IEnumerable<ArticleListDTO> Articles, int TotalCount)> GetPagedAsync(
            int pageIndex, int pageSize,
            string? search = null,
            string? status = null,
            string? category = null,
            string? tag = null);

        Task IncrementViewCountAsync(int id, string? userId = null);
        Task IncrementShareCountAsync(int id);
        Task IncrementCommentCountAsync(int id);

        Task<IEnumerable<ArticleListDTO>> GetByStatusAsync(string status);
        Task<IEnumerable<ArticleListDTO>> GetByCategoryAsync(int categoryId);
        Task<IEnumerable<ArticleListDTO>> GetByTagAsync(int tagId);
        Task<IEnumerable<ArticleListDTO>> GetArticlesByDateAsync(DateTime date);

        Task<IEnumerable<ArticleHistoryDTO>> GetArticlesViewedByUserAsync(string userId);

    }
}
