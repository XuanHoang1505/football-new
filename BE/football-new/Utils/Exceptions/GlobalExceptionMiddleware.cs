using System.Net;
using System.Text.Json;

namespace footballnew.Utils.Exceptions
{
    public class GlobalExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<GlobalExceptionMiddleware> _logger;

        public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Đã xảy ra lỗi không mong muốn");
                await HandleExceptionAsync(context, ex);
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            // Reset response để chắc chắn không bị ghi chồng
            var response = context.Response;
            response.Clear();
            response.ContentType = "application/json";

            var errorCode = ErrorCode.InternalServerError;
            var statusCode = (int)HttpStatusCode.InternalServerError;
            var message = "Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau.";

            if (exception is AppException appEx)
            {
                errorCode = appEx.ErrorCode;
                statusCode = GetStatusCode(appEx.ErrorCode);
                message = appEx.Message;
            }

            response.StatusCode = statusCode;

            var errorResponse = new
            {
                status = statusCode,
                message,
                errorCode = errorCode.ToString()
            };

            // Serialize theo camelCase cho đồng nhất với FE
            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };

            return response.WriteAsync(JsonSerializer.Serialize(errorResponse, options));
        }

        private static int GetStatusCode(ErrorCode errorCode)
        {
            return errorCode switch
            {
                ErrorCode.InvalidLogin       => (int)HttpStatusCode.Unauthorized,   // 401
                ErrorCode.EmailAlreadyExists => (int)HttpStatusCode.Conflict,       // 409
                ErrorCode.UserNotFound       => (int)HttpStatusCode.NotFound,       // 404
                ErrorCode.InvalidInput       => (int)HttpStatusCode.BadRequest,     // 400
                ErrorCode.AccountLocked      => (int)HttpStatusCode.Forbidden,      // 403
                ErrorCode.InternalServerError=> (int)HttpStatusCode.InternalServerError, // 500
                _                            => (int)HttpStatusCode.InternalServerError
            };
        }
    }
}
