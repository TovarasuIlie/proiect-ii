using Backend.Data;
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
        public async Task<ActionResult<Order>> CreateOrder(Order order)
        {
            
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetOrder", new { id = order.Id }, order);
        }

        [HttpPut("confirm-order/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ConfirmOrder(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
            {
                return NotFound();
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
