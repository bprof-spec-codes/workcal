using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace workcal.Migrations
{
    /// <inheritdoc />
    public partial class labelstoevents2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Labels_Events_Id",
                table: "Labels");

            migrationBuilder.CreateIndex(
                name: "IX_Labels_EventId",
                table: "Labels",
                column: "EventId");

            migrationBuilder.AddForeignKey(
                name: "FK_Labels_Events_EventId",
                table: "Labels",
                column: "EventId",
                principalTable: "Events",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Labels_Events_EventId",
                table: "Labels");

            migrationBuilder.DropIndex(
                name: "IX_Labels_EventId",
                table: "Labels");

            migrationBuilder.AddForeignKey(
                name: "FK_Labels_Events_Id",
                table: "Labels",
                column: "Id",
                principalTable: "Events",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
