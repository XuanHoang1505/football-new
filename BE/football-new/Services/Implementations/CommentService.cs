using footballnew.DTOs;
using footballnew.Models;
using AutoMapper;
using footballnew.Services.Interfaces;
using footballnew.Repositories.Interfaces;

namespace footballnew.Services.Implementations
{



    public class CommentService : ICommentService
    {
        private readonly ICommentRepository _repo;
        private readonly IMapper _mapper;

        public CommentService(ICommentRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        public async Task<IEnumerable<CommentListDTO>> GetAllCommentAsync()
        {
            var comments = await _repo.GetAllCommentAsync();
            return _mapper.Map<IEnumerable<CommentListDTO>>(comments);
        }
        public async Task<IEnumerable<CommentDTO>> GetParentCommentAsync()
        {
            var comments = await _repo.GetParentCommentAsync();
            return _mapper.Map<IEnumerable<CommentDTO>>(comments);
        }
        public async Task<IEnumerable<CommentDTO>> GetCommentsByArticleAsync(int articleId)
        {
            var comments = await _repo.GetByArticleIdAsync(articleId);

            var dtos = _mapper.Map<IEnumerable<CommentDTO>>(comments);

            foreach (var dto in dtos)
            {
                var entity = comments.First(c => c.Id == dto.Id);
                dto.LikeCount = entity.Likes.Count;
            }

            return dtos;
        }


        public async Task<CommentDTO> CreateAsync(CreateCommentDTO dto, string userId)
        {
            var comment = _mapper.Map<Comment>(dto);
            comment.UserId = userId;
            comment.CreatedAt = DateTime.UtcNow;
            comment.IsHidden = false;

            await _repo.AddAsync(comment);

            var created = await _repo.GetByIdAsync(comment.Id);
            var dtoResult = _mapper.Map<CommentDTO>(created);
            dtoResult.LikeCount = created.Likes.Count;

            return dtoResult;
        }

        public async Task<CommentDTO> UpdateAsync(int id, UpdateCommentDTO dto, string userId, bool isAdmin)
        {
            var comment = await _repo.GetByIdAsync(id);
            if (comment == null) throw new KeyNotFoundException("Comment not found");

            if (!isAdmin && comment.UserId != userId)
                throw new UnauthorizedAccessException("Not allowed to edit this comment");

            comment.IsEdited = true;
            comment.UpdatedAt = DateTime.UtcNow;
            comment.Content = dto.Content;

            _mapper.Map(dto, comment);

            await _repo.UpdateAsync(comment);

            var updated = await _repo.GetByIdAsync(id);
            var dtoResult = _mapper.Map<CommentDTO>(updated);


            dtoResult.LikeCount = updated.Likes.Count;
            return dtoResult;
        }

        public async Task<bool> DeleteAsync(int id, string userId, bool isAdmin)
        {
            var comment = await _repo.GetByIdAsync(id);
            if (comment == null) return false;

            if (!isAdmin && comment.UserId != userId)
                throw new UnauthorizedAccessException("Not allowed to delete this comment");

            await _repo.DeleteAsync(comment);
            return true;
        }

        public async Task<bool> ToggleLikeAsync(int id, string userId)
        {
            return await _repo.ToggleLikeAsync(id, userId);
        }
    }

}