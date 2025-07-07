using Microsoft.AspNetCore.Identity;

namespace Bluprint.IO.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        // Add more custom fields later if you want!
    }
}
