using Backend.Data;
using Microsoft.AspNetCore.Mvc;
using Backend.Models.Cars;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CarController : ControllerBase
    {
        private readonly ApiDbContext _context;


        public CarController(ApiDbContext context, IConfiguration config)
        {
            _context = context;
        }
        [HttpGet("get-marks")]
        public async Task<ActionResult<IEnumerable<Mark>>> GetMarks()
        {

            return await _context.Marks.ToListAsync();
        }

        [HttpGet("get-mark-models/{id}")]
        public async Task<ActionResult<IEnumerable<Model>>> GetMarkModels(int id)
        {
            var mark = await _context.Marks.FindAsync(id);
            return await _context.Models.Where(model => model.Mark == mark).ToListAsync();
        }

        [HttpGet("get-model-engines/{id}")]
        public async Task<ActionResult<IEnumerable<Engine>>> GetModelEngines(int id)
        {
            var model = await _context.Models.FindAsync(id);
            return await _context.Engines.Where(engine => engine.Model == model).ToListAsync();
        }
    }
}
