using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using footballnew.Enums;
using footballnew.Models;
using Microsoft.AspNetCore.Identity;

namespace footballnew.Data
{
    public class ApplicationUser : IdentityUser
    {
        [Required, StringLength(100)]
        public string FullName { get; set; } = null!;

        [StringLength(255)]
        public string? Avatar { get; set; }

        public bool? Gender { get; set; }

        [DataType(DataType.Date)]
        public DateTime? BirthDate { get; set; }

        public DateTime? RegisterDate { get; set; }

        public DateTime? LastLogin { get; set; }

        public UserStatus Status { get; set; } = UserStatus.ACTIVE;

        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiryTime { get; set; }


        public ICollection<Article> ArticlesAuthored { get; set; } = new List<Article>();

        public ICollection<Article> ArticlesUpdated { get; set; } = new List<Article>();
        public ICollection<Article> ArticlesApproved { get; set; } = new List<Article>();

        // RejectedBy
        public ICollection<Article> ArticlesRejected { get; set; } = new List<Article>();

        public ICollection<ArticleViewHistory> ArticleViewHistories { get; set; } = new List<ArticleViewHistory>();
    }
}
