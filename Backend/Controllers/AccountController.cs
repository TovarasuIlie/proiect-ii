﻿using Backend.DTOs.Account;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.Json;
using System.Security.Claims;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly JWTService _jwtService;
        private readonly SignInManager<User> _signInManager;
        private readonly UserManager<User> _userManager;

        public AccountController(JWTService jwtService,SignInManager<User> signInManager,UserManager<User> userManager)
        {
            _jwtService = jwtService;
            _signInManager = signInManager;
            _userManager = userManager;
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
            if (user == null) { return Unauthorized("Invalid email or password"); }
            if (user.EmailConfirmed == false) { return Unauthorized("Please confirm your email"); }
            var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, false);
            if (!result.Succeeded) { return Unauthorized("Invalid Email or password"); }
            return CreateApplicationUserDto(user);
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto model)
        {
            if(await CheckEmailExistsAsync(model.Email))
            {
                return BadRequest($"An existing account is using {model.Email}. Please try another email address");
            }
            var userToAdd = new User
            {
                FullName = model.FullName,
                UserName = model.Email.ToLower(),
                Email = model.Email.ToLower(),
                EmailConfirmed = true,
                Phone = model.Phone,
                Address = model.Address
            };
            var result=await _userManager.CreateAsync(userToAdd, model.Password);
            if(!result.Succeeded) { return BadRequest(result.Errors); }
            return Ok(new JsonResult(new {title="Account Created",message= "Your account has been created. You can now login." }));
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
        #endregion
    }
}
