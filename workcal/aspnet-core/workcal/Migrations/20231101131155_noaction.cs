using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace workcal.Migrations
{
    /// <inheritdoc />
    public partial class noaction : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EventsUsers_AbpUsers_UserId",
                table: "EventsUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_Labels_Events_EventId",
                table: "Labels");

            migrationBuilder.AddColumn<Guid>(
                name: "EventId1",
                table: "Labels",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "EventId1",
                table: "EventsUsers",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Labels_EventId1",
                table: "Labels",
                column: "EventId1");

            migrationBuilder.CreateIndex(
                name: "IX_EventsUsers_EventId1",
                table: "EventsUsers",
                column: "EventId1");

            migrationBuilder.AddForeignKey(
                name: "FK_EventsUsers_AbpUsers_UserId",
                table: "EventsUsers",
                column: "UserId",
                principalTable: "AbpUsers",
                principalColumn: "Id",
        onDelete: ReferentialAction.Cascade);

          

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
                name: "FK_EventsUsers_AbpUsers_UserId",
                table: "EventsUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_EventsUsers_Events_EventId1",
                table: "EventsUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_Labels_Events_EventId",
                table: "Labels");

            migrationBuilder.DropForeignKey(
                name: "FK_Labels_Events_EventId1",
                table: "Labels");

            migrationBuilder.DropIndex(
                name: "IX_Labels_EventId1",
                table: "Labels");

            migrationBuilder.DropIndex(
                name: "IX_EventsUsers_EventId1",
                table: "EventsUsers");

            migrationBuilder.DropColumn(
                name: "EventId1",
                table: "Labels");

            migrationBuilder.DropColumn(
                name: "EventId1",
                table: "EventsUsers");

            migrationBuilder.AddForeignKey(
                name: "FK_EventsUsers_AbpUsers_UserId",
                table: "EventsUsers",
                column: "UserId",
                principalTable: "AbpUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.NoAction);

            migrationBuilder.AddForeignKey(
                name: "FK_Labels_Events_EventId",
                table: "Labels",
                column: "EventId",
                principalTable: "Events",
                principalColumn: "Id",
                onDelete: ReferentialAction.NoAction);
        }
    }
}
