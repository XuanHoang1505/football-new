// ArticleManagementPage.jsx
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
import { Spinner } from "react-bootstrap";
import { TableManagement } from "../../index";
import ArticleService from "../../../../services/admin/ArticleService";
import Page500 from "../../../../pages/site/page500/Page500";
import { formatDateTimeToDMY } from "../../../../utils/formatDate";
import { useNavigate } from "react-router-dom";

const ArticleManagementPage = ({
  pageTitle = "Quản lý bài viết",
  tableTitle = "Danh sách bài viết",
  fetchMethod = "getAllArticles",
  buttons = {},
  articleColumns = [],
  keysToRemove = [],
}) => {
  const navigate = useNavigate();
  const [articleData, setArticleData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false);
  const [errorServer, setErrorServer] = useState(null);

  const defaultColumns = articleColumns.filter(
    (column) => !keysToRemove.includes(column.key)
  );

  const fetchArticleData = async () => {
    setLoadingPage(true);
    try {
      const data = await ArticleService[fetchMethod]();
      const formatData = data.map((d) => ({
        ...d,
        submitDate: formatDateTimeToDMY(d.submitDate),
        datePublished: formatDateTimeToDMY(d.datePublished),
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

  const handleEdit = async (slug) => {
    navigate(`/admin/article/${slug}`, {
      state: {
        initEditMode: true,
      },
    });
  };

  const handleDelete = async (id) => {
    if (!id) return;
    setIsLoading(true);
    try {
      await ArticleService.deleteArticle(id);
      setArticleData((prev) => prev.filter((a) => a.id !== id));
      toast.success("Xóa bài viết thành công!");
    } catch (error) {
      const msg = error?.response?.data?.message || "Xóa bài thất bại.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetail = (slug) => {
    navigate(`/admin/article/${slug}`, {
      state: {
        initEditMode: false,
      },
    });
  };

  return (
    <>
      <Helmet>
        <title>{pageTitle} - Thể Thao 247</title>
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
            title={tableTitle}
            defaultColumns={defaultColumns}
            isLoading={isLoading}
            buttonCustom={buttons}
            onApprove={handleApprove}
            onReject={handleReject}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onViewDetail={handleViewDetail}
          />
        </section>
      )}
    </>
  );
};

export default ArticleManagementPage;
