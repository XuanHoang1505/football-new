using footballnew.DTOs;
using footballnew.Enums;
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

        public ArticleController(IArticleService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var articles = await _service.GetAllAsync();
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

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ArticleDetailDTO dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] ArticleDetailDTO dto)
        {
            var success = await _service.UpdateAsync(id, dto);
            if (!success) return NotFound();
            return NoContent();
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
