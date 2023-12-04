using workcal.Data;

namespace workcal.Services
{
    public interface IUserService
    {
        public Task<UserManagerResponse> ForgetPasswordAsync(string email);
    }
}
