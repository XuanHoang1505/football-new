using footballnew.Data;
using footballnew.Models;
using footballnew.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace footballnew.Repositories.Implementations
{
    public class CommentRepository : ICommentRepository
    {
        private readonly FootballContext _context;

        public CommentRepository(FootballContext context)
        {
            _context = context;
        }

        public async Task<Comment> GetByIdAsync(int id)
        {
            return await _context.Comments
                .Include(c => c.User)
                .Include(c => c.Likes)
                .Include(c => c.Replies)
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<IEnumerable<Comment>> GetByArticleIdAsync(int articleId)
        {
            return await _context.Comments
                .Where(c => c.ArticleId == articleId && c.ParentId == null)
                .Include(c => c.User)
                .Include(c => c.Likes)
                .Include(c => c.Replies)
                    .ThenInclude(r => r.User)
                .Include(c => c.Replies)
                    .ThenInclude(r => r.Likes)
                .ToListAsync();
        }

        public async Task AddAsync(Comment comment)
        {
            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Comment comment)
        {
            _context.Comments.Update(comment);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Comment comment)
        {
            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> ToggleLikeAsync(int commentId, string userId)
        {
            var existing = await _context.CommentLikes
                .FirstOrDefaultAsync(l => l.CommentId == commentId && l.UserId == userId);

            if (existing == null)
            {
                _context.CommentLikes.Add(new CommentLike { CommentId = commentId, UserId = userId });
                await _context.SaveChangesAsync();
                return true; // liked
            }
            else
            {
                _context.CommentLikes.Remove(existing);
                await _context.SaveChangesAsync();
                return false; // unliked
            }
        }
    }
}