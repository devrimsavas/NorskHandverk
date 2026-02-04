using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace NorskHandverk.Migrations
{
    /// <inheritdoc />
    public partial class transactionrl : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TransactionMethods",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Method = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TransactionMethods", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TransactionProviders",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TransactionProviders", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TransactionStatuses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Status = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TransactionStatuses", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Transactions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TransactionNumber = table.Column<string>(type: "text", nullable: false),
                    Amount = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    Currency = table.Column<string>(type: "text", nullable: false),
                    OrderId = table.Column<int>(type: "integer", nullable: false),
                    TransactionMethodId = table.Column<int>(type: "integer", nullable: false),
                    TransactionProviderId = table.Column<int>(type: "integer", nullable: false),
                    TransactionStatusId = table.Column<int>(type: "integer", nullable: false),
                    CreateadAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Transactions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Transactions_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Transactions_TransactionMethods_TransactionMethodId",
                        column: x => x.TransactionMethodId,
                        principalTable: "TransactionMethods",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Transactions_TransactionProviders_TransactionProviderId",
                        column: x => x.TransactionProviderId,
                        principalTable: "TransactionProviders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Transactions_TransactionStatuses_TransactionStatusId",
                        column: x => x.TransactionStatusId,
                        principalTable: "TransactionStatuses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "CartStatuses",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "active" },
                    { 2, "checkedOut" },
                    { 3, "abondoned" }
                });

            migrationBuilder.InsertData(
                table: "TransactionMethods",
                columns: new[] { "Id", "Method" },
                values: new object[,]
                {
                    { 1, "card" },
                    { 2, "vipps" },
                    { 3, "kontant" }
                });

            migrationBuilder.InsertData(
                table: "TransactionProviders",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "Stripe" },
                    { 2, "Google Pay" },
                    { 3, "Vipps" },
                    { 4, "Klarna" },
                    { 5, "Nets" },
                    { 6, "Manual" }
                });

            migrationBuilder.InsertData(
                table: "TransactionStatuses",
                columns: new[] { "Id", "Status" },
                values: new object[,]
                {
                    { 1, "pending" },
                    { 2, "success" },
                    { 3, "failed" },
                    { 4, "canceled" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_OrderId",
                table: "Transactions",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_TransactionMethodId",
                table: "Transactions",
                column: "TransactionMethodId");

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_TransactionProviderId",
                table: "Transactions",
                column: "TransactionProviderId");

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_TransactionStatusId",
                table: "Transactions",
                column: "TransactionStatusId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Transactions");

            migrationBuilder.DropTable(
                name: "TransactionMethods");

            migrationBuilder.DropTable(
                name: "TransactionProviders");

            migrationBuilder.DropTable(
                name: "TransactionStatuses");

            migrationBuilder.DeleteData(
                table: "CartStatuses",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "CartStatuses",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "CartStatuses",
                keyColumn: "Id",
                keyValue: 3);
        }
    }
}
