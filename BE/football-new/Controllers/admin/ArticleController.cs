using System.Text.Json;
using footballnew.DTOs;
using footballnew.Enums;
using footballnew.Services;
using footballnew.Services.Implementations;
using footballnew.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace footballnew.Controllers.admin
{
    [ApiController]
    [Route("api/admin/articles")]
    public class ArticleController : ControllerBase
    {
        private readonly IArticleService _service;
        private readonly CloudinaryService _cloudinaryService;

        public ArticleController(IArticleService service, CloudinaryService cloudinaryService)
        {
            _service = service;
            _cloudinaryService = cloudinaryService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var articles = await _service.GetAllAsync();
            return Ok(articles);
        }


        [HttpGet("publish")]
        public async Task<IActionResult> GetPublishArticle()
        {
            var articles = await _service.GetPublishArticleAsync();
            return Ok(articles);
        }
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var article = await _service.GetByIdAsync(id);
            if (article == null) return NotFound();
            return Ok(article);
        }

        [HttpGet("slug/{slug}")]
        public async Task<IActionResult> GetBySlug(string slug)
        {
            var article = await _service.GetBySlugAsync(slug);
            if (article == null) return NotFound();
            return Ok(article);
        }

        [HttpGet("paged")]
        public async Task<IActionResult> GetPaged(
            [FromQuery] int pageIndex = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? search = null,
            [FromQuery] ArticleStatus? status = null,
            [FromQuery] string? category = null,
            [FromQuery] string? tag = null)
        {
            var (articles, totalCount) = await _service.GetPagedAsync(pageIndex, pageSize, search, status, category, tag);
            return Ok(new { totalCount, articles });
        }

        [HttpPost("create")]
        public async Task<IActionResult> Create(
            [FromForm] string article,
            [FromForm] IFormFile? mainImage,
            [FromForm] List<IFormFile>? contentImages,
            [FromForm] List<int>? contentImageIndexes)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(article))
                    return BadRequest("Dữ liệu bài viết không hợp lệ!");

                // Deserialize JSON
                var dto = JsonSerializer.Deserialize<ArticleDetailDTO>(article, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });


                if (dto == null)
                    return BadRequest("Không thể đọc dữ liệu bài viết.");

                if (string.IsNullOrWhiteSpace(dto.AuthorId))
                    return BadRequest("AuthorId không được để trống!");

                // Khởi tạo danh sách nếu null để tránh lỗi mapping
                dto.Images ??= new List<ImageDTO>();
                dto.Contents ??= new List<ContentDTO>();

                // Khởi tạo Image cho từng Content nếu null
                foreach (var c in dto.Contents)
                {
                    c.Image ??= new ImageDTO();
                }

                // 1️⃣ Upload main image
                if (mainImage != null)
                {
                    var mainUrl = await _cloudinaryService.UploadImageAsync(mainImage, "articles");
                    dto.Images.Add(new ImageDTO
                    {
                        Url = mainUrl,
                        IsMain = true,
                        UploadDate = DateTime.UtcNow
                    });
                }

                // 2️⃣ Upload content images
                if (contentImages != null && contentImageIndexes != null)
                {
                    for (int i = 0; i < contentImages.Count; i++)
                    {
                        var idx = contentImageIndexes[i];
                        if (idx >= dto.Contents.Count) continue;

                        var url = await _cloudinaryService.UploadImageAsync(contentImages[i], "articles/contents");
                        dto.Contents[idx].Image = new ImageDTO
                        {
                            Url = url,
                            IsMain = false,
                            UploadDate = DateTime.UtcNow,
                            Caption = dto.Contents[idx].Caption,
                            Credits = dto.Contents[idx].Credits
                        };
                    }
                }
                // 3️⃣ Gọi service để tạo article
                var created = await _service.CreateAsync(dto);

                return Ok(created);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Server error: " + ex.Message,
                    inner = ex.InnerException?.Message,
                    stack = ex.StackTrace
                });
            }
        }


        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(
            int id,
            [FromForm] string article,
            [FromForm] IFormFile? mainImage,
            [FromForm] List<IFormFile>? contentImages,
            [FromForm] List<int>? contentImageIndexes)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(article))
                    return BadRequest("Dữ liệu bài viết không hợp lệ!");

                // Deserialize JSON
                var dto = JsonSerializer.Deserialize<UpdateArticleDTO>(article, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                if (dto == null)
                    return BadRequest("Không thể đọc dữ liệu bài viết.");

                // Khởi tạo danh sách nếu null
                dto.Contents ??= new List<ContentDTO>();

                // 1️⃣ Upload main image mới (nếu có)
                string? newMainImageUrl = null;
                if (mainImage != null)
                {
                    newMainImageUrl = await _cloudinaryService.UploadImageAsync(mainImage, "articles");
                }

                // 2️⃣ Upload content images mới (nếu có)
                if (contentImages != null && contentImageIndexes != null)
                {
                    for (int i = 0; i < contentImages.Count; i++)
                    {
                        var idx = contentImageIndexes[i];
                        if (idx >= dto.Contents.Count) continue;

                        var url = await _cloudinaryService.UploadImageAsync(contentImages[i], "articles/contents");

                        // Gán URL mới vào Content
                        dto.Contents[idx].Image = new ImageDTO
                        {
                            Url = url,
                            IsMain = false,
                            UploadDate = DateTime.UtcNow,
                            Caption = dto.Contents[idx].Caption,
                            Credits = dto.Contents[idx].Credits
                        };
                    }
                }

                // 3️⃣ Gọi service để update
                var success = await _service.UpdateAsync(id, dto, newMainImageUrl);

                if (!success)
                    return NotFound(new { message = "Không tìm thấy bài viết!" });

                return Ok(new { message = "Cập nhật bài viết thành công!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Server error: " + ex.Message,
                    inner = ex.InnerException?.Message
                });
            }
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _service.DeleteAsync(id);
            if (!success) return NotFound();
            return NoContent();
        }

        [HttpGet("status/{status}")]
        public async Task<IActionResult> GetByStatus(ArticleStatus status)
        {
            var articles = await _service.GetByStatusAsync(status);
            return Ok(articles);
        }

        [HttpGet("category/{categoryId:int}")]
        public async Task<IActionResult> GetByCategory(int categoryId)
        {
            var articles = await _service.GetByCategoryAsync(categoryId);
            return Ok(articles);
        }

        [HttpGet("tag/{tagId:int}")]
        public async Task<IActionResult> GetByTag(int tagId)
        {
            var articles = await _service.GetByTagAsync(tagId);
            return Ok(articles);
        }

        [HttpPost("{id:int}/view")]
        public async Task<IActionResult> IncrementViewCount(int id, [FromQuery] string? userId = null)
        {
            await _service.IncrementViewCountAsync(id, userId);
            return NoContent();
        }

        [HttpPost("{id:int}/share")]
        public async Task<IActionResult> IncrementShareCount(int id)
        {
            await _service.IncrementShareCountAsync(id);
            return NoContent();
        }

        [HttpPost("{id:int}/comment")]
        public async Task<IActionResult> IncrementCommentCount(int id)
        {
            await _service.IncrementCommentCountAsync(id);
            return NoContent();
        }

        [HttpGet("{date:datetime}/date")]
        public async Task<IActionResult> GetArticlesByDate(DateTime date)
        {
            var articles = await _service.GetArticlesByDateAsync(date);
            return Ok(articles);
        }

        [HttpGet("{userId}/histories")]

        public async Task<IActionResult> GetViewHistories(string userId)
        {
            var histories = await _service.GetArticlesViewedByUserAsync(userId);
            return Ok(histories);
        }

        [HttpGet("pending")]
        public async Task<IActionResult> GetPendingArticles()
        {
            var articles = await _service.GetPendingAsync();
            return Ok(articles);
        }


        [Authorize]
        [HttpPost("approve/{id}")]
        public async Task<IActionResult> Approve(int id, [FromBody] ApproveArticleDTO approve)
        {
            var userId = User.FindFirst("userId")?.Value;

            if (string.IsNullOrEmpty(userId))
                return Unauthorized("Token không có userId");

            var result = await _service.ApproveAsync(id, userId, approve.PublishNow, approve.PublishDate);
            return result ? Ok("Bài viết đã được chấp thuận") : BadRequest("Lỗi duyệt bài");
        }

        [Authorize]
        [HttpPost("reject/{id}")]
        public async Task<IActionResult> Reject(int id, [FromBody] RejectArticleDTO rejectArticle)
        {
            var userId = User.FindFirst("userId")?.Value;

            if (string.IsNullOrEmpty(userId))
                return Unauthorized("Token không có userId");

            var result = await _service.RejectAsync(id, userId, rejectArticle.Reason);
            return result ? Ok("Bài viết đã bị từ chối") : BadRequest("Lỗi từ chối bài viết");
        }

    }
}
