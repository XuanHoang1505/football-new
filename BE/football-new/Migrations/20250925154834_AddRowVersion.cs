using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace football_new.Migrations
{
    /// <inheritdoc />
    public partial class AddRowVersion : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                table: "Articles",
                type: "BINARY(8)",
                nullable: false,
                defaultValueSql: "UNHEX(LPAD(HEX(UNIX_TIMESTAMP(NOW(6))), 16, '0'))"
            );

        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RowVersion",
                table: "Articles");
        }
    }
}
