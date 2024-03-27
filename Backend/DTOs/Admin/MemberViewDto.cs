namespace Backend.DTOs.Admin
{
    public class MemberViewDto
    {
        public string Id { get; set; }
        public string UserName { get; set; }
        public string FullName { get; set; }
        public bool IsLocked { get; set; }
        public DateTime DateCreated { get; set; }
        public IEnumerable<string> Roles { get; set; }

        public string Phone { get; set; }
        public string Address { get; set; }
        public DateTimeOffset LockoutEnd { get; set; }
        public string Email { get; set; }
    }
}
