using System.Security.Claims;
using footballnew.DTOs;
using footballnew.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace footballnew.Controllers.site
{
    [ApiController]
    [Route("api/comments")]
    public class CommentController : ControllerBase
    {
        private readonly ICommentService _service;

        public CommentController(ICommentService service)
        {
            _service = service;
        }

        [HttpGet("article/{articleId}")]
        public async Task<IActionResult> GetByArticle(int articleId)
        {
            var result = await _service.GetCommentsByArticleAsync(articleId);
            return Ok(result);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create(CreateCommentDTO dto)
        {
            var userId = User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("Không tìm thấy thông tin người dùng");
            }
            var result = await _service.CreateAsync(dto, userId);
            return Ok(result);
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateCommentDTO dto)
        {
            var userId = User.FindFirst("userId")?.Value;

            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var isAdmin = User.IsInRole("ADMIN");
            var result = await _service.UpdateAsync(id, dto, userId, isAdmin);
            return Ok(result);
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = User.FindFirst("userId")?.Value;
            var isAdmin = User.IsInRole("ADMIN");
            var result = await _service.DeleteAsync(id, userId, isAdmin);
            return result ? Ok() : NotFound();
        }

        [Authorize]
        [HttpPost("{id}/like")]
        public async Task<IActionResult> ToggleLike(int id)
        {
            var userId = User.FindFirst("userId")?.Value;
            var result = await _service.ToggleLikeAsync(id, userId);
            return Ok(new { liked = result });
        }
    }
}