using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace workcal.Migrations
{
    /// <inheritdoc />
    public partial class manytomanyfix4 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EventsUsers_AbpUsers_UserId1",
                table: "EventsUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_EventsUsers_Events_EventId1",
                table: "EventsUsers");

            migrationBuilder.DropIndex(
                name: "IX_EventsUsers_EventId1",
                table: "EventsUsers");

            migrationBuilder.DropIndex(
                name: "IX_EventsUsers_UserId1",
                table: "EventsUsers");

            migrationBuilder.DropColumn(
                name: "ConcurrencyStamp",
                table: "Labels");

            migrationBuilder.DropColumn(
                name: "CreationTime",
                table: "Labels");

            migrationBuilder.DropColumn(
                name: "CreatorId",
                table: "Labels");

            migrationBuilder.DropColumn(
                name: "DeleterId",
                table: "Labels");

            migrationBuilder.DropColumn(
                name: "DeletionTime",
                table: "Labels");

            migrationBuilder.DropColumn(
                name: "ExtraProperties",
                table: "Labels");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "Labels");

            migrationBuilder.DropColumn(
                name: "LastModificationTime",
                table: "Labels");

            migrationBuilder.DropColumn(
                name: "LastModifierId",
                table: "Labels");

            migrationBuilder.DropColumn(
                name: "ConcurrencyStamp",
                table: "EventsUsers");

            migrationBuilder.DropColumn(
                name: "CreationTime",
                table: "EventsUsers");

            migrationBuilder.DropColumn(
                name: "CreatorId",
                table: "EventsUsers");

            migrationBuilder.DropColumn(
                name: "DeleterId",
                table: "EventsUsers");

            migrationBuilder.DropColumn(
                name: "DeletionTime",
                table: "EventsUsers");

            migrationBuilder.DropColumn(
                name: "EventId1",
                table: "EventsUsers");

            migrationBuilder.DropColumn(
                name: "ExtraProperties",
                table: "EventsUsers");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "EventsUsers");

            migrationBuilder.DropColumn(
                name: "LastModificationTime",
                table: "EventsUsers");

            migrationBuilder.DropColumn(
                name: "LastModifierId",
                table: "EventsUsers");

            migrationBuilder.DropColumn(
                name: "UserId1",
                table: "EventsUsers");

            migrationBuilder.DropColumn(
                name: "ConcurrencyStamp",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "CreationTime",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "CreatorId",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "DeleterId",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "DeletionTime",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "ExtraProperties",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "LastModificationTime",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "LastModifierId",
                table: "Events");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ConcurrencyStamp",
                table: "Labels",
                type: "nvarchar(40)",
                maxLength: 40,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreationTime",
                table: "Labels",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<Guid>(
                name: "CreatorId",
                table: "Labels",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "DeleterId",
                table: "Labels",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletionTime",
                table: "Labels",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ExtraProperties",
                table: "Labels",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "Labels",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastModificationTime",
                table: "Labels",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "LastModifierId",
                table: "Labels",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ConcurrencyStamp",
                table: "EventsUsers",
                type: "nvarchar(40)",
                maxLength: 40,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreationTime",
                table: "EventsUsers",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<Guid>(
                name: "CreatorId",
                table: "EventsUsers",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "DeleterId",
                table: "EventsUsers",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletionTime",
                table: "EventsUsers",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "EventId1",
                table: "EventsUsers",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<string>(
                name: "ExtraProperties",
                table: "EventsUsers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "EventsUsers",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastModificationTime",
                table: "EventsUsers",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "LastModifierId",
                table: "EventsUsers",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "UserId1",
                table: "EventsUsers",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<string>(
                name: "ConcurrencyStamp",
                table: "Events",
                type: "nvarchar(40)",
                maxLength: 40,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreationTime",
                table: "Events",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<Guid>(
                name: "CreatorId",
                table: "Events",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "DeleterId",
                table: "Events",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletionTime",
                table: "Events",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ExtraProperties",
                table: "Events",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "Events",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastModificationTime",
                table: "Events",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "LastModifierId",
                table: "Events",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_EventsUsers_EventId1",
                table: "EventsUsers",
                column: "EventId1");

            migrationBuilder.CreateIndex(
                name: "IX_EventsUsers_UserId1",
                table: "EventsUsers",
                column: "UserId1");

            migrationBuilder.AddForeignKey(
                name: "FK_EventsUsers_AbpUsers_UserId1",
                table: "EventsUsers",
                column: "UserId1",
                principalTable: "AbpUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.NoAction);

            migrationBuilder.AddForeignKey(
                name: "FK_EventsUsers_Events_EventId1",
                table: "EventsUsers",
                column: "EventId1",
                principalTable: "Events",
                principalColumn: "Id",
                onDelete: ReferentialAction.NoAction);
        }
    }
}
