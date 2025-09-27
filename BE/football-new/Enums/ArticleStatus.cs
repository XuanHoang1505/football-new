namespace footballnew.Enums
{
    public enum ArticleStatus
    {
        Draft = 0,        // Bản nháp
        PendingReview = 1,// Chờ duyệt
        Approved = 6,    // Đã duyệt chờ xuất bản 
        Published = 2,    // Đã xuất bản
        Rejected = 3,
        Archived = 4,     // Lưu trữ (ẩn khỏi public)
        Deleted = 5       // Đã xóa (soft delete)
    }
}