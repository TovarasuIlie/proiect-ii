using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs.Account
{
    public class RegisterDto
    {
        [Required]
        [StringLength(30,MinimumLength =3,ErrorMessage ="Name must be at least {2} and maximum {1} characters")]
        public string FullName { get; set; }
        [Required]
        [RegularExpression("^\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}$", ErrorMessage ="Invalid Email Address")]
        public string Email { get; set; }
        [Required]
        [StringLength(30,MinimumLength =6,ErrorMessage ="Password must be at least {2} and maximum {1} characters")]
        public string Password { get; set; }
        
        public string Phone { get; set; }
        
        public string Address { get; set; }
    }
}
