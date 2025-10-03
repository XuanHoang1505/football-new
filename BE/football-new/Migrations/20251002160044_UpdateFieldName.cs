using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace football_new.Migrations
{
    /// <inheritdoc />
    public partial class UpdateFieldName : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "IsUpdate",
                table: "Comments",
                newName: "IsEdited");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "IsEdited",
                table: "Comments",
                newName: "IsUpdate");
        }
    }
}
