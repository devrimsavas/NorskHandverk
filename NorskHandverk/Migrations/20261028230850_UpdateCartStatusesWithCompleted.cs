using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NorskHandverk.Migrations
{
    /// <inheritdoc />
    public partial class UpdateCartStatusesWithCompleted : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "CartStatuses",
                keyColumn: "Id",
                keyValue: 3,
                column: "Name",
                value: "abandoned");

            migrationBuilder.InsertData(
                table: "CartStatuses",
                columns: new[] { "Id", "Name" },
                values: new object[] { 4, "completed" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "CartStatuses",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.UpdateData(
                table: "CartStatuses",
                keyColumn: "Id",
                keyValue: 3,
                column: "Name",
                value: "abondoned");
        }
    }
}
