using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Bluprint.IO.Models
{
    public class Pin
    {
        public int Id { get; set; }

        [Required]
        public float X { get; set; }

        [Required]
        public float Y { get; set; }

        public string? Label { get; set; }
        public string? Description { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Foreign key to Blueprint
        public int BlueprintId { get; set; }
        public Blueprint Blueprint { get; set; } = null!;
    }
}
