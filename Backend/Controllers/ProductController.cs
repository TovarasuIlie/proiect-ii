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
        public ProductController(ApiDbContext context)
        {
            _context = context;
        }
        [HttpGet("all-products")]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            return await _context.Products
                         .Include(p => p.Category) // Eagerly load category
                         .ToListAsync();
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

        [HttpPost("add-product")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Product>> CreateProduct(Product product)
        {
            var existingCategory = await _context.Categories.FindAsync(product.Category.Id);
            if (existingCategory != null)
            {
                // Associate the category
                product.Category = existingCategory;

                // Add the new product 
                _context.Products.Add(product);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetProduct", new { id = product.Id }, product);

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
                                       .Where(p => p.Category.Name == categoryName);

                if (!products.Any())
                {
                    return NotFound("Categoria nu a fost gasita");
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
