using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace NorskHandverk.Migrations
{
    /// <inheritdoc />
    public partial class membershipadded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "MemberShipStatusId",
                table: "Customers",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "MembershipStatuses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MembershipStatuses", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "MembershipStatuses",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "Silver" },
                    { 2, "Gold" },
                    { 3, "Platinum" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Customers_MemberShipStatusId",
                table: "Customers",
                column: "MemberShipStatusId");

            migrationBuilder.AddForeignKey(
                name: "FK_Customers_MembershipStatuses_MemberShipStatusId",
                table: "Customers",
                column: "MemberShipStatusId",
                principalTable: "MembershipStatuses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Customers_MembershipStatuses_MemberShipStatusId",
                table: "Customers");

            migrationBuilder.DropTable(
                name: "MembershipStatuses");

            migrationBuilder.DropIndex(
                name: "IX_Customers_MemberShipStatusId",
                table: "Customers");

            migrationBuilder.DropColumn(
                name: "MemberShipStatusId",
                table: "Customers");
        }
    }
}
