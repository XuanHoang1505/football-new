import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
import { Spinner } from "react-bootstrap";
import { TableManagement } from "../../../components/admin/index";
import ArticleService from "../../../services/admin/ArticleService";
import Page500 from "../../../pages/site/page500/Page500";
import { formatDateTimeToDMY } from "../../../utils/formatDate";

const ArticleListPage = () => {
  const [articleData, setArticleData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false);
  const [errorServer, setErrorServer] = useState(null);

  const button = {
    btnAdd: false,
    btnEdit: false,
    btnDelete: false,
    btnDetail: true,
    btnSetting: false,
    btnReject: true,
    btnApprove: true,
  };

  // Cột hiển thị cho bài viết
  const articleColumns = [
    { key: "id", label: "ID" },
    { key: "thumbnail", label: "Ảnh chính" },
    { key: "title", label: "Tiêu đề" },
    { key: "authorName", label: "Tác giả" },
    { key: "categoryName", label: "Danh mục" },
    { key: "status", label: "Trạng thái" },
    { key: "submittedDate", label: "Ngày nộp bài" },
    { key: "summary", label: "Tóm tắt" },
  ];

  const keysToRemove = ["summary", "id"];
  const defaultColumns = articleColumns.filter(
    (column) => !keysToRemove.includes(column.key)
  );

  const fetchArticleData = async () => {
    setLoadingPage(true);
    try {
      const data = await ArticleService.getPendingArticles();

      const formatData = data.map((d) => ({
        ...d,
        submittedDate: formatDateTimeToDMY(d.submittedDate),
      }));


      setArticleData(formatData);
    } catch (err) {
      setErrorServer(err.message);
    } finally {
      setLoadingPage(false);
    }
  };

  useEffect(() => {
    fetchArticleData();
  }, []);

  const handleApprove = async (id, options) => {
    if (!id) return;
    setIsLoading(true);
    try {
      await ArticleService.approveArticle(id, options);
      setArticleData((prev) => prev.filter((a) => a.id !== id));
      toast.success("Bài viết đã được duyệt!");
    } catch (error) {
      const msg = error?.response?.data?.message || "Duyệt bài thất bại.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (id, reason) => {
    if (!id) return;
    setIsLoading(true);
    try {
      await ArticleService.rejectArticle(id, reason);
      setArticleData((prev) => prev.filter((a) => a.id !== id));
      toast.success("Bài viết đã bị từ chối!");
    } catch (error) {
      const msg = error?.response?.data?.message || "Từ chối bài thất bại.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <>
      <Helmet>
        <title>Danh sách bài viết chờ duyệt - Thể Thao 247</title>
      </Helmet>
      {loadingPage ? (
        <div className="w-100 h-100 d-flex justify-content-center align-items-center">
          <Spinner animation="border" className="text-primary" />
        </div>
      ) : errorServer ? (
        <Page500 message={errorServer} />
      ) : (
        <section className="row m-0 p-0">
          <TableManagement
            columns={articleColumns}
            data={articleData}
            title="Danh sách bài viết yêu cầu duyệt"
            defaultColumns={defaultColumns}
            isLoading={isLoading}
            buttonCustom={button}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </section>
      )}
    </>
  );
};

export default ArticleListPage;
