using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace football_new.Migrations
{
    /// <inheritdoc />
    public partial class AddArticleFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ApprovedBy",
                table: "Articles",
                type: "varchar(255)",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "RejectedBy",
                table: "Articles",
                type: "varchar(255)",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<DateTime>(
                name: "RejectedDate",
                table: "Articles",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RejectionReason",
                table: "Articles",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Articles_ApprovedBy",
                table: "Articles",
                column: "ApprovedBy");

            migrationBuilder.CreateIndex(
                name: "IX_Articles_RejectedBy",
                table: "Articles",
                column: "RejectedBy");

            migrationBuilder.AddForeignKey(
                name: "FK_Articles_Users_ApprovedBy",
                table: "Articles",
                column: "ApprovedBy",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Articles_Users_RejectedBy",
                table: "Articles",
                column: "RejectedBy",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Articles_Users_ApprovedBy",
                table: "Articles");

            migrationBuilder.DropForeignKey(
                name: "FK_Articles_Users_RejectedBy",
                table: "Articles");

            migrationBuilder.DropIndex(
                name: "IX_Articles_ApprovedBy",
                table: "Articles");

            migrationBuilder.DropIndex(
                name: "IX_Articles_RejectedBy",
                table: "Articles");

            migrationBuilder.DropColumn(
                name: "ApprovedBy",
                table: "Articles");

            migrationBuilder.DropColumn(
                name: "RejectedBy",
                table: "Articles");

            migrationBuilder.DropColumn(
                name: "RejectedDate",
                table: "Articles");

            migrationBuilder.DropColumn(
                name: "RejectionReason",
                table: "Articles");
        }
    }
}
