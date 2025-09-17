using AutoMapper;
using footballnew.DTOs;
using footballnew.Models;
using footballnew.Repositories.Interfaces;
using footballnew.Services.Interfaces;
using footballnew.Utils.Exceptions;

namespace footballnew.Services.Implementations
{
    public class ArticleService : IArticleService
    {
        private readonly IArticleRepository _repository;
        private readonly IMapper _mapper;

        public ArticleService(IArticleRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<ArticleListDTO>> GetAllAsync()
        {
            var articles = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<ArticleListDTO>>(articles);
        }

        public async Task<ArticleDetailDTO> GetByIdAsync(int id)
        {
            var article = await _repository.GetByIdAsync(id);
            if (article == null)
                throw new AppException(ErrorCode.ArticleNotFound, "Bài viết không tồn tại!");

            return _mapper.Map<ArticleDetailDTO>(article);
        }

        public async Task<ArticleDetailDTO> GetBySlugAsync(string slug)
        {
            var article = await _repository.GetBySlugAsync(slug);
            if (article == null)
                throw new AppException(ErrorCode.ArticleNotFound, "Bài viết không tồn tại!");

            return _mapper.Map<ArticleDetailDTO>(article);
        }

        public async Task<ArticleDetailDTO> CreateAsync(ArticleDetailDTO dto)
        {
            var article = _mapper.Map<Article>(dto);
            var created = await _repository.AddAsync(article);
            return _mapper.Map<ArticleDetailDTO>(created);
        }

        public async Task<bool> UpdateAsync(int id, ArticleDetailDTO dto)
        {
            var article = await _repository.GetByIdAsync(id);
            if (article == null)
                throw new AppException(ErrorCode.ArticleNotFound, "Bài viết không tồn tại!");

            _mapper.Map(dto, article);
            await _repository.UpdateAsync(article);
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var article = await _repository.GetByIdAsync(id);
            if (article == null)
                throw new AppException(ErrorCode.ArticleNotFound, "Bài viết không tồn tại!");

            await _repository.DeleteAsync(id);
            return true;
        }

        public async Task<(IEnumerable<ArticleListDTO> Articles, int TotalCount)> GetPagedAsync(
            int pageIndex, int pageSize,
            string? search = null,
            string? status = null,
            string? category = null,
            string? tag = null)
        {
            var (articles, totalCount) = await _repository.GetPagedAsync(pageIndex, pageSize, search, status, category, tag);
            return (_mapper.Map<IEnumerable<ArticleListDTO>>(articles), totalCount);
        }

        public async Task IncrementViewCountAsync(int id, string? userId = null)
        {
            var article = await _repository.GetByIdAsync(id);
            if (article == null)
                throw new AppException(ErrorCode.ArticleNotFound, "Bài viết không tồn tại!");

            await _repository.IncrementViewCountAsync(id);
            if (!string.IsNullOrEmpty(userId))
            {
                await _repository.AddViewHistoryAsync(id, userId);
            }
        }

        public async Task IncrementShareCountAsync(int id)
        {
            var article = await _repository.GetByIdAsync(id);
            if (article == null)
                throw new AppException(ErrorCode.ArticleNotFound, "Bài viết không tồn tại!");

            await _repository.IncrementShareCountAsync(id);
        }

        public async Task IncrementCommentCountAsync(int id)
        {
            var article = await _repository.GetByIdAsync(id);
            if (article == null)
                throw new AppException(ErrorCode.ArticleNotFound, "Bài viết không tồn tại!");

            await _repository.IncrementCommentCountAsync(id);
        }

        public async Task<IEnumerable<ArticleListDTO>> GetByStatusAsync(string status)
        {
            var articles = await _repository.GetByStatusAsync(status);
            return _mapper.Map<IEnumerable<ArticleListDTO>>(articles);
        }

        public async Task<IEnumerable<ArticleListDTO>> GetByCategoryAsync(int categoryId)
        {
            var articles = await _repository.GetByCategoryAsync(categoryId);
            return _mapper.Map<IEnumerable<ArticleListDTO>>(articles);
        }

        public async Task<IEnumerable<ArticleListDTO>> GetByTagAsync(int tagId)
        {
            var articles = await _repository.GetByTagAsync(tagId);
            return _mapper.Map<IEnumerable<ArticleListDTO>>(articles);
        }

        public async Task<IEnumerable<ArticleListDTO>> GetArticlesByDateAsync(DateTime date)
        {
            var articles = await _repository.GetArticlesByDateAsync(date);

            var dtoList = new List<ArticleListDTO>();

            foreach (var article in articles)
            {
                var dto = _mapper.Map<ArticleListDTO>(article);
                dto.timeAgo = TimeAgo(article.DatePublished);
                dtoList.Add(dto);
            }

            return dtoList;
        }

        public async Task<IEnumerable<ArticleHistoryDTO>> GetArticlesViewedByUserAsync(string userId)
        {
            var histories = await _repository.GetArticlesViewedByUserAsync(userId);
            return _mapper.Map<IEnumerable<ArticleHistoryDTO>>(histories);
        }

        public string TimeAgo(DateTime dateTime)
        {
            var timeSpan = DateTime.UtcNow - dateTime;

            if (timeSpan.TotalMinutes < 1)
                return "Vừa xong";
            if (timeSpan.TotalMinutes < 60)
                return $"{(int)timeSpan.TotalMinutes} phút trước";
            if (timeSpan.TotalHours < 24)
                return $"{(int)timeSpan.TotalHours} giờ trước";
            if (timeSpan.TotalDays < 7)
                return $"{(int)timeSpan.TotalDays} ngày trước";
            return dateTime.ToString("dd/MM/yyyy HH:mm");
        }
    }
}
