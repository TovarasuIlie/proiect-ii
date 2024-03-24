using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs.Admin
{
    public class MemberAddEditDto
    {
        public string Id { get; set; }
        [Required]
        public string UserName { get; set; }
        [Required]
        public string FullName { get; set; }

        public string Password { get; set; }
        [Required]
        // eg: "Admin,Client"
        public string Roles { get; set; }
    }
}
