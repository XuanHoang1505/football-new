using footballnew.DTOs;

namespace footballnew.Services.Interfaces
{
    public interface ICategoryService
    {
        Task<CategoryDTO?> GetByIdAsync(int id);
        Task<CategoryDTO?> GetBySlugAsync(string slug);
        Task<IEnumerable<CategoryDTO>> GetAllAsync();
        Task<CategoryDTO> CreateAsync(CategoryDTO dto);
        Task<bool> UpdateAsync(int id, CategoryDTO dto);
        Task<bool> DeleteAsync(int id);

        Task<IEnumerable<ArticleListDTO>> GetArticlesByCategorySlugAsync(string slug);
    }
}
