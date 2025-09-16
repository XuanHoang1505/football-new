using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using footballnew.Services;
using footballnew.Utils;
using System.Threading.Tasks;
using footballnew.DTOs;
using footballnew.Data;
using Microsoft.AspNetCore.Identity;
using footballnew.Enums;
using System.Text.Json;
using Google.Apis.Auth;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class ExternalAuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly JwtTokenProvider _jwtTokenProvider;

    public ExternalAuthController(UserManager<ApplicationUser> userManager, JwtTokenProvider jwtTokenProvider)
    {
        _userManager = userManager;
        _jwtTokenProvider = jwtTokenProvider;
    }

    [HttpPost("google")]
    public async Task<IActionResult> GoogleLogin([FromBody] ExternalLoginDTO dto)
    {
        // 1. Xác thực token từ Google
        var payload = await GoogleJsonWebSignature.ValidateAsync(dto.AccessToken, new GoogleJsonWebSignature.ValidationSettings());
        if (payload == null) return Unauthorized("Token Google không hợp lệ.");

        // 2. Kiểm tra user trong hệ thống
        var user = await _userManager.FindByEmailAsync(payload.Email);
        if (user == null)
        {
            user = new ApplicationUser
            {
                UserName = payload.Email,
                Email = payload.Email,
                FullName = payload.Name,
                Avatar = payload.Picture,
                RegisterDate = DateTime.UtcNow,
                Status = UserStatus.ACTIVE
            };
            await _userManager.CreateAsync(user);
            await _userManager.AddToRoleAsync(user, "USER");
        }

        // 3. Tạo AccessToken + RefreshToken
        var roles = await _userManager.GetRolesAsync(user);
        var accessToken = _jwtTokenProvider.GenerateToken(user.UserName, roles.ToList(), user.Id);
        var refreshToken = "Bearer " + _jwtTokenProvider.GenerateRefreshToken();

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(10); // hạn 10 ngày
        await _userManager.UpdateAsync(user);

        return Ok(new LoginResponse
        {
            UserId = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            Avatar = user.Avatar,
            Role = roles.FirstOrDefault() ?? "USER",
            AccessToken = accessToken,
            RefreshToken = refreshToken
        });
    }

    // ================= FACEBOOK LOGIN =================
    [HttpPost("facebook")]
    public async Task<IActionResult> FacebookLogin([FromBody] ExternalLoginDTO dto)
    {
        // 1. Gọi API Facebook để lấy thông tin user
        using var httpClient = new HttpClient();
        var response = await httpClient.GetStringAsync(
            $"https://graph.facebook.com/me?fields=id,name,email,picture&access_token={dto.AccessToken}");

        var fbUser = JsonSerializer.Deserialize<FacebookUserInfo>(response);
        if (fbUser == null || string.IsNullOrEmpty(fbUser.Email))
            return Unauthorized("Token Facebook không hợp lệ.");

        // 2. Kiểm tra user trong hệ thống
        var user = await _userManager.FindByEmailAsync(fbUser.Email);
        if (user == null)
        {
            user = new ApplicationUser
            {
                UserName = fbUser.Email,
                Email = fbUser.Email,
                FullName = fbUser.Name,
                Avatar = fbUser.Picture.Data.Url,
                RegisterDate = DateTime.UtcNow,
                Status = UserStatus.ACTIVE
            };
            await _userManager.CreateAsync(user);
            await _userManager.AddToRoleAsync(user, "USER");
        }

        // 3. Tạo AccessToken + RefreshToken
        var roles = await _userManager.GetRolesAsync(user);
        var accessToken = _jwtTokenProvider.GenerateToken(user.UserName, roles.ToList(), user.Id);
        var refreshToken = "Bearer " + _jwtTokenProvider.GenerateRefreshToken();

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(10);
        await _userManager.UpdateAsync(user);

        return Ok(new LoginResponse
        {
            UserId = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            Avatar = user.Avatar,
            Role = roles.FirstOrDefault() ?? "USER",
            AccessToken = accessToken,
            RefreshToken = refreshToken
        });
    }

}
