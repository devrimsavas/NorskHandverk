using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NorskHandverk.Migrations
{
    /// <inheritdoc />
    public partial class AddRefundedTransactionStatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "TransactionStatuses",
                columns: new[] { "Id", "Status" },
                values: new object[] { 5, "refunded" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "TransactionStatuses",
                keyColumn: "Id",
                keyValue: 5);
        }
    }
}
