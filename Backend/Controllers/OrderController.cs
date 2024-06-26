﻿using Backend.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Backend.Models.Shop;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Backend.DTOs.Account;
using Backend.Services;
using Microsoft.AspNetCore.WebUtilities;
using System.Text;
using System.Security.Claims;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly ApiDbContext _context;
        private readonly EmailService _emailService;
        private readonly IConfiguration _config;


        public OrderController(ApiDbContext context, EmailService emailService, IConfiguration config)
        {
            _context = context;
            _emailService = emailService;
            _config = config;
        }
        [HttpPost("create-order")]
        public async Task<ActionResult<Order>> CreateOrder([FromForm]Order order)
        {
            
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();
            return Ok(order);
            
        }
        [HttpGet("get-orders")]
        [Authorize] 
        public async Task<ActionResult<IEnumerable<Order>>> GetMyOrders()
        {
            var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
            {
                return BadRequest("User ID not found in claims.");
            }

            var orders = await _context.Orders
                .Where(o => o.UserId == userId) 
                .ToListAsync();

            return Ok(orders);
        }

        [HttpGet("get-order-by-id/{id}")]
        [Authorize]
        public async Task<ActionResult<Order>> GetOrderById(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            order.OrderDetails = await _context.OrderDetails.Where(o => o.OrderId == id).ToListAsync();
            return order;
        }

        [HttpGet("all-orders")]
        [Authorize(Roles = "Admin")] 
        public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
        {
            var orders = await _context.Orders
                .OrderBy(o => o.IsConfirmed) 
                .ToListAsync();

            return Ok(orders); 
        }

        [HttpPut("confirm-order/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ConfirmOrder(int id)
        {
            var order = await _context.Orders
                .Include(o => o.OrderDetails) 
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
            {
                return NotFound();
            }

            foreach (var orderItem in order.OrderDetails)
            {
                var product = await _context.Products.FindAsync(orderItem.ProductId);

                if (product != null)
                {
                    
                    if (product.Quantity >= orderItem.Quantity)
                    {
                        product.Quantity -= orderItem.Quantity;
                        _context.Entry(product).State = EntityState.Modified;
                    }
                    else
                    {
                        return BadRequest("Stoc insuficient pentru produsul: " + product.Title);
                    }
                }
            }

            order.IsConfirmed = true;
            _context.Entry(order).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            await SendConfirmEmailAsync(order);

            return NoContent();
        }
        private async Task<bool> SendConfirmEmailAsync(Order order)
        {
            var user = await _context.Users.FindAsync(order.UserId);
            var body = $"<p>Buna: {user.FullName}</p>" +
                $"<p>Comanda dumneavoastra cu numarul: {order.Id} a fost confirmata.</p>" +
                "<p>Va multumim!</p>" +
                $"<br>{_config["Email:ApplicationName"]}";
            var emailSend = new EmailSendDto(user.Email, "Confirmare adresa email", body);
            return await _emailService.SendEmailAsync(emailSend);
        }
    }
}
