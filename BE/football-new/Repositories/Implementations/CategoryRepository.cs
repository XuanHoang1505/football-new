using footballnew.Data;
using footballnew.Models;
using footballnew.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace footballnew.Repositories.Implementations
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly FootballContext _context;

        public CategoryRepository(FootballContext context)
        {
            _context = context;
        }

        public async Task<Category?> GetByIdAsync(int id)
        {
            return await _context.Categories
                .Include(c => c.Children)
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<Category?> GetBySlugAsync(string slug)
        {
            return await _context.Categories
                .Include(c => c.Children)
                .Include(c => c.Parent)
                .FirstOrDefaultAsync(c => c.Slug == slug);
        }

        public async Task<IEnumerable<Category>> GetAllAsync()
        {
            return await _context.Categories
                .Include(c => c.Children)
                .ToListAsync();
        }

        public async Task<Category> AddAsync(Category category)
        {
            await _context.Categories.AddAsync(category);
            await _context.SaveChangesAsync();
            return category;
        }

        public async Task UpdateAsync(Category category)
        {
            _context.Categories.Update(category);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category != null)
            {
                _context.Categories.Remove(category);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<Article>> GetArticlesByCategorySlugAsync(string slug)
        {
            return await _context.Articles
                .Where(a => a.ArticleCategories.Any(ac => ac.Category.Slug == slug))
                .Include(a => a.Images.Where(i => i.IsMain))
                .Include(a => a.ArticleCategories)
                    .ThenInclude(ac => ac.Category)
                .ToListAsync();
        }
    }
}
