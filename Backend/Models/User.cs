using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class User:IdentityUser
    {
        [Required]
        public string FullName {  get; set; }

        public string Phone { get; set; }

        public string Address { get; set; }
        public DateTime DateCreated { get; set; }=DateTime.UtcNow;
        public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
    }
}
