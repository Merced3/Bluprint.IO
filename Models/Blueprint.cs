public enum BlueprintType
{
    TwoD,
    ThreeD
}

namespace Bluprint.IO.Models
{
    public class Blueprint
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public BlueprintType Type { get; set; }
        public string? FilePath { get; set; }
        public string? ThumbnailUrl { get; set; }
        public bool IsPublic { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public string? OwnerId { get; set; }
        public ApplicationUser? Owner { get; set; }
        public ICollection<Pin>? Pins { get; set; }
    }
}
