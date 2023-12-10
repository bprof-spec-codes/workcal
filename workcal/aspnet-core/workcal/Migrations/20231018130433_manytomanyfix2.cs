using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace workcal.Migrations
{
    /// <inheritdoc />
    public partial class manytomanyfix2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EventUsers_AbpUsers_UserId",
                table: "EventUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_EventUsers_Events_EventId",
                table: "EventUsers");

            migrationBuilder.DropPrimaryKey(
                name: "PK_EventUsers",
                table: "EventUsers");

            migrationBuilder.RenameTable(
                name: "EventUsers",
                newName: "EventsUsers");

            migrationBuilder.RenameIndex(
                name: "IX_EventUsers_UserId",
                table: "EventsUsers",
                newName: "IX_EventsUsers_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_EventUsers_EventId_UserId",
                table: "EventsUsers",
                newName: "IX_EventsUsers_EventId_UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_EventsUsers",
                table: "EventsUsers",
                columns: new[] { "EventId", "UserId" });

            migrationBuilder.AddForeignKey(
                name: "FK_EventsUsers_AbpUsers_UserId",
                table: "EventsUsers",
                column: "UserId",
                principalTable: "AbpUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_EventsUsers_Events_EventId",
                table: "EventsUsers",
                column: "EventId",
                principalTable: "Events",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EventsUsers_AbpUsers_UserId",
                table: "EventsUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_EventsUsers_Events_EventId",
                table: "EventsUsers");

            migrationBuilder.DropPrimaryKey(
                name: "PK_EventsUsers",
                table: "EventsUsers");

            migrationBuilder.RenameTable(
                name: "EventsUsers",
                newName: "EventUsers");

            migrationBuilder.RenameIndex(
                name: "IX_EventsUsers_UserId",
                table: "EventUsers",
                newName: "IX_EventUsers_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_EventsUsers_EventId_UserId",
                table: "EventUsers",
                newName: "IX_EventUsers_EventId_UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_EventUsers",
                table: "EventUsers",
                columns: new[] { "EventId", "UserId" });

            migrationBuilder.AddForeignKey(
                name: "FK_EventUsers_AbpUsers_UserId",
                table: "EventUsers",
                column: "UserId",
                principalTable: "AbpUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_EventUsers_Events_EventId",
                table: "EventUsers",
                column: "EventId",
                principalTable: "Events",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
