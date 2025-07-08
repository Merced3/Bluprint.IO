using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Bluprint.IO.Migrations
{
    /// <inheritdoc />
    public partial class AddBlueprintType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Type",
                table: "Blueprints",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Type",
                table: "Blueprints");
        }
    }
}
