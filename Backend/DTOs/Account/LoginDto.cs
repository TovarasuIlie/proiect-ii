using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs.Account
{
    public class LoginDto
    {
        [Required(ErrorMessage ="Username is required")]
        public string UserName {  get; set; }
        [Required]
        public string Password { get; set; }
    }
}
