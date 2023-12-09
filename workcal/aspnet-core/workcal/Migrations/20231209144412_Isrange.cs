using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace workcal.Migrations
{
    /// <inheritdoc />
    public partial class Isrange : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsInRange",
                table: "Events",
                type: "bit",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsInRange",
                table: "Events");
        }
    }
}
