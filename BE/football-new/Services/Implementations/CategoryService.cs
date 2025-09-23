using AutoMapper;
using footballnew.DTOs;
using footballnew.Models;
using footballnew.Repositories.Interfaces;
using footballnew.Services.Interfaces;
using footballnew.Utils.Exceptions;

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

        public async Task<CategoryDTO> GetByIdAsync(int id)
        {
            var category = await _repository.GetByIdAsync(id);
            if (category == null)
                throw new AppException(ErrorCode.CategoryNotFound, $"Không tìm thấy danh mục với ID = {id}");

            return _mapper.Map<CategoryDTO>(category);
        }

        public async Task<CategoryDTO> GetBySlugAsync(string slug)
        {
            var category = await _repository.GetBySlugAsync(slug);
            if (category == null)
                throw new AppException(ErrorCode.CategoryNotFound, $"Không tìm thấy danh mục với slug = {slug}");

            return _mapper.Map<CategoryDTO>(category);
        }

        public async Task<IEnumerable<CategoryDTO>> GetAllAsync()
        {
            var categories = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<CategoryDTO>>(categories);
        }

        public async Task<CategoryDTO> CreateAsync(CategoryDTO dto)
        {
            // Kiểm tra slug đã tồn tại
            var existing = await _repository.GetBySlugAsync(dto.Slug);
            if (existing != null)
                throw new AppException(ErrorCode.CategorySlugAlreadyExists, $"Slug '{dto.Slug}' đã tồn tại.");

            var entity = _mapper.Map<Category>(dto);

            // Nếu có parentId thì kiểm tra parent tồn tại
            if (entity.ParentId.HasValue)
            {
                var parent = await _repository.GetByIdAsync(entity.ParentId.Value);
                if (parent == null)
                    throw new AppException(ErrorCode.ParentCategoryNotFound, "Danh mục cha không tồn tại.");
            }

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

        public async Task<CategoryDTO> UpdateAsync(int id, CategoryDTO dto)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null)
                throw new AppException(ErrorCode.CategoryNotFound, $"Không tìm thấy danh mục với ID = {id}");

            // Nếu update slug → check duplicate
            if (!string.Equals(existing.Slug, dto.Slug, StringComparison.OrdinalIgnoreCase))
            {
                var dup = await _repository.GetBySlugAsync(dto.Slug);
                if (dup != null && dup.Id != id)
                    throw new AppException(ErrorCode.CategorySlugAlreadyExists, $"Slug '{dto.Slug}' đã tồn tại.");
            }

            // Nếu có parentId thì kiểm tra parent tồn tại
            if (dto.ParentId.HasValue)
            {
                var parent = await _repository.GetByIdAsync(dto.ParentId.Value);
                if (parent == null)
                    throw new AppException(ErrorCode.ParentCategoryNotFound, "Danh mục cha không tồn tại.");
            }

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
            if (existing == null)
                throw new AppException(ErrorCode.CategoryNotFound, $"Không tìm thấy danh mục với ID = {id}");

            await _repository.DeleteAsync(id);
            return true;
        }

        public async Task<IEnumerable<ArticleListDTO>> GetArticlesByCategorySlugAsync(string slug)
        {
            var category = await _repository.GetBySlugAsync(slug);
            if (category == null)
                if (category == null)
                {
                    // Trả về danh sách rỗng thay vì throw exception
                    return Enumerable.Empty<ArticleListDTO>();
                }

            var articles = await _repository.GetArticlesByCategorySlugAsync(slug);

            return articles.Select(a => new ArticleListDTO
            {
                Id = a.Id,
                Title = a.Title,
                Summary = a.Summary,
                Slug = a.Slug,
                DatePublished = a.DatePublished.Value,
                AuthorName = a.Author?.UserName ?? "Unknown",
                ImageUrl = a.Images.FirstOrDefault(i => i.IsMain)?.Url
            }).ToList();
        }
    }
}
