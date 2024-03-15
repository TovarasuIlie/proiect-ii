using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs.Account
{
    public class RegisterDto
    {
        [Required]
        [StringLength(30,MinimumLength =3,ErrorMessage ="Numele trebuie sa contina minimum {2} si maximum {1} caractere")]
        public string FullName { get; set; }
        [Required]
        [RegularExpression("^\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}$", ErrorMessage ="Adresa de email invalida")]
        public string Email { get; set; }
        [Required]
        [StringLength(30,MinimumLength =6,ErrorMessage ="Parola trebuie sa contina minimum {2} si maximum {1} caractere")]
        public string Password { get; set; }
        
        public string Phone { get; set; }
        
        public string Address { get; set; }
    }
}
