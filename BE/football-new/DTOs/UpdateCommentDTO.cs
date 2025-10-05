namespace footballnew.DTOs
{
    public class UpdateCommentDTO
    {
        public string Content { get; set; } = null!;
        public bool? IsHidden { get; set; } = false;
        
    }
}