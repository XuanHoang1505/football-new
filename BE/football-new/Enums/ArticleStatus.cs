namespace footballnew.Enums
{
    public enum ArticleStatus
    {
        DRAFT = 0,        // Bản nháp
        PENDING = 1,// Chờ duyệt
        APPROVED = 6,    // Đã duyệt chờ xuất bản 
        PUBLISHED = 2,    // Đã xuất bản
        REJECTED = 3,
        ARCHIVED = 4,     // Lưu trữ (ẩn khỏi public)
        DELETED = 5       // Đã xóa (soft delete)
    }
}