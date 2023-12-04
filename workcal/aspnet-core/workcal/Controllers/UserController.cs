using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using workcal.Data;
using workcal.Services;

namespace workcal.Controllers
{
    public class UserController : Controller
    {
        private IUserService UserService { get; set; }

        public UserController(UserService userService)
        {
            UserService = userService;
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> ForgotPassword(string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                return NotFound("Cannot send email to an empty email");
            }

            var result = await UserService.ForgetPasswordAsync(email);

            if (result.IsSuccess)
            {
                return Ok(result);
            }

            return BadRequest("Something went wrong meanwhile trying to reset user password");
        }
    }
}
