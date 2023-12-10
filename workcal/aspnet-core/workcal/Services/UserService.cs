using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using System.Text;
using workcal.Data;
using workcal.MailSender;

namespace workcal.Services
{
    public class UserService: IUserService
    {
        private Microsoft.AspNetCore.Identity.UserManager<IdentityUser> userManager;

        private readonly EmailSender _emailSender;
        private readonly IConfiguration _configuration;
        public UserService(UserManager<IdentityUser> userManager, EmailSender emailSender, IConfiguration configuration)
        {
            this.userManager = userManager;
            this._emailSender = emailSender;
            _configuration = configuration;
        }


        public UserService()
        {
        }


        public async Task<UserManagerResponse> ForgetPasswordAsync(string email)
        {
            var user = await userManager.FindByNameAsync(email);

            if (user == null) { }

            var token = await userManager.GeneratePasswordResetTokenAsync(user);

            var encodedToken = Encoding.UTF8.GetBytes(token);
            var validEmailToken = WebEncoders.Base64UrlEncode(encodedToken);

            string url = $"{_configuration["AppUrl"]}/ResetPassword?email={email}&token={validEmailToken}";

            await _emailSender.SendEmailAsync(email, "Reset password", $"<h1>Follow the instructions to reset your password</h1><a href='{url}'>Click here to reset your password</a>");


            return new UserManagerResponse
            {
                IsSuccess = true,
                Message = "Reset password URL has been sent to email succcessfully!",
            };
        }
    }
}
