using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace workcal.Migrations
{
    /// <inheritdoc />
    public partial class mtmfix2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EventsUsers_AbpUsers_UserId",
                table: "EventsUsers");

            migrationBuilder.AddColumn<Guid>(
                name: "UserId1",
                table: "EventsUsers",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_EventsUsers_UserId1",
                table: "EventsUsers",
                column: "UserId1");

            migrationBuilder.AddForeignKey(
                name: "FK_EventsUsers_AbpUsers_UserId",
                table: "EventsUsers",
                column: "UserId",
                principalTable: "AbpUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.NoAction);

         
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EventsUsers_AbpUsers_UserId",
                table: "EventsUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_EventsUsers_AbpUsers_UserId1",
                table: "EventsUsers");

            migrationBuilder.DropIndex(
                name: "IX_EventsUsers_UserId1",
                table: "EventsUsers");

            migrationBuilder.DropColumn(
                name: "UserId1",
                table: "EventsUsers");

            migrationBuilder.AddForeignKey(
                name: "FK_EventsUsers_AbpUsers_UserId",
                table: "EventsUsers",
                column: "UserId",
                principalTable: "AbpUsers",
                principalColumn: "Id");
        }
    }
}
