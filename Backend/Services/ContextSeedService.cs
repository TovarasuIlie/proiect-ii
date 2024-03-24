using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Backend.Services
{
    public class ContextSeedService
    {
        private readonly ApiDbContext _context;
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public ContextSeedService(ApiDbContext context,
            UserManager<User> userManager,
            RoleManager<IdentityRole> roleManager)
        {
            _context = context;
            _userManager = userManager;
            _roleManager = roleManager;
        }

        public async Task InitializeContextAsync()
        {
            if (_context.Database.GetPendingMigrationsAsync().GetAwaiter().GetResult().Count() > 0)
            {
                // applies any pending migration into our database
                await _context.Database.MigrateAsync();
            }

            if (!_roleManager.Roles.Any())
            {
                await _roleManager.CreateAsync(new IdentityRole { Name = SD.AdminRole });
                await _roleManager.CreateAsync(new IdentityRole { Name = SD.ClientRole });

            }

            if (!_userManager.Users.AnyAsync().GetAwaiter().GetResult())
            {
                var admin = new User
                {
                    FullName = "seed admin",                
                    UserName = SD.AdminUserName,
                    Email = SD.AdminUserName,
                    Phone = "0712345678",
                    Address = "Cluj",
                    EmailConfirmed = true
                };
                await _userManager.CreateAsync(admin, "123456");
                await _userManager.AddToRolesAsync(admin, new[] { SD.AdminRole, SD.ClientRole });
                await _userManager.AddClaimsAsync(admin, new Claim[]
                {
                    new Claim(ClaimTypes.Email, admin.Email),
                    new Claim("fullname", admin.FullName)
                });

                var client = new User
                {
                    FullName = "seed client",
                    UserName = "client@example.com",
                    Email = "client@example.com",
                    Phone="0712345678",
                    Address="Cluj",
                    EmailConfirmed = true
                };
                await _userManager.CreateAsync(client, "123456");
                await _userManager.AddToRoleAsync(client, SD.ClientRole);
                await _userManager.AddClaimsAsync(client, new Claim[]
                {
                    new Claim(ClaimTypes.Email, client.Email),
                    new Claim("fullname", admin.FullName)
                });

               

                
            }
        }
    }
}
