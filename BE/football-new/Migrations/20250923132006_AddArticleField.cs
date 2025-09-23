using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace football_new.Migrations
{
    /// <inheritdoc />
    public partial class AddArticleField : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "DatePublished",
                table: "Articles",
                type: "datetime(6)",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)");

            migrationBuilder.AddColumn<DateTime>(
                name: "ApprovedDate",
                table: "Articles",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "SubmitDate",
                table: "Articles",
                type: "datetime(6)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ApprovedDate",
                table: "Articles");

            migrationBuilder.DropColumn(
                name: "SubmitDate",
                table: "Articles");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DatePublished",
                table: "Articles",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)",
                oldNullable: true);
        }
    }
}
