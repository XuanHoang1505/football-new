using footballnew.Models;

namespace footballnew.Repositories.Interfaces
{
    public interface ICommentRepository
    {
        Task<Comment> GetByIdAsync(int id);
        Task<IEnumerable<Comment>> GetByArticleIdAsync(int articleId);
        Task AddAsync(Comment comment);
        Task UpdateAsync(Comment comment);
        Task DeleteAsync(Comment comment);

        Task<bool> ToggleLikeAsync(int commentId, string userId);
    }
}