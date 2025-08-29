using System.ComponentModel.DataAnnotations;
using footballnew.Enums;
using Microsoft.AspNetCore.Identity;

namespace footballnew.Data
{
    public class ApplicationUser : IdentityUser
    {
        public string FullName { set; get; }

        [StringLength(255)]
        public string? Avatar { get; set; }

        public bool? Gender { get; set; }

        public DateTime? BirthDate { get; set; }

        public DateTime? RegisterDate { get; set; }

        public DateTime? LastLogin { get; set; }

        public UserStatus Status { get; set; } = UserStatus.ACTIVE;

        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiryTime { get; set; }


    }
}
