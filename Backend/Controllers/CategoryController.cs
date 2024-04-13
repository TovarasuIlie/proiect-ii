using Backend.Data;
using Backend.Models.Shop;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoryController : ControllerBase
    {
        private readonly ApiDbContext _context;
        private string imageUploadForFrontend = "SiteUploads";
        public CategoryController(ApiDbContext context)
        {
            _context = context;
        }

        [HttpPost("add-category")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Category>> AddCategory([FromForm] Category category, IFormFile image)
        {
            var existingCategory = await _context.Categories.FirstOrDefaultAsync(c => c.Name == category.Name);

            if (existingCategory != null)
            {
                return Conflict("Exista o categorie cu acest nume");
            }
            if (image != null)
            {
                string uploadsFolder = Path.Combine(imageUploadForFrontend, "category-icons");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }
                string categoryName = category.Name.ToLower().Replace("/ ", "").Replace(",", "").Replace(" ", "-");
                string fileName = categoryName + ".png";
                string filePath = Path.Combine(uploadsFolder, fileName);

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await image.CopyToAsync(fileStream);
                }

                category.ImageFilename = fileName;
                category.CategoryNameSearch = categoryName;
            }

            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCategory", new { id = category.Id }, category);
        }

        [HttpGet("get-categories-pagination")]
        public async Task<ActionResult<IEnumerable<Category>>> GetCategories(int page = 1, int pageSize = 10)
        {
            return await _context.Categories.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
        }

        [HttpGet("get-categories")]
        public async Task<ActionResult<IEnumerable<Category>>> GetCategories()
        {
            return await _context.Categories.ToListAsync();
        }

        [HttpGet("get-categories-count")]
        public async Task<int?> GetCategoriesCount()
        {
            return await _context.Categories.CountAsync();
        }

        [HttpGet("get-category/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Category>> GetCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);

            if (category == null)
            {
                return NotFound();
            }

            return category;
        }
        [HttpPut("update-category")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateCategory([FromForm] Category category, IFormFile image)
        {
            var categoryToUpdate = await _context.Categories.FindAsync(category.Id);

            if (categoryToUpdate == null)
            {
                return NotFound();
            }

            _context.Entry(categoryToUpdate).State = EntityState.Detached;


            categoryToUpdate.Name = category.Name;
            if (image != null)
            {
                
                string uploadsFolder = Path.Combine(imageUploadForFrontend, "category-icons");

              
                if (!string.IsNullOrEmpty(categoryToUpdate.ImageFilename))
                {
                    string oldFilePath = Path.Combine(uploadsFolder, categoryToUpdate.ImageFilename);
                    if (System.IO.File.Exists(oldFilePath))
                    {
                        System.IO.File.Delete(oldFilePath);
                    }
                }

                string newCategoryName = category.Name.ToLower().Replace("/ ", "").Replace(",", "").Replace(" ", "-");
                string newFilename = newCategoryName + ".png";
                string filePath = Path.Combine(uploadsFolder, newFilename);
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await image.CopyToAsync(fileStream);
                }

                categoryToUpdate.ImageFilename = newFilename;
                category.CategoryNameSearch = newCategoryName;
            }
            _context.Entry(categoryToUpdate).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CategoryExists(category.Id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }
        [HttpDelete("delete-category/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                return NotFound();
            }

            // Delete category image
            string uploadsFolder = Path.Combine(imageUploadForFrontend, "category-icons");
            if (System.IO.File.Exists(Path.Combine(uploadsFolder, category.ImageFilename)))
            {
                System.IO.File.Delete(Path.Combine(uploadsFolder, category.ImageFilename));
            }

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        //Helper
        private bool CategoryExists(int id)
        {
            return _context.Categories.Any(e => e.Id == id);
        }
    }
}
