namespace footballnew.DTOs
{
    public class CategoryDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public string Slug { get; set; } = null!;
        public int? ParentId { get; set; }
        public string? ParentName { get; set; }
        public string? ParentSlug { get; set; }
    }
}
