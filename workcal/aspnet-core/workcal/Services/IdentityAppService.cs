using System.IdentityModel.Tokens.Jwt;
using Volo.Abp;
using Volo.Abp.Application.Services;



namespace workcal.Services
{
    public class IdentityAppService : ApplicationService, IIdentityAppService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public IdentityAppService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<string> GetMyRole()
        {
            try
            {
                var authorizationHeader = _httpContextAccessor.HttpContext.Request.Headers["Authorization"];
                var jwtToken = authorizationHeader.FirstOrDefault()?.Split(" ").LastOrDefault();

                if (jwtToken == null)
                {
                    return null;
                }

                var handler = new JwtSecurityTokenHandler();
                var jsonToken = handler.ReadToken(jwtToken) as JwtSecurityToken;

                var roleClaim = jsonToken?.Claims.FirstOrDefault(c => c.Type == "role")?.Value;

                return roleClaim;
            }
            catch (Exception ex)
            {
                Logger.LogError("An error occurred while getting the user role: " + ex.Message);
                throw new UserFriendlyException("An error occurred while getting the user role.");
            }
        }
    }
}
