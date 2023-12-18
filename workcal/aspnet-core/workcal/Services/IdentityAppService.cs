using System.IdentityModel.Tokens.Jwt;
using Volo.Abp;
using Volo.Abp.Application.Services;



namespace workcal.Services
{
    public class IdentityAppService : ApplicationService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public IdentityAppService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<string> GetUserRolesAsync()
        {
            string role = CurrentUser.Roles.FirstOrDefault();
            return "{\"role\": \"" + role + "\"}";
        }


        public async Task<string> GetCurrentUserID()
        {
            return "{\"id\": \"" + CurrentUser.Id.ToString() + "\"}";
        }
    }
}
