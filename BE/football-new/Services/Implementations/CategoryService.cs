using AutoMapper;
using footballnew.DTOs;
using footballnew.Models;
using footballnew.Repositories.Interfaces;
using footballnew.Services.Interfaces;

namespace footballnew.Services.Implementations
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _repository;
        private readonly IMapper _mapper;

        public CategoryService(ICategoryRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<CategoryDTO?> GetByIdAsync(int id)
        {
            var category = await _repository.GetByIdAsync(id);
            return category == null ? null : _mapper.Map<CategoryDTO>(category);
        }

        public async Task<CategoryDTO?> GetBySlugAsync(string slug)
        {
            var category = await _repository.GetBySlugAsync(slug);
            return category == null ? null : _mapper.Map<CategoryDTO>(category);
        }

        public async Task<IEnumerable<CategoryDTO>> GetAllAsync()
        {
            var categories = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<CategoryDTO>>(categories);
        }

        public async Task<CategoryDTO> CreateAsync(CategoryDTO dto)
        {
            var entity = _mapper.Map<Category>(dto);
            var created = await _repository.AddAsync(entity);

            var dtoResult = _mapper.Map<CategoryDTO>(created);

            if (created.ParentId.HasValue)
            {
                var parent = await _repository.GetByIdAsync(created.ParentId.Value);
                dtoResult.ParentName = parent?.Name;
                dtoResult.ParentSlug = parent?.Slug;
            }

            return dtoResult;
        }

        public async Task<CategoryDTO?> UpdateAsync(int id, CategoryDTO dto)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null) return null;

            _mapper.Map(dto, existing);
            await _repository.UpdateAsync(existing);

            var dtoResult = _mapper.Map<CategoryDTO>(existing);

            if (existing.ParentId.HasValue)
            {
                var parent = await _repository.GetByIdAsync(existing.ParentId.Value);
                dtoResult.ParentName = parent?.Name;
                dtoResult.ParentSlug = parent?.Slug;
            }

            return dtoResult;
        }



        public async Task<bool> DeleteAsync(int id)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null) return false;

            await _repository.DeleteAsync(id);
            return true;
        }
        public async Task<IEnumerable<ArticleListDTO>> GetArticlesByCategorySlugAsync(string slug)
        {
            var articles = await _repository.GetArticlesByCategorySlugAsync(slug);

            return articles.Select(a => new ArticleListDTO
            {
                Id = a.Id,
                Title = a.Title,
                Summary = a.Summary,
                Slug = a.Slug,
                DatePublished = a.DatePublished,
                AuthorName = a.Author?.UserName ?? "Unknown",
                ImageUrl = a.Images.FirstOrDefault(i => i.IsMain)?.Url

            }).ToList();
        }
    }
}
