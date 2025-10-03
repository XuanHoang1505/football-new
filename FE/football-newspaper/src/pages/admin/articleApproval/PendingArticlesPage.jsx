import ArticleManagementPage from "../../../components/admin/common/articleManagement/ArticleManagementPage";

const PendingArticlesPage = () => {
  const articleColumns = [
    { key: "id", label: "ID" },
    { key: "imageUrl", label: "Ảnh chính" },
    { key: "title", label: "Tiêu đề" },
    { key: "authorName", label: "Tác giả" },
    { key: "categoryName", label: "Danh mục" },
    { key: "status", label: "Trạng thái" },
    { key: "submitDate", label: "Ngày nộp bài" },
    { key: "summary", label: "Tóm tắt" },
  ];

  const keysToRemove = ["summary", "id"];

  const buttons = {
    btnAdd: false,
    btnEdit: false,
    btnDelete: false,
    btnDetail: true,
    btnSetting: false,
    btnReject: true,
    btnApprove: true,
  };

  return (
    <ArticleManagementPage
      pageTitle="Danh sách bài viết chờ duyệt"
      tableTitle="Danh sách bài viết yêu cầu duyệt"
      fetchMethod="getPendingArticles"
      buttons={buttons}
      articleColumns={articleColumns}
      keysToRemove={keysToRemove}
    />
  );
};

export default PendingArticlesPage;
