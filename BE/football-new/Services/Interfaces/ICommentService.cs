using footballnew.DTOs;

namespace footballnew.Services.Interfaces
{
    public interface ICommentService
    {
        Task<IEnumerable<CommentListDTO>> GetAllCommentAsync();
        Task<IEnumerable<CommentDTO>> GetParentCommentAsync();

        Task<IEnumerable<CommentDTO>> GetCommentsByArticleAsync(int articleId);
        Task<CommentDTO> CreateAsync(CreateCommentDTO dto, string userId);
        Task<CommentDTO> UpdateAsync(int id, UpdateCommentDTO dto, string userId, bool isAdmin);
        Task<bool> DeleteAsync(int id, string userId, bool isAdmin);
        Task<bool> ToggleLikeAsync(int id, string userId);
    }
}