using footballnew.Utils.Exceptions;

namespace footballnew.Utils.Exceptions
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
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
            catch (AppException ex)
            {
                _logger.LogError(ex, ex.Message);

                context.Response.ContentType = "application/json";

                // 🛑 Xử lý từng loại lỗi cụ thể
                context.Response.StatusCode = ex.ErrorCode switch
                {
                    ErrorCode.InvalidLogin => 401,  // 1001 InvalidLogin
                    ErrorCode.UnauthorizedAccess => 403, // 1002 UnauthorizedAccess
                    ErrorCode.EmailAlreadyExists => 409, // 2001 EmailAlreadyExists
                    ErrorCode.PhoneNumberAlreadyExists => 409, // 2002 PhoneNumberAlreadyExists
                    ErrorCode.UserNotFound => 404, // 2003 UserNotFound
                    ErrorCode.AccountLocked => 423, // 2004 AccountLocked
                    ErrorCode.InternalServerError => 500, // 5000 InternalServerError
                    ErrorCode.ServiceUnavailable => 503, // 5001 ServiceUnavailable
                    ErrorCode.InvalidEmailFormat => 400, // 3001 InvalidEmailFormat
                    ErrorCode.InvalidInput => 400, // 3002 InvalidInput
                    ErrorCode.PasswordTooWeak => 400, // 3003 PasswordTooWeak
                    ErrorCode.ResourceNotFound => 404, // 4001 ResourceNotFound
                    ErrorCode.ConflictError => 409, // 409 ConflictError
                    _ => 500 // Default for unknown errors
                };

                await context.Response.WriteAsJsonAsync(new
                {
                    status = context.Response.StatusCode,
                    error = ex.ErrorCode.ToString(),
                    message = ex.Message
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi hệ thống không xác định");

                context.Response.ContentType = "application/json";
                context.Response.StatusCode = 500;

                await context.Response.WriteAsJsonAsync(new
                {
                    status = 500,
                    error = "ServerError",
                    message = "Lỗi hệ thống, vui lòng thử lại sau!"
                });
            }
        }
    }

}