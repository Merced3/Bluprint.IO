using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Bluprint.IO.Models;
using Bluprint.IO.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Bluprint.IO.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;

    public HomeController(ILogger<HomeController> logger, ApplicationDbContext context, UserManager<ApplicationUser> userManager)
    {
        _logger = logger;
        _context = context;
        _userManager = userManager;
    }

    public async Task<IActionResult> Index()
    {
        var model = new HomeViewModel();

        if (User.Identity != null && User.Identity.IsAuthenticated)
        {
            var userId = _userManager.GetUserId(User);

            model.Blueprints = await _context.Blueprints
                .Where(b => b.OwnerId == userId)
                .ToListAsync();
        }

        return View(model);
    }

    public IActionResult Privacy()
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }

    [HttpPost]
    public async Task<IActionResult> CreateBlueprint(BlueprintCreateViewModel model)
    {
        if (!ModelState.IsValid)
        {
            // TODO: Better error handling later
            return RedirectToAction("Index");
        }

        var userId = _userManager.GetUserId(User);

        var blueprint = new Blueprint
        {
            Title = model.Title,
            Description = model.Description,
            Type = model.Type,
            OwnerId = userId,
            CreatedAt = DateTime.UtcNow,
            IsPublic = false
            // FilePath & Thumbnail can be added later
        };

        _context.Blueprints.Add(blueprint);
        await _context.SaveChangesAsync();

        return RedirectToAction("Index");
    }
}
