using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace workcal.Migrations
{
    /// <inheritdoc />
    public partial class EventsUsers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Events_Labels_LabelId",
                table: "Events");

            migrationBuilder.DropIndex(
                name: "IX_Events_LabelId",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "LabelId",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "ManagerId",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "WorkerId",
                table: "Events");

            migrationBuilder.CreateTable(
                name: "EventsUsers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    EventId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EventsUsers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EventsUsers_AbpUsers_Id",
                        column: x => x.Id,
                        principalTable: "AbpUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EventsUsers_Events_Id",
                        column: x => x.Id,
                        principalTable: "Events",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.AddForeignKey(
                name: "FK_Labels_Events_Id",
                table: "Labels",
                column: "Id",
                principalTable: "Events",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Labels_Events_Id",
                table: "Labels");

            migrationBuilder.DropTable(
                name: "EventsUsers");

            migrationBuilder.AddColumn<Guid>(
                name: "LabelId",
                table: "Events",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "ManagerId",
                table: "Events",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "WorkerId",
                table: "Events",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Events_LabelId",
                table: "Events",
                column: "LabelId");

            migrationBuilder.AddForeignKey(
                name: "FK_Events_Labels_LabelId",
                table: "Events",
                column: "LabelId",
                principalTable: "Labels",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
