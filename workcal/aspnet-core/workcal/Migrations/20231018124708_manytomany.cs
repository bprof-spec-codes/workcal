using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace workcal.Migrations
{
    /// <inheritdoc />
    public partial class manytomany : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EventsUsers_AbpUsers_Id",
                table: "EventsUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_EventsUsers_Events_Id",
                table: "EventsUsers");

            migrationBuilder.DropPrimaryKey(
                name: "PK_EventsUsers",
                table: "EventsUsers");

            migrationBuilder.RenameTable(
                name: "EventsUsers",
                newName: "EventUsers");

            migrationBuilder.AddPrimaryKey(
                name: "PK_EventUsers",
                table: "EventUsers",
                columns: new[] { "EventId", "UserId" });

            migrationBuilder.CreateIndex(
                name: "IX_EventUsers_EventId_UserId",
                table: "EventUsers",
                columns: new[] { "EventId", "UserId" });

            migrationBuilder.CreateIndex(
                name: "IX_EventUsers_UserId",
                table: "EventUsers",
                column: "UserId");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
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

            migrationBuilder.DropIndex(
                name: "IX_EventUsers_EventId_UserId",
                table: "EventUsers");

            migrationBuilder.DropIndex(
                name: "IX_EventUsers_UserId",
                table: "EventUsers");

            migrationBuilder.RenameTable(
                name: "EventUsers",
                newName: "EventsUsers");

            migrationBuilder.AddPrimaryKey(
                name: "PK_EventsUsers",
                table: "EventsUsers",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_EventsUsers_AbpUsers_Id",
                table: "EventsUsers",
                column: "Id",
                principalTable: "AbpUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.NoAction);

            migrationBuilder.AddForeignKey(
                name: "FK_EventsUsers_Events_Id",
                table: "EventsUsers",
                column: "Id",
                principalTable: "Events",
                principalColumn: "Id",
                onDelete: ReferentialAction.NoAction);
        }
    }
}
