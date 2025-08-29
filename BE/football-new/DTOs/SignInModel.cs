using System.ComponentModel.DataAnnotations;

namespace footballnew.DTOs
{
    public class SignInModel
    {

        [Required, EmailAddress]
        public string Email { set; get; }
        [Required]
        public string Password { set; get; }
    }
}
