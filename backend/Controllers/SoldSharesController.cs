using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using StockAnalysisApi.Data;
using StockAnalysisApi.Models;

namespace StockAnalysisApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "admin")]
    public class SoldSharesController : ControllerBase
    {
        private readonly StockAnalysisDbContext _context;

        public SoldSharesController(StockAnalysisDbContext context)
        {
            _context = context;
        }

        // GET: api/SoldShares
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SoldShare>>> GetSoldShares()
        {
            return await _context.SoldShares.ToListAsync();
        }

        // GET: api/SoldShares/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SoldShare>> GetSoldShare(int id)
        {
            var soldShare = await _context.SoldShares.FindAsync(id);

            if (soldShare == null)
            {
                return NotFound();
            }

            return soldShare;
        }

        // GET: api/SoldShares/profit-loss
        [HttpGet("profit-loss")]
        public async Task<ActionResult<object>> GetProfitLossReport()
        {
            var soldShares = await _context.SoldShares.ToListAsync();
            var totalProfitLoss = soldShares.Sum(s => s.ProfitOrLoss);
            var profitableTrades = soldShares.Count(s => (s.ProfitOrLoss) > 0);
            var lossTrades = soldShares.Count(s => (s.ProfitOrLoss) < 0);

            return new
            {
                TotalProfitLoss = totalProfitLoss,
                ProfitableTrades = profitableTrades,
                LossTrades = lossTrades,
                TotalTrades = soldShares.Count
            };
        }

        // PUT: api/SoldShares/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSoldShare(int id, SoldShare soldShare)
        {
            if (id != soldShare.Id)
            {
                return BadRequest();
            }

            _context.Entry(soldShare).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SoldShareExists(id))
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

        // POST: api/SoldShares
        [HttpPost]
        public async Task<ActionResult<SoldShare>> PostSoldShare(SoldShare soldShare)
        {
            _context.SoldShares.Add(soldShare);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSoldShare", new { id = soldShare.Id }, soldShare);
        }

        // DELETE: api/SoldShares/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSoldShare(int id)
        {
            var soldShare = await _context.SoldShares.FindAsync(id);
            if (soldShare == null)
            {
                return NotFound();
            }

            _context.SoldShares.Remove(soldShare);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SoldShareExists(int id)
        {
            return _context.SoldShares.Any(e => e.Id == id);
        }
    }
}
