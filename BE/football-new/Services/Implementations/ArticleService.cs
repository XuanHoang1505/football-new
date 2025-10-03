using System.Text.Json;
using AutoMapper;
using footballnew.DTOs;
using footballnew.Enums;
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
        private readonly CloudinaryService _cloudinaryService;
        private readonly ILogger<ArticleService> _logger;

        public ArticleService(IArticleRepository repository, IMapper mapper, CloudinaryService service, ILogger<ArticleService> logger)
        {
            _repository = repository;
            _mapper = mapper;
            _cloudinaryService = service;
            _logger = logger;
        }

        public async Task<IEnumerable<ArticleListDTO>> GetAllAsync()
        {
            var articles = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<ArticleListDTO>>(articles);
        }
        public async Task<IEnumerable<ArticleListDTO>> GetPublishArticleAsync()
        {
            var articles = await _repository.GetPublishArticle();
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
            if (dto == null)
                throw new ArgumentNullException(nameof(dto));

            // 1️⃣ Map DTO -> Entity
            var article = _mapper.Map<Article>(dto);

            // Trạng thái & thời gian
            article.Status = ArticleStatus.PENDING;
            article.SubmitDate = DateTime.UtcNow;
            article.DatePublished = null;

            // Khởi tạo collections
            article.Images ??= new List<Image>();
            article.Contents ??= new List<Content>();
            article.ArticleCategories ??= new List<ArticleCategory>();

            // 2️⃣ Gán Content + Image
            if (dto.Contents != null && dto.Contents.Any())
            {
                for (int i = 0; i < dto.Contents.Count; i++)
                {
                    var contentDto = dto.Contents[i];

                    var content = _mapper.Map<Content>(contentDto);
                    content.OrderIndex = contentDto.OrderIndex;

                    if (contentDto.Image != null && !string.IsNullOrWhiteSpace(contentDto.Image.Url))
                    {
                        content.Image = _mapper.Map<Image>(contentDto.Image);
                        content.Image.Content = content;
                        content.Image.IsMain = false;
                        content.Image.UploadDate = contentDto.Image.UploadDate != default
                            ? contentDto.Image.UploadDate
                            : DateTime.UtcNow;
                    }
                    else
                    {
                        content.Image = null;
                    }

                    article.Contents.Add(content);
                }
            }

            // 3️⃣ Gán ảnh chính
            if (dto.Images != null && dto.Images.Any())
            {
                foreach (var imgDto in dto.Images.Where(x => x.IsMain && !string.IsNullOrWhiteSpace(x.Url)))
                {
                    var img = _mapper.Map<Image>(imgDto);
                    img.Article = article;
                    img.UploadDate = imgDto.UploadDate != default ? imgDto.UploadDate : DateTime.UtcNow;
                    article.Images.Add(img);
                }
            }

            if (!string.IsNullOrEmpty(dto.MainCategoryId))
            {
                article.ArticleCategories.Add(new ArticleCategory
                {
                    Article = article,
                    CategoryId = int.Parse(dto.MainCategoryId),
                    IsPrimary = true
                });
            }

            if (dto.SubCategoryIds != null && dto.SubCategoryIds.Any())
            {
                foreach (var subCatId in dto.SubCategoryIds)
                {
                    article.ArticleCategories.Add(new ArticleCategory
                    {
                        Article = article,
                        CategoryId = int.Parse(subCatId),
                        IsPrimary = false
                    });
                }
            }

            // 5️⃣ Lọc bỏ mọi Image null Url trước khi lưu
            foreach (var c in article.Contents)
            {
                if (c.Image != null && string.IsNullOrWhiteSpace(c.Image.Url))
                {
                    c.Image = null;
                }
            }
            article.Images = article.Images.Where(img => !string.IsNullOrWhiteSpace(img.Url)).ToList();

            // 6️⃣ Lưu Article
            var createdArticle = await _repository.AddAsync(article);
            // 7️⃣ Map entity -> DTO
            var resultDto = _mapper.Map<ArticleDetailDTO>(createdArticle);
            return resultDto;
        }



        public async Task<bool> UpdateAsync(int id, UpdateArticleDTO dto, string? newMainImageUrl)
        {
            var article = await _repository.GetByIdAsync(id);
            if (article == null)
                throw new AppException(ErrorCode.ArticleNotFound, "Bài viết không tồn tại!");

            article.Title = dto.Title;
            article.Summary = dto.Summary;

            if (!string.IsNullOrWhiteSpace(newMainImageUrl))
            {
                var oldMainImage = article.Images.FirstOrDefault(img => img.IsMain);
                if (oldMainImage != null)
                {
                    try
                    {
                        var publicId = CloudinaryService.ExtractPublicId(oldMainImage.Url);
                        if (!string.IsNullOrEmpty(publicId))
                        {
                            await _cloudinaryService.DeleteImageAsync(publicId);
                            _logger.LogInformation($"Đã xóa ảnh cũ: {publicId}");
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning($"Không thể xóa ảnh cũ: {ex.Message}");
                    }

                    // Xóa record trong DB
                    article.Images.Remove(oldMainImage);
                }

                // Thêm ảnh mới
                article.Images.Add(new Image
                {
                    Url = newMainImageUrl,
                    IsMain = true,
                    UploadDate = DateTime.UtcNow,
                    Article = article
                });
            }

            // 3️⃣ Cập nhật Contents
            if (dto.Contents != null && dto.Contents.Any())
            {
                foreach (var oldContent in article.Contents.Where(c => c.Image != null))
                {
                    try
                    {
                        var publicId = CloudinaryService.ExtractPublicId(oldContent.Image.Url);
                        if (!string.IsNullOrEmpty(publicId))
                        {
                            await _cloudinaryService.DeleteImageAsync(publicId);
                            _logger.LogInformation($"Đã xóa ảnh content cũ: {publicId}");
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning($"Không thể xóa ảnh content cũ: {ex.Message}");
                    }
                }

                // Clear và thêm contents mới
                article.Contents.Clear();

                for (int i = 0; i < dto.Contents.Count; i++)
                {
                    var contentDto = dto.Contents[i];
                    var content = _mapper.Map<Content>(contentDto);
                    content.OrderIndex = contentDto.OrderIndex;
                    content.Article = article;

                    if (contentDto.Image != null && !string.IsNullOrWhiteSpace(contentDto.Image.Url))
                    {
                        content.Image = new Image
                        {
                            Url = contentDto.Image.Url,
                            Caption = contentDto.Image.Caption,
                            Credits = contentDto.Image.Credits,
                            IsMain = false,
                            UploadDate = DateTime.UtcNow,
                            Content = content
                        };
                    }

                    article.Contents.Add(content);
                }
            }

            // 5️⃣ Lưu thay đổi
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
            ArticleStatus? status = null,
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

        public async Task<IEnumerable<ArticleListDTO>> GetByStatusAsync(ArticleStatus status)
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
                dto.timeAgo = TimeAgo(article.DatePublished.Value);
                dtoList.Add(dto);
            }

            return dtoList;
        }

        public async Task<IEnumerable<ArticleHistoryDTO>> GetArticlesViewedByUserAsync(string userId)
        {
            var histories = await _repository.GetArticlesViewedByUserAsync(userId);
            return _mapper.Map<IEnumerable<ArticleHistoryDTO>>(histories);
        }

        public async Task<IEnumerable<ArticlePendingDTO>> GetPendingAsync()
        {
            var articles = await _repository.GetPendingAsync();
            return _mapper.Map<IEnumerable<ArticlePendingDTO>>(articles);
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

        public async Task<bool> ApproveAsync(int id, string approvedBy, bool publishNow, DateTime? publishDate)
        {
            var article = await _repository.GetByIdAsync(id);
            if (article == null)
                throw new AppException(ErrorCode.ArticleNotFound, $"Không tìm thấy bài viết với Id = {id}");

            article.ApprovedBy = approvedBy;
            article.ApprovedDate = DateTime.UtcNow;

            if (publishNow)
            {
                // Publish ngay
                article.DatePublished = DateTime.UtcNow;
                article.Status = ArticleStatus.PUBLISHED;
            }
            else
            {
                if (publishDate == null)
                    throw new AppException(ErrorCode.InvalidInput, "Phải có thời gian xuất bản");

                // Nếu publishDate <= now → publish luôn
                if (publishDate <= DateTime.UtcNow)
                {
                    article.DatePublished = DateTime.UtcNow;
                    article.Status = ArticleStatus.PUBLISHED;
                }
                else
                {
                    article.DatePublished = publishDate;
                    article.Status = ArticleStatus.APPROVED;
                }
            }

            article.RejectedBy = null;
            article.RejectedDate = null;
            article.RejectionReason = null;

            await _repository.UpdateAsync(article);
            return true;
        }



        public async Task<bool> RejectAsync(int id, string rejectedBy, string reason)
        {
            if (string.IsNullOrWhiteSpace(reason))
                throw new AppException(ErrorCode.InvalidInput, "Lý do từ chối không được để trống.");

            var article = await _repository.GetByIdAsync(id);
            if (article == null)
                throw new AppException(ErrorCode.ArticleNotFound, $"Không tìm thấy bài viết với Id = {id}");

            article.Status = ArticleStatus.REJECTED;
            article.RejectedBy = rejectedBy;
            article.RejectedDate = DateTime.UtcNow;
            article.RejectionReason = reason;

            await _repository.UpdateAsync(article);
            return true;
        }
    }
}
