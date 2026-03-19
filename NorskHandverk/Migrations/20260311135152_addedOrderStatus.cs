using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NorskHandverk.Migrations
{
    /// <inheritdoc />
    public partial class addedOrderStatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "OrderStatuses",
                columns: new[] { "Id", "Name" },
                values: new object[] { 5, "Awaiting Payment" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "OrderStatuses",
                keyColumn: "Id",
                keyValue: 5);
        }
    }
}
