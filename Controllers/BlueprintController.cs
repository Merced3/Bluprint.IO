using Microsoft.AspNetCore.Mvc;
using Bluprint.IO.Data;
using Microsoft.AspNetCore.Identity;
using Bluprint.IO.Models;
using Microsoft.EntityFrameworkCore;

namespace Bluprint.IO.Controllers
{
    public class BlueprintController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public BlueprintController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        public async Task<IActionResult> View(int id)
        {
            var blueprint = await _context.Blueprints
                .FirstOrDefaultAsync(b => b.Id == id);

            if (blueprint == null)
            {
                return NotFound();
            }

            var userId = _userManager.GetUserId(User);
            if (blueprint.OwnerId != userId)
            {
                return Forbid();
            }

            return View(blueprint);
        }

        [HttpPost]
        public async Task<IActionResult> UpdateInfo(int Id, string Title, string? Description, bool IsPublic, IFormFile? BlueprintFile)
        {
            var blueprint = await _context.Blueprints.FindAsync(Id);

            if (blueprint == null)
            {
                return NotFound();
            }

            blueprint.Title = Title;
            blueprint.Description = Description;
            blueprint.IsPublic = IsPublic;

            if (BlueprintFile != null && BlueprintFile.Length > 0)
            {
                var uploadsFolder = Path.Combine("wwwroot", "uploads");
                Directory.CreateDirectory(uploadsFolder);

                var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(BlueprintFile.FileName);
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await BlueprintFile.CopyToAsync(stream);
                }

                // Save relative path so you can render it easily
                blueprint.FilePath = "/uploads/" + uniqueFileName;
            }

            await _context.SaveChangesAsync();

            return RedirectToAction("View", new { id = blueprint.Id });
        }

        [HttpPost]
        public async Task<IActionResult> SavePins([FromBody] List<Pin> pins)
        {
            if (pins == null || !pins.Any())
                return BadRequest("No pins received");

            _context.Pins.AddRange(pins);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}
