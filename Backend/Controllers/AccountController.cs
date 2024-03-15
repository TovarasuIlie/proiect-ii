using Backend.DTOs.Account;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.Json;
using System.Security.Claims;
using System.Text;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly JWTService _jwtService;
        private readonly SignInManager<User> _signInManager;
        private readonly UserManager<User> _userManager;
        private readonly EmailService _emailService;
        private readonly IConfiguration _config;

        public AccountController(JWTService jwtService,
            SignInManager<User> signInManager,
            UserManager<User> userManager,
            EmailService emailService,
            IConfiguration config)
        {
            _jwtService = jwtService;
            _signInManager = signInManager;
            _userManager = userManager;
            _emailService = emailService;
            _config = config;
        }
        [Authorize]
        [HttpGet("refresh-user-token")]
        public async Task<ActionResult<UserDto>> RefreshUserToken()
        {
            var user = await _userManager.FindByNameAsync(User.FindFirst(ClaimTypes.Email)?.Value);
            return CreateApplicationUserDto(user);
        }
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto model)
        {
            var user = await _userManager.FindByNameAsync(model.UserName);
            if (user == null) { return Unauthorized("Email-ul sau parola sunt gresite"); }
            if (user.EmailConfirmed == false) { return Unauthorized("Va rugam confirmati email-ul"); }
            var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, false);
            if (!result.Succeeded) { return Unauthorized("Email-ul sau parola sunt gresite"); }
            return CreateApplicationUserDto(user);
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto model)
        {
            if(await CheckEmailExistsAsync(model.Email))
            {
                return BadRequest($"Exista un cont cu adresa {model.Email}. Va rugam folositi alta adresa");
            }
            var userToAdd = new User
            {
                FullName = model.FullName,
                UserName = model.Email.ToLower(),
                Email = model.Email.ToLower(),
                Phone = model.Phone,
                Address = model.Address
            };
            var result=await _userManager.CreateAsync(userToAdd, model.Password);
            if(!result.Succeeded) { return BadRequest(result.Errors); }
            try
            {
                if(await SendConfirmEmailAsync(userToAdd))
                {
                    return Ok(new JsonResult(new { title = "Cont creat", message = "Contul a fost inregistrat. Va rugam confirmati adresa de email" }));
                }
                return BadRequest("Eroare la trimiterea emailu-ului de confirmare");

            }
            catch (Exception ex)
            {
                return BadRequest("Eroare la trimiterea emailu-ului de confirmare");
            }
        }

        [HttpPut("confirm-email")]
        public async Task<IActionResult> ConfirmEmail(ConfirmEmailDto model)
        {
            var user=await _userManager.FindByNameAsync(model.Email);
            if(user == null) return Unauthorized("Aceasta adresa de email nu este inregistrata");
            if (user.EmailConfirmed) return BadRequest("Email-ul a mai fost confirmat. Va rugam accesati contul");
            try
            {
                var decodedTokenBytes = WebEncoders.Base64UrlDecode(model.Token);
                var decodedToken = Encoding.UTF8.GetString(decodedTokenBytes);
                var result = await _userManager.ConfirmEmailAsync(user, decodedToken);
                if(result.Succeeded) { return Ok(new JsonResult(new { title = "Email confirmat", message = "Email-ul este confirmat. Acum puteti accesa contul" })); }
                return BadRequest("Token invalid");
            }catch(Exception ex)
            {
                return BadRequest("Token invalid");

            }
        }

        [HttpPost("resend-email-confirmation-link/{email}")]
        public async Task<IActionResult> ResendEmailConfirmationLink(string email)
        {
            if(string.IsNullOrEmpty(email)) return BadRequest("Email invalid");
            var user=await _userManager.FindByNameAsync(email);
            if (user == null) return Unauthorized("Aceasta adresa de email nu este inregistrata");
            if (user.EmailConfirmed)  return BadRequest("Email-ul a mai fost confirmat. Va rugam accesati contul");
            try
            {
                if(await SendConfirmEmailAsync(user))
                {
                    return Ok(new JsonResult(new { title = "Link-ul de confirmare a fost trimis", message = "Va rugam confirmati adresa de email" }));

                }
                return BadRequest("Eroare la trimiterea link-ului");
            }catch (Exception ex)
            {
                return BadRequest("Eroare la trimiterea link-ului");

            }
        }
        [HttpPost("forgot-username-or-password/{email}")]
        public async Task<IActionResult> ForgotUsernameOrPassword(string email)
        {
            if (string.IsNullOrEmpty(email)) return BadRequest("Email invalid");
            var user = await _userManager.FindByNameAsync(email);
            if (user == null) return Unauthorized("Aceasta adresa de email nu este inregistrata");
            if (user.EmailConfirmed==false) return BadRequest("Va rugam confirmati adresa de email");
            try
            {
                if(await SendForgotUsernameOrPasswordEmail(user))
                {
                    return Ok(new JsonResult(new { title = "Mail-ul pentru resetarea parolei trimis", message = "Va rugam verificati adresa de email" }));

                }
                return BadRequest("Eroare la trimiterea email-ului");
            }
            catch(Exception ex)
            {
                return BadRequest("Eroare la trimiterea email-ului");

            }
        }

        [HttpPut("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordDto model)
        {
            var user = await _userManager.FindByNameAsync(model.Email);
            if (user == null) return Unauthorized("Aceasta adresa de email nu este inregistrata");
            if (user.EmailConfirmed == false) return BadRequest("Va rugam confirmati adresa de email");
            try
            {
                var decodedTokenBytes = WebEncoders.Base64UrlDecode(model.Token);
                var decodedToken = Encoding.UTF8.GetString(decodedTokenBytes);
                var result = await _userManager.ResetPasswordAsync(user, decodedToken,model.NewPassword);
                if (result.Succeeded) { return Ok(new JsonResult(new { title = "Parola resetata cu success", message = "Acum puteti accesa contul folosind noua parola" })); }
                return BadRequest("Eroare la trimiterea email-ului");
            }
            catch (Exception ex)
            {
                return BadRequest("Eroare la trimiterea email-ului");

            }
        }

        #region Private Helper Methods
        private UserDto CreateApplicationUserDto(User user)
        {
            return new UserDto
            {
                FullName = user.FullName,
                Phone = user.Phone,
                Address = user.Address,
                JWT = _jwtService.CreateJWT(user)
            };
        }
        private async Task<bool> CheckEmailExistsAsync(string email)
        {
            return await _userManager.Users.AnyAsync(x=>x.Email== email.ToLower());
        }
        private async Task<bool> SendConfirmEmailAsync(User user)
        {
            var token=await _userManager.GenerateEmailConfirmationTokenAsync(user);
            token=WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));
            var url = $"{_config["JWT:ClientUrl"]}/{_config["Email:ConfirmEmailPath"]}?token={token}&email={user.Email}";
            var body = $"<p>Buna: {user.FullName}</p>" +
                "<p>Va rugam confirmati adresa de email accesand link-ul de mai jos.</p>" +
                $"<p><a href=\"{url}\">Apasa aici</a></p>" +
                "<p>Va multumim!</p>" +
                $"<br>{_config["Email:ApplicationName"]}";
            var emailSend = new EmailSendDto(user.Email, "Confirmare adresa email", body);
            return await _emailService.SendEmailAsync(emailSend);
        }
        private async Task<bool> SendForgotUsernameOrPasswordEmail(User user)
        {
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));
            var url = $"{_config["JWT:ClientUrl"]}/{_config["Email:ResetPasswordPath"]}?token={token}&email={user.Email}";
            var body = $"<p>Buna: {user.FullName}</p>" +
               $"<p>Utilizator: {user.UserName}</p>" +
               "<p>Accesati link-ul urmator pentru resetarea parolei</p>" +
               $"<p><a href=\"{url}\">Apasa aici</a></p>" +
               "<p>Thank you!</p>" +
               $"<br>{_config["Email:ApplicationName"]}";
            var emailSend = new EmailSendDto(user.Email, "Resetarea parolei", body);
            return await _emailService.SendEmailAsync(emailSend);
        }
        #endregion
    }
}
