using AutoMapper;
using footballnew.Data;
using footballnew.DTOs;


namespace footballnew.Mappings
{
    public class ApplicationMapper : Profile
    {
        public ApplicationMapper()
        {
            CreateMap<ApplicationUser, UserDTO>()
                .ForMember(dest => dest.Role, opt => opt.Ignore()); // Lấy Role riêng
            CreateMap<UserDTO, ApplicationUser>();
        }
    }
}
