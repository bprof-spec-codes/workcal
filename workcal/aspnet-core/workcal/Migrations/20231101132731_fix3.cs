using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace workcal.Migrations
{
    /// <inheritdoc />
    public partial class fix3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
           

            migrationBuilder.DropIndex(
                name: "IX_Labels_EventId1",
                table: "Labels");

            migrationBuilder.DropColumn(
                name: "EventId1",
                table: "Labels");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "EventId1",
                table: "Labels",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Labels_EventId1",
                table: "Labels",
                column: "EventId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Labels_Events_EventId1",
                table: "Labels",
                column: "EventId1",
                principalTable: "Events",
                principalColumn: "Id");
        }
    }
}
