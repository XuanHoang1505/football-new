namespace footballnew.Enums
{
    public enum ArticleStatus
    {
        Draft = 0,        // Bản nháp
        PendingReview = 1,// Chờ duyệt
        Published = 2,    // Đã xuất bản
        Archived = 3,     // Lưu trữ (ẩn khỏi public)
        Deleted = 4       // Đã xóa (soft delete)
    }
}