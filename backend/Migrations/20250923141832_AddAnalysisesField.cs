using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StockAnalysisApi.Migrations
{
    /// <inheritdoc />
    public partial class AddAnalysisesField : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "NegativeAnalysis",
                table: "Stocks",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PositiveAnalysis",
                table: "Stocks",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NegativeAnalysis",
                table: "Stocks");

            migrationBuilder.DropColumn(
                name: "PositiveAnalysis",
                table: "Stocks");
        }
    }
}
