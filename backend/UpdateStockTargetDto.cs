using System.ComponentModel.DataAnnotations;

namespace StockAnalysisApi
{
    public class UpdateStockTargetDto
    {
        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Target price must be greater than 0")]
        public decimal TargetPrice { get; set; }

        [Required]
        public DateTime TargetDate { get; set; }
    }
}
