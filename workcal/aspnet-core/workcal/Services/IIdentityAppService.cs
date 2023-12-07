namespace workcal.Services
{
    public interface IIdentityAppService
    {
        Task<string> GetMyRole();
    }
}