import ArticleManagementPage from "../../../components/admin/common/articleManagement/ArticleManagementPage";

const AllArticlesPage = () => {
  const articleColumns = [
    { key: "id", label: "ID" },
    { key: "imageUrl", label: "Ảnh chính" },
    { key: "title", label: "Tiêu đề" },
    { key: "authorName", label: "Tác giả" },
    { key: "categoryName", label: "Danh mục" },
    { key: "status", label: "Trạng thái" },
    { key: "submitDate", label: "Ngày nộp bài" },
    { key: "datePublished", label: "Ngày xuất bản" },
    { key: "summary", label: "Tóm tắt" },
    { key: "approvedBy", label: "Người duyệt bài" },
    { key: "rejectedBy", label: "Người từ chối" },
  ];

  const keysToRemove = ["summary", "id", "approvedBy", "rejectedBy"];

  const buttons = {
    btnAdd: true,
    btnEdit: true,
    btnDelete: true,
    btnDetail: true,
    btnSetting: false,
    btnReject: false,
    btnApprove: false,
  };

  return (
    <ArticleManagementPage
      pageTitle="Quản lý tất cả bài viết"
      tableTitle="Danh sách tất cả bài viết"
      fetchMethod="getArticles"
      buttons={buttons}
      articleColumns={articleColumns}
      keysToRemove={keysToRemove}
    />
  );
};

export default AllArticlesPage;
