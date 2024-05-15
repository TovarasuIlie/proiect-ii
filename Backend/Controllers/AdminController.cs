using Backend.DTOs.Admin;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Authorize(Roles = "Admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public AdminController(UserManager<User> userManager,
            RoleManager<IdentityRole> roleManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
        }
        [HttpGet("get-members")]
        public async Task<ActionResult<IEnumerable<MemberViewDto>>> GetMembers()
        {
            List<MemberViewDto> members = new List<MemberViewDto>();
            var users = await _userManager.Users
                .Where(x => x.UserName != SD.AdminUserName)
                .ToListAsync();

            foreach (var user in users)
            {
                var memberToAdd = new MemberViewDto
                {
                    Id = user.Id,
                    UserName = user.UserName,
                    FullName = user.FullName,
                    Email=user.Email,
                    DateCreated = user.DateCreated,  
                    IsLocked = await _userManager.IsLockedOutAsync(user),
                    Roles = await _userManager.GetRolesAsync(user),
                    Phone=user.Phone,
                    Address = user.Address
                };
                if (user.LockoutEnd != null)
                {
                    memberToAdd.LockoutEnd = (DateTimeOffset)user.LockoutEnd;
                }
                members.Add(memberToAdd);
            }

            return Ok(members);
        }

        [HttpGet("get-members-count")]
        public async Task<ActionResult<int>> GetCategoriesCount()
        {
            return await _userManager.Users.CountAsync() - 1;
        }

        [HttpGet("get-member/{id}")]
        public async Task<ActionResult<MemberViewDto>> GetMember(string id)
        {
            var user = await _userManager.Users
                .Where(x => x.UserName != SD.AdminUserName && x.Id == id)
                .FirstOrDefaultAsync();

            var member = new MemberViewDto
            {
                Id = user.Id,
                UserName = user.UserName,
                FullName = user.FullName,
                Email=user.Email,
                Phone=user.Phone,
                Address=user.Address,
                DateCreated=user.DateCreated,
                
                IsLocked = await _userManager.IsLockedOutAsync(user),
                Roles = await _userManager.GetRolesAsync(user)
            };
            if (user.LockoutEnd != null)
            {
                member.LockoutEnd = (DateTimeOffset)user.LockoutEnd;
            }
            return Ok(member);
        }

        [HttpPost("add-edit-member")]
        public async Task<IActionResult> AddEditMember(MemberAddEditDto model)
        {
            User user;

            if (string.IsNullOrEmpty(model.Id))
            {
                return BadRequest();
            }
            else
            {
                // editing an existing member

                if (IsAdminUserId(model.Id))
                {
                    return BadRequest(SD.SuperAdminChangeNotAllowed);
                }

                user = await _userManager.FindByIdAsync(model.Id);
                if (user == null) return NotFound();

                user.FullName = model.FullName;
                user.UserName = model.UserName;
                user.Phone = model.Phone;
                user.Address = model.Address;
               
            }

            var userRoles = await _userManager.GetRolesAsync(user);

            // removing users' existing role(s)
            await _userManager.RemoveFromRolesAsync(user, userRoles);

            foreach (var role in model.Roles)
            {
                var roleToAdd = await _roleManager.Roles.FirstOrDefaultAsync(r => r.Name == role);
                if (roleToAdd != null)
                {
                    await _userManager.AddToRoleAsync(user, role);
                }
            }

          
                return Ok(new JsonResult(new { title = "Utilizator modificat", message = $"{model.UserName} a fost modificat" }));
            
        }

        [HttpPut("lock-member/{id}")]
        public async Task<IActionResult> LockMember(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return NotFound();

            if (IsAdminUserId(id))
            {
                return BadRequest(SD.SuperAdminChangeNotAllowed);
            }

            await _userManager.SetLockoutEndDateAsync(user, DateTime.UtcNow.AddDays(5));
            return NoContent();
        }

        [HttpPut("unlock-member/{id}")]
        public async Task<IActionResult> UnlockMember(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return NotFound();

            if (IsAdminUserId(id))
            {
                return BadRequest(SD.SuperAdminChangeNotAllowed);
            }

            await _userManager.SetLockoutEndDateAsync(user, null);
            await _userManager.ResetAccessFailedCountAsync(user);
            return NoContent();
        }

        [HttpDelete("delete-member/{id}")]
        public async Task<IActionResult> DeleteMember(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return NotFound();

            if (IsAdminUserId(id))
            {
                return BadRequest(SD.SuperAdminChangeNotAllowed);
            }

            await _userManager.DeleteAsync(user);
            return NoContent();
        }

        [HttpGet("get-application-roles")]
        public async Task<ActionResult<string[]>> GetApplicationRoles()
        {
            return Ok(await _roleManager.Roles.Select(x => x.Name).ToListAsync());
        }

        private bool IsAdminUserId(string userId)
        {
            return _userManager.FindByIdAsync(userId).GetAwaiter().GetResult().UserName.Equals(SD.AdminUserName);
        }

    }
}
