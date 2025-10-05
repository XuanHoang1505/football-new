import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { TableManagement } from "../../../components/admin/index";
import { Helmet } from "react-helmet-async";
import { Spinner, Form } from "react-bootstrap";
import Select from "react-select";
import CommentService from "../../../services/site/CommentService";
import ArticleService from "../../../services/admin/ArticleService";
import UserService from "../../../services/admin/UserService";
import Page500 from "../../../pages/site/page500/Page500";
import { Alert } from "antd";

const CommentManagement = () => {
  const [commentData, setCommentData] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    userId: "",
    articleId: "",
    content: "",
    parentId: "",
    isHidden: false,
  });

  const [errorFields, setErrorFields] = useState({});
  const [statusFunction, setStatusFunction] = useState({
    isAdd: false,
    isEditing: false,
    isViewDetail: false,
  });

  const [listUserOption, setListUserOption] = useState([]);
  const [listArticleOption, setListArticleOption] = useState([]);
  const [listParentCommentOption, setListParentCommentOption] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false);
  const [errorServer, setErrorServer] = useState(null);

  const button = {
    btnAdd: true,
    btnEdit: true,
    btnDelete: true,
    btnDetail: false,
    btnSetting: false,
  };

  const commentColumns = [
    { key: "id", label: "ID" },
    { key: "userName", label: "Người bình luận" },
    { key: "articleTitle", label: "Bài viết" },
    { key: "content", label: "Nội dung bình luận" },
    { key: "createdAt", label: "Ngày bình luận" },
    { key: "likeCount", label: "Lượt thích" },
    { key: "isHidden", label: "Trạng thái" },
  ];

  const defaultColumns = commentColumns;

  // Gọi API để lấy dữ liệu
  const fetchCommentData = async () => {
    setLoadingPage(true);
    try {
      const comments = await CommentService.getAllComments();

      const formatted = comments.map((c) => ({
        ...c,
        articleTitle: c.articleTitle || `(ID: ${c.articleId})`,
      }));

      setCommentData(formatted);
    } catch (err) {
      setErrorServer(err.message);
    } finally {
      setLoadingPage(false);
    }

    try {
      // Lấy danh sách bài viết
      const articles = await ArticleService.getPublishedArticles();
      setListArticleOption(
        articles.map((a) => ({
          value: a.id,
          label: a.title,
        }))
      );

      // Lấy danh sách user
      const users = await UserService.getUsers();
      setListUserOption(
        users.map((u) => ({
          value: u.id,
          label: u.userName || u.fullName,
        }))
      );

      // Lấy danh sách bình luận cha
      const comments = await CommentService.getRootComments();
      setListParentCommentOption(
        comments.map((c) => ({
          value: c.id,
          label: `#${c.id} - ${c.content.slice(0, 50)}...`,
        }))
      );
    } catch (error) {
      toast.error("Lỗi khi lấy danh sách bài viết hoặc người dùng!");
    }
  };

  useEffect(() => {
    fetchCommentData();
  }, []);

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.articleId)
      newErrors.articleId = "Bài viết không được để trống.";
    if (!formData.userId)
      newErrors.userId = "Người bình luận không được để trống.";
    if (!formData.content || formData.content.trim() === "")
      newErrors.content = "Nội dung không được để trống.";
    setErrorFields(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errorFields[key]) validateForm();
  };

  const updateStatus = (newStatus) => {
    setStatusFunction((prev) => ({ ...prev, ...newStatus }));
  };

  const handleResetStatus = () => {
    updateStatus({ isAdd: true, isEditing: false, isViewDetail: false });
  };

  const handleReset = () => {
    setFormData({
      id: "",
      userId: "",
      articleId: "",
      content: "",
      parentId: "",
      isHidden: false,
    });
    handleResetStatus();
    setErrorFields({});
  };

  const handleEdit = (item) => {
    setFormData({ ...item });
    updateStatus({ isEditing: true });
    setErrorFields({});
  };

  const handleSaveItem = async () => {
    if (!validateForm()) return false;
    setIsLoading(true);
    try {
      if (statusFunction.isEditing) {
        const updated = await CommentService.updateComment(
          formData.id,
          formData
        );
        console.log(updated);
        
        setCommentData((prev) =>
          prev.map((c) => (c.id === updated.id ? updated : c))
        );
        toast.success("Cập nhật bình luận thành công!");
      } else {
        const newItem = await CommentService.createComment(formData);
        setCommentData((prev) => [...prev, newItem]);
        toast.success("Thêm bình luận thành công!");
      }
      handleReset();
      return true;
    } catch (error) {
      toast.error("Có lỗi khi lưu bình luận!");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (deleteId) => {
    if (!deleteId) return;
    setIsLoading(true);
    try {
      await CommentService.deleteComment(deleteId);
      setCommentData((prev) => prev.filter((c) => c.id !== deleteId));
      toast.success("Xóa bình luận thành công!");
    } catch (error) {
      toast.error("Lỗi khi xóa bình luận!");
    } finally {
      setIsLoading(false);
    }
  };

  const modalContent = (
    <>
      {/* Alert với styling đẹp hơn */}
      {statusFunction.isEditing && (
        <div
          className="alert alert-info border-0 mb-4"
          role="alert"
          style={{
            backgroundColor: "#cfe2ff",
            color: "#084298",
            boxShadow: "0 0.125rem 0.25rem rgba(0,0,0,0.075)",
          }}
        >
          <div className="d-flex align-items-start">
            <span className="me-2 mt-1" style={{ fontSize: "1.2rem" }}>
              ℹ️
            </span>
            <div>
              <h6 className="alert-heading mb-1 fw-semibold">
                Chế độ chỉnh sửa
              </h6>
              <p className="mb-0 small">
                Bạn chỉ có thể sửa nội dung bình luận. Người bình luận và bình
                luận cha không thể thay đổi.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="row g-3">
        {/* Cột trái */}
        <div className="col-md-6">
          {/* Bài viết */}
          <div className="mb-3">
            <label
              className="form-label fw-semibold"
              style={{ fontSize: "0.95rem", color: "#495057" }}
            >
              Bài viết
              <span className="text-danger ms-1">*</span>
            </label>
            <Select
              options={listArticleOption}
              value={listArticleOption.find(
                (opt) => opt.value === formData.articleId
              )}
              onChange={(opt) =>
                handleInputChange("articleId", opt ? opt.value : "")
              }
              placeholder="Chọn bài viết..."
              isDisabled={statusFunction.isEditing}
              styles={{
                control: (base, state) => ({
                  ...base,
                  borderColor: errorFields.articleId
                    ? "#dc3545"
                    : state.isFocused
                    ? "#86b7fe"
                    : "#dee2e6",
                  boxShadow: state.isFocused
                    ? errorFields.articleId
                      ? "0 0 0 0.25rem rgba(220, 53, 69, 0.25)"
                      : "0 0 0 0.25rem rgba(13, 110, 253, 0.25)"
                    : "none",
                  "&:hover": {
                    borderColor: errorFields.articleId ? "#dc3545" : "#86b7fe",
                  },
                }),
                placeholder: (base) => ({
                  ...base,
                  color: "#6c757d",
                }),
              }}
            />
            {errorFields.articleId && (
              <div
                className="text-danger d-block mt-1"
                style={{ fontSize: "0.875rem" }}
              >
                <span className="me-1">⚠️</span>
                {errorFields.articleId}
              </div>
            )}
          </div>

          {/* Bình luận cha */}
          <div className="mb-3">
            <label
              className="form-label fw-semibold"
              style={{ fontSize: "0.95rem", color: "#495057" }}
            >
              Bình luận cha
              <span className="text-muted ms-1 small">(không bắt buộc)</span>
            </label>
            <Select
              options={listParentCommentOption}
              value={listParentCommentOption.find(
                (opt) => opt.value === formData.parentId
              )}
              onChange={(opt) =>
                handleInputChange("parentId", opt ? opt.value : "")
              }
              placeholder="Chọn bình luận cha (nếu có)..."
              isClearable
              isDisabled={statusFunction.isEditing}
              styles={{
                control: (base, state) => ({
                  ...base,
                  borderColor: state.isFocused ? "#86b7fe" : "#dee2e6",
                  boxShadow: state.isFocused
                    ? "0 0 0 0.25rem rgba(13, 110, 253, 0.25)"
                    : "none",
                  "&:hover": {
                    borderColor: "#86b7fe",
                  },
                }),
                placeholder: (base) => ({
                  ...base,
                  color: "#6c757d",
                }),
              }}
            />
          </div>
        </div>

        {/* Cột phải */}
        <div className="col-md-6">
          {/* Người bình luận */}
          <div className="mb-3">
            <label
              className="form-label fw-semibold"
              style={{ fontSize: "0.95rem", color: "#495057" }}
            >
              Người bình luận
              <span className="text-danger ms-1">*</span>
            </label>
            <Select
              options={listUserOption}
              value={listUserOption.find(
                (opt) => opt.value === formData.userId
              )}
              onChange={(opt) =>
                handleInputChange("userId", opt ? opt.value : "")
              }
              placeholder="Chọn người dùng..."
              isDisabled={statusFunction.isEditing}
              styles={{
                control: (base, state) => ({
                  ...base,
                  borderColor: errorFields.userId
                    ? "#dc3545"
                    : state.isFocused
                    ? "#86b7fe"
                    : "#dee2e6",
                  boxShadow: state.isFocused
                    ? errorFields.userId
                      ? "0 0 0 0.25rem rgba(220, 53, 69, 0.25)"
                      : "0 0 0 0.25rem rgba(13, 110, 253, 0.25)"
                    : "none",
                  "&:hover": {
                    borderColor: errorFields.userId ? "#dc3545" : "#86b7fe",
                  },
                }),
                placeholder: (base) => ({
                  ...base,
                  color: "#6c757d",
                }),
              }}
            />
            {errorFields.userId && (
              <div
                className="text-danger d-block mt-1"
                style={{ fontSize: "0.875rem" }}
              >
                <span className="me-1">⚠️</span>
                {errorFields.userId}
              </div>
            )}
          </div>

          {/* Trạng thái */}
          {statusFunction.isEditing && (
            <div className="mb-3">
              <label
                className="form-label fw-semibold d-block mb-2"
                style={{ fontSize: "0.95rem", color: "#495057" }}
              >
                Trạng thái hiển thị
              </label>
              <div
                className="d-flex align-items-center p-3 border rounded-3"
                style={{ backgroundColor: "#f8f9fa" }}
              >
                <div className="flex-grow-1">
                  <div className="fw-medium">
                    {formData.isHidden ? (
                      <>
                        <span className="text-warning me-2">👁️‍🗨️</span>
                        Ẩn bình luận
                      </>
                    ) : (
                      <>
                        <span className="text-success me-2">👁️</span>
                        Hiển thị bình luận
                      </>
                    )}
                  </div>
                  <small className="text-muted">
                    {formData.isHidden
                      ? "Bình luận sẽ không hiển thị với người dùng"
                      : "Bình luận hiển thị công khai"}
                  </small>
                </div>
                <div className="form-check form-switch mb-0">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="commentVisibilitySwitch"
                    role="switch"
                    onChange={(e) =>
                      handleInputChange("isHidden", e.target.checked ? false : true)
                    }
                    checked={formData.isHidden === false}
                    style={{
                      width: "3rem",
                      height: "1.5rem",
                      cursor: "pointer",
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Nội dung - full width */}
        <div className="col-12">
          <div className="mb-2">
            <label
              className="form-label fw-semibold"
              style={{ fontSize: "0.95rem", color: "#495057" }}
            >
              Nội dung bình luận
              <span className="text-danger ms-1">*</span>
            </label>
            <textarea
              className={`form-control ${
                errorFields.content ? "is-invalid" : ""
              }`}
              rows={4}
              value={formData.content || ""}
              onChange={(e) => handleInputChange("content", e.target.value)}
              placeholder="Nhập nội dung bình luận..."
              style={{
                resize: "vertical",
                minHeight: "100px",
              }}
            />
            {errorFields.content && (
              <div className="invalid-feedback">
                <span className="me-1">⚠️</span>
                {errorFields.content}
              </div>
            )}
            <div className="form-text">
              <span className="me-1">💡</span>
              Nhập nội dung bình luận rõ ràng và phù hợp
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <Helmet>
        <title>Quản lý bình luận bài viết - Star Movie</title>
      </Helmet>

      {loadingPage ? (
        <div className="w-100 h-100 d-flex justify-content-center align-items-center">
          <Spinner animation="border" />
        </div>
      ) : errorServer ? (
        <Page500 message={errorServer} />
      ) : (
        <section className="row m-0 p-0">
          <TableManagement
            columns={commentColumns}
            data={commentData}
            title="Quản lý bình luận bài viết"
            defaultColumns={defaultColumns}
            modalContent={modalContent}
            handleReset={handleReset}
            onEdit={handleEdit}
            handleSaveItem={handleSaveItem}
            onDelete={handleDelete}
            isLoading={isLoading}
            statusFunction={statusFunction}
            onResetStatus={handleResetStatus}
            buttonCustom={button}
          />
        </section>
      )}
    </>
  );
};

export default CommentManagement;
