using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class User:IdentityUser
    {
        [Required]
        public string FullName {  get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public string Phone { get; set; }
        [Required]
        public string Address { get; set; }
        public DateTime CreatedDate { get; set; }=DateTime.UtcNow;
    }
}
