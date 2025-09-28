using AutoMapper;
using footballnew.Data;
using footballnew.DTOs;
using footballnew.Models;
using System.Collections.Generic;
using System.Linq;

namespace footballnew.Mappings
{
    public class ApplicationMapper : Profile
    {
        public ApplicationMapper()
        {
            // ============================
            // 🔹 User Mapping
            // ============================
            CreateMap<ApplicationUser, UserDTO>()
                .ForMember(dest => dest.Role, opt => opt.Ignore()); // Role lấy riêng
            CreateMap<UserDTO, ApplicationUser>();

            // ============================
            // 🔹 Image Mapping
            // ============================
            CreateMap<Image, ImageDTO>();
            CreateMap<ImageDTO, Image>();

            // ============================
            // 🔹 Content Mapping
            // ============================
            CreateMap<Content, ContentDTO>()
                .ForMember(dest => dest.Image, opt => opt.MapFrom(src => src.Image));

            CreateMap<ContentDTO, Content>()
                .ForMember(dest => dest.Image, opt => opt.MapFrom(src => src.Image ?? new ImageDTO()));

            // ============================
            // 🔹 Category Mapping
            // ============================
            CreateMap<Category, CategoryDTO>()
                .ForMember(dest => dest.ParentName,
                           opt => opt.MapFrom(src => src.Parent != null ? src.Parent.Name : null))
                .ForMember(dest => dest.ParentSlug,
                           opt => opt.MapFrom(src => src.Parent != null ? src.Parent.Slug : null));

            CreateMap<CategoryDTO, Category>()
                .ForMember(dest => dest.Parent, opt => opt.Ignore());

            // ============================
            // 🔹 Article List / Pending Mapping
            // ============================
            CreateMap<Article, ArticleListDTO>()
                .ForMember(dest => dest.AuthorName,
                           opt => opt.MapFrom(src => src.Author.UserName))
                .ForMember(dest => dest.ImageUrl,
                           opt => opt.MapFrom(src => src.Images
                               .Where(i => i.IsMain)
                               .Select(i => i.Url)
                               .FirstOrDefault()))
                .ForMember(dest => dest.CategoryName,
                           opt => opt.MapFrom(src => src.ArticleCategories
                               .Select(ac => ac.Category.Name)
                               .FirstOrDefault()));

            CreateMap<Article, ArticlePendingDTO>()
                .ForMember(dest => dest.AuthorName,
                           opt => opt.MapFrom(src => src.Author.UserName))
                .ForMember(dest => dest.Thumbnail,
                           opt => opt.MapFrom(src => src.Images
                               .Where(i => i.IsMain)
                               .Select(i => i.Url)
                               .FirstOrDefault()))
                .ForMember(dest => dest.CategoryName,
                           opt => opt.MapFrom(src => src.ArticleCategories
                               .Select(ac => ac.Category.Name)
                               .FirstOrDefault()))
                .ForMember(dest => dest.SubmittedDate,
                           opt => opt.MapFrom(src => src.SubmitDate));

            // ============================
            // 🔹 Article Detail Mapping
            // ============================
            CreateMap<ArticleDetailDTO, Article>()
                .ForMember(dest => dest.ArticleTags, opt => opt.Ignore())
                .ForMember(dest => dest.ArticleCategories, opt => opt.Ignore())
                .ForMember(dest => dest.Images, opt => opt.Ignore())
                .ForMember(dest => dest.Author, opt => opt.Ignore())
                .ForMember(dest => dest.Contents,
                           opt => opt.MapFrom(src => src.Contents ?? new List<ContentDTO>()));

            CreateMap<Article, ArticleDetailDTO>()
                .ForMember(dest => dest.AuthorName,
                           opt => opt.MapFrom(src => src.Author.FullName))
                .ForMember(dest => dest.AuthorAvatar,
                           opt => opt.MapFrom(src => src.Author.Avatar))
                .ForMember(dest => dest.Status,
                           opt => opt.MapFrom(src => src.Status.ToString()))
                .ForMember(dest => dest.Tags,
                           opt => opt.MapFrom(src => src.ArticleTags.Select(at => at.Tag.Name)))
                .ForMember(dest => dest.Categories,
                           opt => opt.MapFrom(src => src.ArticleCategories.Select(ac => ac.Category)))
                .ForMember(dest => dest.Images,
                           opt => opt.MapFrom(src => src.Images))
                .ForMember(dest => dest.Contents,
                           opt => opt.MapFrom(src => src.Contents.OrderBy(c => c.OrderIndex)));

            // ============================
            // 🔹 Article View History Mapping
            // ============================
            CreateMap<ArticleViewHistory, ArticleHistoryDTO>()
                .ForMember(dest => dest.Id,
                           opt => opt.MapFrom(src => src.Article.Id))
                .ForMember(dest => dest.Title,
                           opt => opt.MapFrom(src => src.Article.Title))
                .ForMember(dest => dest.Summary,
                           opt => opt.MapFrom(src => src.Article.Summary))
                .ForMember(dest => dest.Slug,
                           opt => opt.MapFrom(src => src.Article.Slug))
                .ForMember(dest => dest.DatePublished,
                           opt => opt.MapFrom(src => src.Article.DatePublished))
                .ForMember(dest => dest.AuthorName,
                           opt => opt.MapFrom(src => src.Article.Author.UserName))
                .ForMember(dest => dest.ImageUrl,
                           opt => opt.MapFrom(src => src.Article.Images
                               .Where(i => i.IsMain)
                               .Select(i => i.Url)
                               .FirstOrDefault()))
                .ForMember(dest => dest.ViewAt,
                           opt => opt.MapFrom(src => src.ViewAt));
        }
    }
}
