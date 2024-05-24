using Backend.Data;
using Backend.Models.Shop;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly ApiDbContext _context;
        private string imageUploadForFrontend = "SiteUploads/ShopImages";
        public ProductController(ApiDbContext context)
        {
            _context = context;
        }
        [HttpGet("all-products")]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            return await _context.Products
                         .Include(p => p.Category) 
                         .ToListAsync();
        }

        [HttpGet("all-products-count")]
        public async Task<ActionResult<int>> GetProductsCount()
        {
            return await _context.Products
                         .Include(p => p.Category)
                         .CountAsync();
        }
    
        [HttpGet("all-products-pagination")]
        public async Task<ActionResult<IEnumerable<Product>>> GetProductsPagination(int page = 1, int pageSize = 10)
        {
            return await _context.Products.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
        }

        [HttpGet("get-product-by-id/{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await _context.Products
                                .Include(p => p.Category)
                                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
            {
                return NotFound();
            }

            return product;
        }

        [HttpGet("get-product-by-name/{name}")]
        public async Task<ActionResult<IEnumerable<Product>>> GetProductsLikeName(string name)
        {
            return await _context.Products.Where(x => x.Title.Contains(name)).ToListAsync();
        }

        [HttpGet("get-products-by-name-pagination/{name}")]
        public async Task<ActionResult<IEnumerable<Product>>> GetProductsLikeNamePagination(string name, int page = 1, int pageSize = 10)
        {
            return await _context.Products.Where(x => x.Title.Contains(name)).Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
        }

        [HttpPost("add-product")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Product>> CreateProduct([FromForm]  Product product, [FromForm(Name = "image")] IFormFile[] image)
        {
            var existingCategory = await _context.Categories.FindAsync(product.Category.Id);
            if (existingCategory != null)
            {
                if(image.Length >= 3)
                {
                    // Associate the category
                    product.Category = existingCategory;
                    product.FolderName = Guid.NewGuid().ToString();
                    product.PhotoNumber = image.Length;

                    string uploadsFolder = Path.Combine(imageUploadForFrontend, product.FolderName);
                    Directory.CreateDirectory(uploadsFolder);
                    for(int i = 0; i < image.Length; i++)
                    {
                        string fileName = product.FolderName + "_" + i + ".png";
                        string filePath = Path.Combine(uploadsFolder, fileName);

                        using (var fileStream = new FileStream(filePath, FileMode.Create))
                        {
                            await image[i].CopyToAsync(fileStream);
                        }
                    }

                    // Add the new product 
                    _context.Products.Add(product);
                    await _context.SaveChangesAsync();

                    return CreatedAtAction("GetProduct", new { id = product.Id }, product);
                } 
                else
                {
                    return BadRequest("Trebuie sa incarci minim 3 poze pentru acest produs!");
                }
            }
            else
            {
                // Handle invalid category ID (ex: show error message on form)
                ModelState.AddModelError("CategoryId", "Invalid category selected.");
                return BadRequest(); // Return to the form
            }
        }

        [HttpPut("update-product")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateProduct(Product product)
        {

            var productToUpdate = await _context.Products.FindAsync(product.Id);
            if (productToUpdate == null)
            {
                return NotFound();
            }
            _context.Entry(productToUpdate).State = EntityState.Detached;
            productToUpdate.Title = product.Title;
            productToUpdate.Description = product.Description;
            productToUpdate.TechnicalDetailsJson = product.TechnicalDetailsJson;
            productToUpdate.Quantity = product.Quantity;
            productToUpdate.Price = product.Price;
            _context.Entry(productToUpdate).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductExists(product.Id))
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

        [HttpDelete("delete-product/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        [HttpGet("products-by-category-name/{categoryName}")]
        public IActionResult GetProductsByCategoryName(string categoryName)
        {
            try
            {
                var products = _context.Products
                                       .Where(p => p.Category.CategoryNameSearch == categoryName);

                if (!products.Any())
                {
                    return NotFound("Nu au fost gasite produse din categoria aleasa!");
                }

                return Ok(products);
            }
            catch (Exception ex)
            {
               
                return BadRequest();
            }
        }
        //Helper
        private bool ProductExists(int id)
        {
            return _context.Products.Any(e => e.Id == id);
        }
    }
}
