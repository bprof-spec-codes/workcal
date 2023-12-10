using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace workcal.Migrations
{
    /// <inheritdoc />
    public partial class Restrict : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EventsUsers_AbpUsers_UserId",
                table: "EventsUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_EventsUsers_Events_EventId",
                table: "EventsUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_Labels_Events_EventId",
                table: "Labels");

            migrationBuilder.AddForeignKey(
                name: "FK_EventsUsers_AbpUsers_UserId",
                table: "EventsUsers",
                column: "UserId",
                principalTable: "AbpUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_EventsUsers_Events_EventId",
                table: "EventsUsers",
                column: "EventId",
                principalTable: "Events",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Labels_Events_EventId",
                table: "Labels",
                column: "EventId",
                principalTable: "Events",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
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

            migrationBuilder.DropForeignKey(
                name: "FK_Labels_Events_EventId",
                table: "Labels");

            migrationBuilder.AddForeignKey(
                name: "FK_EventsUsers_AbpUsers_UserId",
                table: "EventsUsers",
                column: "UserId",
                principalTable: "AbpUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_EventsUsers_Events_EventId",
                table: "EventsUsers",
                column: "EventId",
                principalTable: "Events",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Labels_Events_EventId",
                table: "Labels",
                column: "EventId",
                principalTable: "Events",
                principalColumn: "Id");
        }
    }
}
