using System.ComponentModel.DataAnnotations;

namespace StockAnalysisApi.Models
{
    public class Stock
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; } = string.Empty;

        public decimal? CurrentPrice { get; set; }

        public string? SectorName { get; set; } = string.Empty;
    
        public decimal? CurrentRatio { get; set; }
        public decimal DebtEquityRatio { get; set; }
        public decimal PriceBookRatio { get; set; }
        public decimal Beta { get; set; }
        public string ShareholdingPattern { get; set; } = string.Empty;
        public decimal TargetPrice { get; set; }
        public DateTime TargetDate { get; set; }

        // New fields
        public string PositiveAnalysis { get; set; } = string.Empty;
        public string NegativeAnalysis { get; set; } = string.Empty;

        public string? AnalystRating { get; set; }
    }

    public class PortfolioEntry
    {
        [Key]
        public int Id { get; set; }
        public int StockId { get; set; }
        public Stock? Stock { get; set; } = null!;
        public int Quantity { get; set; }
        public decimal PurchasePrice { get; set; }
        public decimal? TargetPrice { get; set; } = 5000;
        public DateTime? TargetDate { get; set; } = DateTime.UtcNow.AddYears(1);
        public DateTime PurchaseDate { get; set; }
        public string Type { get; set; } 
    }

    public class SoldShare
    {
        [Key]
        public int Id { get; set; }
        public int StockId { get; set; }
        public Stock Stock { get; set; } = null!;
        public int Quantity { get; set; }
        public decimal PurchasePrice { get; set; }
        public decimal SellPrice { get; set; }
        public DateTime PurchaseDate { get; set; }
        public DateTime SellDate { get; set; }
        public decimal ProfitOrLoss { get; set; }
    }
}