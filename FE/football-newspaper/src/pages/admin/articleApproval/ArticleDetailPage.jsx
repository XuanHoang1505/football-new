import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Space,
  Tag,
  Divider,
  Spin,
  Modal,
  Input,
  Form,
  Avatar,
  Badge,
  Descriptions,
  Image,
  Tabs,
  Alert,
  Radio,
  Upload,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
  EyeOutlined,
  UserOutlined,
  CalendarOutlined,
  FolderOutlined,
  ArrowLeftOutlined,
  SaveOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  FieldTimeOutlined,
  UploadOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import ReactQuill from "react-quill";
import { toast } from "react-toastify";
import ArticleService from "../../../services/admin/ArticleService";

import "react-quill/dist/quill.snow.css";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const modules = {
  toolbar: [
    [{ font: [] }, { size: [] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    ["link"],
    ["clean"],
  ],
};

const formats = [
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "list",
  "bullet",
  "align",
  "link",
];

const ArticleDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { initEditMode } = location.state || {};

  const [articleDetail, setArticleDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(initEditMode);
  const [editedData, setEditedData] = useState({
    title: "",
    summary: "",
    contents: [],
    newMainImage: null,
    newContentImages: [],
  });
  const [saving, setSaving] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [approveOptions, setApproveOptions] = useState({
    publishNow: true,
    publishDate: null,
  });
  const [activeTab, setActiveTab] = useState("preview");
  const [processing, setProcessing] = useState(false);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const data = await ArticleService.getArticleBySlug(slug);
      setArticleDetail(data);
      setEditedData({
        title: data.title,
        summary: data.summary,
        contents: data.contents || [],
        newMainImage: null,
        newContentImages: [],
      });
    } catch (error) {
      console.error("Lỗi khi fetch bài báo", error);
      toast.error("Không thể tải bài viết!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  // Xử lý lưu thay đổi với Auto-detect
  const handleSaveChanges = async () => {
    try {
      setSaving(true);

      const articleData = {
        title: editedData.title.trim(),
        summary: editedData.summary.trim(),
        contents: editedData.contents.map((c, idx) => ({
          orderIndex: idx + 1,
          type: c.type === "Paragraph" ? 0 : 1,
          text: c.text || "",
          // GỬI THÔNG TIN ẢNH CŨ (nếu có và không thay đổi)
          image: c.image
            ? {
                url: c.image.url, // ← ẢNH CŨ
                caption: c.image.caption || "",
                credits: c.image.credits || "",
              }
            : null,
        })),
      };

      // Chuẩn bị blocks có ảnh mới
      const newContentImages = editedData.newContentImages
        .filter((img) => img.file instanceof File)
        .map((img) => ({
          file: img.file,
          blockIndex: img.blockIndex,
        }));

      await ArticleService.updateArticle(
        articleDetail.id,
        articleData,
        editedData.newMainImage,
        newContentImages
      );

      await fetchArticle();
      setEditMode(false);
      toast.success("Đã lưu thay đổi thành công!");
    } catch (error) {
      toast.error("Không thể lưu thay đổi!");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  // Xử lý duyệt bài
  const handleApprove = async () => {
    if (!approveOptions.publishNow && !approveOptions.publishDate) {
      toast.error("Vui lòng chọn ngày xuất bản!");
      return;
    }

    try {
      setProcessing(true);
      await ArticleService.approveArticle(articleDetail.id, approveOptions);
      toast.success(
        approveOptions.publishNow
          ? "Đã duyệt và xuất bản bài viết!"
          : "Đã duyệt bài viết. Sẽ xuất bản vào thời gian đã chọn!"
      );
      setShowApproveModal(false);
      navigate("/admin/article");
    } catch (error) {
      toast.error("Không thể duyệt bài viết!");
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  // Xử lý từ chối bài
  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error("Vui lòng nhập lý do từ chối!");
      return;
    }
    try {
      setProcessing(true);
      await ArticleService.rejectArticle(articleDetail.id, rejectReason);
      toast.success("Đã từ chối bài viết!");
      setShowRejectModal(false);
      navigate("/admin/article");
    } catch (error) {
      toast.error("Không thể từ chối bài viết!");
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  // Cập nhật tiêu đề
  const handleTitleChange = (e) => {
    setEditedData({ ...editedData, title: e.target.value });
  };

  // Cập nhật tóm tắt
  const handleSummaryChange = (e) => {
    setEditedData({ ...editedData, summary: e.target.value });
  };

  // Cập nhật nội dung block
  const handleContentChange = (index, field, value) => {
    const newContents = [...editedData.contents];

    if (field === "newImage") {
      // Thêm ảnh mới vào danh sách
      const newImages = [...editedData.newContentImages];
      newImages.push({
        file: value,
        blockIndex: index,
      });

      setEditedData({
        ...editedData,
        newContentImages: newImages,
      });
    } else if (field === "caption" || field === "credits") {
      // Cập nhật caption/credits trong image object
      newContents[index] = {
        ...newContents[index],
        image: {
          ...newContents[index].image,
          [field]: value,
        },
      };
      setEditedData({ ...editedData, contents: newContents });
    } else {
      // Các field khác (text cho paragraph)
      newContents[index] = { ...newContents[index], [field]: value };
      setEditedData({ ...editedData, contents: newContents });
    }
  };

  // Xử lý thay đổi ảnh chính
  const handleMainImageChange = (file) => {
    setEditedData({
      ...editedData,
      newMainImage: file,
    });
  };

  // Hủy chỉnh sửa
  const handleCancelEdit = () => {
    setEditMode(false);
    setEditedData({
      title: articleDetail.title,
      summary: articleDetail.summary,
      contents: articleDetail.contents || [],
      newMainImage: null,
      newContentImages: [],
    });
  };

  if (loading) {
    return <Spin size="large" tip="Đang tải bài viết..." fullscreen />;
  }

  if (!articleDetail) {
    return (
      <Alert
        message="Không tìm thấy bài viết"
        type="error"
        showIcon
        style={{ margin: "50px auto", maxWidth: 600 }}
      />
    );
  }

  const mainImage = articleDetail.images?.find((img) => img.isMain);

  const tabItems = [
    {
      key: "preview",
      label: (
        <span>
          <EyeOutlined /> Xem trước
        </span>
      ),
      children: (
        <div>
          {/* Header bài viết */}
          <Card style={{ marginBottom: 24 }}>
            <Space direction="vertical" style={{ width: "100%" }} size="large">
              {/* Tiêu đề */}
              {editMode ? (
                <div>
                  <Text strong style={{ display: "block", marginBottom: 8 }}>
                    Tiêu đề:
                  </Text>
                  <Input
                    size="large"
                    value={editedData.title}
                    onChange={handleTitleChange}
                    placeholder="Nhập tiêu đề..."
                  />
                </div>
              ) : (
                <Title level={2} style={{ marginBottom: 0 }}>
                  {articleDetail.title}
                </Title>
              )}

              {/* Thông tin tác giả */}
              <Space size="large" wrap>
                <Space>
                  <Avatar
                    src={articleDetail.authorAvatar}
                    icon={<UserOutlined />}
                  />
                  <div>
                    <Text strong>{articleDetail.authorName}</Text>
                    <div>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        Tác giả
                      </Text>
                    </div>
                  </div>
                </Space>

                <Space>
                  <CalendarOutlined />
                  <Text type="secondary">
                    {new Date(articleDetail.datePublished).toLocaleString(
                      "vi-VN"
                    )}
                  </Text>
                </Space>

                <Space>
                  <FolderOutlined />
                  <Space wrap>
                    {articleDetail.categories?.map((cat) => (
                      <Tag key={cat.id} color="blue">
                        {cat.name}
                      </Tag>
                    ))}
                  </Space>
                </Space>
              </Space>

              {/* Trạng thái */}
              <div>
                <Badge
                  status={
                    articleDetail.status === "PUBLISHED"
                      ? "success"
                      : articleDetail.status === "PENDING"
                      ? "warning"
                      : "error"
                  }
                  text={
                    articleDetail.status === "PUBLISHED"
                      ? "Đã xuất bản"
                      : articleDetail.status === "PENDING"
                      ? "Chờ duyệt"
                      : "Đã từ chối"
                  }
                />
              </div>

              <Divider />

              {/* Tóm tắt */}
              <div>
                <Text strong style={{ display: "block", marginBottom: 8 }}>
                  Tóm tắt:
                </Text>
                {editMode ? (
                  <TextArea
                    rows={4}
                    value={editedData.summary}
                    onChange={handleSummaryChange}
                    placeholder="Nhập tóm tắt..."
                  />
                ) : (
                  <Paragraph
                    style={{
                      background: "#f0f5ff",
                      padding: 16,
                      borderRadius: 8,
                      borderLeft: "4px solid #1890ff",
                      fontStyle: "italic",
                    }}
                  >
                    {articleDetail.summary}
                  </Paragraph>
                )}
              </div>
            </Space>
          </Card>

          {/* Ảnh chính */}
          {(mainImage || editedData.newMainImage) && (
            <Card style={{ marginBottom: 24 }}>
              <Text strong style={{ display: "block" }}>
                Ảnh chính:
              </Text>
              <Divider />
              <Image
                src={
                  editedData.newMainImage
                    ? URL.createObjectURL(editedData.newMainImage)
                    : mainImage?.url
                }
                alt={mainImage?.altText}
                style={{ width: "100%", borderRadius: 8 }}
                preview
              />
              {editMode && (
                <Upload
                  accept="image/*"
                  beforeUpload={() => false}
                  maxCount={1}
                  onChange={(info) => handleMainImageChange(info.file)}
                  style={{ marginTop: 12 }}
                >
                  <Button icon={<UploadOutlined />} block>
                    {editedData.newMainImage
                      ? "Thay đổi ảnh chính"
                      : "Tải ảnh mới"}
                  </Button>
                </Upload>
              )}
              {mainImage?.caption && (
                <Text
                  type="secondary"
                  style={{ display: "block", marginTop: 8 }}
                >
                  {mainImage.caption}
                </Text>
              )}
              {mainImage?.credits && (
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Nguồn: {mainImage.credits}
                </Text>
              )}
              {editedData.newMainImage && (
                <Alert
                  message="Ảnh mới sẽ được tải lên khi bạn lưu thay đổi"
                  type="info"
                  showIcon
                  style={{ marginTop: 12 }}
                />
              )}
            </Card>
          )}

          {/* Nội dung bài viết */}
          {editedData.contents?.map((content, index) => (
            <Card
              key={content.id}
              style={{ marginBottom: 24 }}
              title={
                <Space>
                  <Badge
                    count={index + 1}
                    style={{ backgroundColor: "#1890ff" }}
                  />
                  <Text strong>
                    {content.type === "Paragraph" ? "Đoạn văn" : "Hình ảnh"}
                  </Text>
                </Space>
              }
            >
              {content.type === "Paragraph" ? (
                editMode ? (
                  <ReactQuill
                    theme="snow"
                    value={content.text}
                    onChange={(value) =>
                      handleContentChange(index, "text", value)
                    }
                    modules={modules}
                    formats={formats}
                    style={{ minHeight: 200 }}
                  />
                ) : (
                  <div
                    dangerouslySetInnerHTML={{ __html: content.text }}
                    style={{ fontSize: 15, lineHeight: 1.8 }}
                  />
                )
              ) : (
                <div style={{ textAlign: "center" }}>
                  {editMode ? (
                    <>
                      {/* Preview ảnh - ưu tiên ảnh mới */}
                      {editedData.newContentImages.find(
                        (img) => img.blockIndex === index
                      ) ? (
                        <div style={{ marginBottom: 12 }}>
                          <Image
                            src={URL.createObjectURL(
                              editedData.newContentImages.find(
                                (img) => img.blockIndex === index
                              ).file
                            )}
                            alt="preview"
                            style={{ maxWidth: "100%", borderRadius: 8 }}
                            preview
                          />
                          <Alert
                            message="Ảnh mới - Sẽ được tải lên khi lưu"
                            type="info"
                            showIcon
                            style={{ marginTop: 8 }}
                          />
                        </div>
                      ) : content.image?.url ? (
                        <Image
                          src={content.image?.url}
                          alt={content.image?.altText}
                          style={{
                            maxWidth: "100%",
                            borderRadius: 8,
                            marginBottom: 12,
                          }}
                          preview
                        />
                      ) : null}

                      {/* Upload button */}
                      <Upload
                        accept="image/*"
                        beforeUpload={() => false}
                        maxCount={1}
                        onChange={(info) =>
                          handleContentChange(index, "newImage", info.file)
                        }
                      >
                        <Button icon={<UploadOutlined />} block>
                          {editedData.newContentImages.find(
                            (img) => img.blockIndex === index
                          )
                            ? "Thay đổi ảnh"
                            : "Tải ảnh mới"}
                        </Button>
                      </Upload>

                      {/* Caption và Credits */}
                      <Input
                        className="mt-3"
                        placeholder="Nhập chú thích cho ảnh..."
                        value={content.image?.caption || ""}
                        onChange={(e) =>
                          handleContentChange(index, "caption", e.target.value)
                        }
                        prefix={<EditOutlined />}
                      />
                      <Input
                        className="mt-2"
                        placeholder="Nguồn ảnh (nếu có)..."
                        value={content.image?.credits || ""}
                        onChange={(e) =>
                          handleContentChange(index, "credits", e.target.value)
                        }
                        prefix={<FileTextOutlined />}
                      />
                    </>
                  ) : (
                    <>
                      <Image
                        src={content.image?.url}
                        alt={content.image?.altText}
                        style={{ maxWidth: "100%", borderRadius: 8 }}
                        preview
                      />
                      {content.image?.caption && (
                        <Text
                          type="secondary"
                          style={{ display: "block", marginTop: 8 }}
                        >
                          {content.image.caption}
                        </Text>
                      )}
                      {content.image?.credits && (
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          Nguồn: {content.image.credits}
                        </Text>
                      )}
                    </>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      ),
    },
    {
      key: "metadata",
      label: (
        <span>
          <FolderOutlined /> Thông tin
        </span>
      ),
      children: (
        <Card>
          <Descriptions column={1} bordered>
            <Descriptions.Item label="ID">{articleDetail.id}</Descriptions.Item>
            <Descriptions.Item label="Slug">
              {articleDetail.slug}
            </Descriptions.Item>
            <Descriptions.Item label="Tác giả">
              <Space>
                <Avatar src={articleDetail.authorAvatar} size="small" />
                {articleDetail.authorName}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag
                color={
                  articleDetail.status === "PUBLISHED"
                    ? "success"
                    : articleDetail.status === "PENDING"
                    ? "warning"
                    : "error"
                }
              >
                {articleDetail.status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Danh mục">
              <Space wrap>
                {articleDetail.categories?.map((cat) => (
                  <Tag key={cat.id} color="blue">
                    {cat.name}
                    {cat.parentName && ` (${cat.parentName})`}
                  </Tag>
                ))}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Ngày nộp bài">
              {new Date(articleDetail.submitDate).toLocaleString("vi-VN")}
            </Descriptions.Item>
            {articleDetail.status !== "PENDING" && (
              <Descriptions.Item label="Ngày xuất bản">
                {new Date(articleDetail.datePublished).toLocaleString("vi-VN")}
              </Descriptions.Item>
            )}
            <Descriptions.Item label="Số lượng ảnh">
              {articleDetail.images?.length || 0}
            </Descriptions.Item>
            <Descriptions.Item label="Số block nội dung">
              {articleDetail.contents?.length || 0}
            </Descriptions.Item>
            {articleDetail.status !== "PENDING" && (
              <>
                <Descriptions.Item label="Lượt xem">
                  {articleDetail.viewCount}
                </Descriptions.Item>
                <Descriptions.Item label="Lượt chia sẻ">
                  {articleDetail.shareCount}
                </Descriptions.Item>
                <Descriptions.Item label="Bình luận">
                  {articleDetail.commentCount}
                </Descriptions.Item>
              </>
            )}
          </Descriptions>
        </Card>
      ),
    },
  ];

  return (
    <>
      <Helmet>
        <title>Chi tiết bài viết - {articleDetail.title}</title>
      </Helmet>

      <div
        style={{ padding: "24px", background: "#f0f2f5", minHeight: "100vh" }}
      >
        {/* Header Actions */}
        <Card style={{ marginBottom: 24 }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
                Quay lại
              </Button>
            </Col>
            <Col>
              <Space>
                {editMode ? (
                  <>
                    <Button onClick={handleCancelEdit}>Hủy</Button>
                    <Button
                      type="primary"
                      icon={<SaveOutlined />}
                      loading={saving}
                      onClick={handleSaveChanges}
                    >
                      Lưu thay đổi
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      icon={<EditOutlined />}
                      onClick={() => setEditMode(true)}
                    >
                      Chỉnh sửa
                    </Button>
                    {articleDetail.status === "PENDING" && (
                      <>
                        <Button
                          danger
                          icon={<CloseCircleOutlined />}
                          onClick={() => setShowRejectModal(true)}
                        >
                          Từ chối
                        </Button>
                        <Button
                          type="primary"
                          icon={<CheckCircleOutlined />}
                          onClick={() => setShowApproveModal(true)}
                        >
                          Duyệt bài
                        </Button>
                      </>
                    )}
                  </>
                )}
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Edit Mode Warning */}
        {editMode && (
          <Alert
            message="Chế độ chỉnh sửa"
            description="Bạn đang ở chế độ chỉnh sửa. Thay đổi của bạn chưa được lưu."
            type="warning"
            showIcon
            icon={<WarningOutlined />}
            style={{ marginBottom: 24 }}
          />
        )}

        {/* Content Tabs */}
        <Card>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            size="large"
          />
        </Card>

        {/* Modal Từ chối */}
        <Modal
          title={
            <Space>
              <CloseCircleOutlined style={{ color: "#ff4d4f" }} />
              <span>Từ chối bài viết</span>
            </Space>
          }
          open={showRejectModal}
          onCancel={() => {
            setShowRejectModal(false);
            setRejectReason("");
          }}
          onOk={handleReject}
          okText="Xác nhận từ chối"
          cancelText="Hủy"
          okButtonProps={{ danger: true }}
          confirmLoading={processing}
        >
          <Space direction="vertical" style={{ width: "100%" }} size="large">
            <Alert
              message="Cảnh báo"
              description="Bài viết sẽ bị từ chối và tác giả sẽ nhận được thông báo."
              type="warning"
              showIcon
            />

            <Form layout="vertical">
              <Form.Item
                label="Lý do từ chối"
                required
                help="Vui lòng cho tác giả biết lý do từ chối để họ có thể cải thiện"
                style={{ marginBottom: 0 }}
              >
                <TextArea
                  rows={4}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Ví dụ: Nội dung chưa chính xác, thiếu nguồn trích dẫn, sai chính tả..."
                />
              </Form.Item>
            </Form>

            {/* Thông tin bài viết */}
            <Alert
              message="Thông tin bài viết"
              description={
                <Space direction="vertical">
                  <Text>
                    <strong>Tác giả:</strong> {articleDetail.authorName}
                  </Text>
                  <Text>
                    <strong>Tiêu đề:</strong> {articleDetail.title}
                  </Text>
                </Space>
              }
              type="info"
              showIcon={false}
            />
          </Space>
        </Modal>

        {/* Modal Duyệt bài */}
        <Modal
          title={
            <Space>
              <CheckCircleOutlined style={{ color: "#52c41a" }} />
              <span>Duyệt bài viết</span>
            </Space>
          }
          open={showApproveModal}
          onCancel={() => {
            setShowApproveModal(false);
            setApproveOptions({
              publishNow: true,
              publishDate: null,
            });
          }}
          onOk={handleApprove}
          okText="Xác nhận duyệt"
          cancelText="Hủy"
          confirmLoading={processing}
          okButtonProps={{
            disabled: !approveOptions.publishNow && !approveOptions.publishDate,
          }}
        >
          <Space direction="vertical" style={{ width: "100%" }} size="large">
            <Alert
              message="Xác nhận duyệt bài"
              description="Chọn cách thức xuất bản bài viết này."
              type="success"
              showIcon
            />

            {/* Options xuất bản */}
            <div>
              <Text strong style={{ display: "block", marginBottom: 12 }}>
                Cách thức xuất bản:
              </Text>
              <Radio.Group
                value={approveOptions.publishNow}
                onChange={(e) =>
                  setApproveOptions({
                    ...approveOptions,
                    publishNow: e.target.value,
                    publishDate: e.target.value
                      ? null
                      : approveOptions.publishDate,
                  })
                }
                style={{ width: "100%" }}
              >
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Radio value={true}>
                    <Space>
                      <CheckCircleOutlined style={{ color: "#52c41a" }} />
                      <span>Xuất bản ngay</span>
                    </Space>
                  </Radio>
                  <Radio value={false}>
                    <Space>
                      <FieldTimeOutlined style={{ color: "#1890ff" }} />
                      <span>Hẹn giờ xuất bản</span>
                    </Space>
                  </Radio>
                </Space>
              </Radio.Group>
            </div>

            {/* DatePicker khi chọn hẹn giờ */}
            {!approveOptions.publishNow && (
              <Form.Item
                label="Chọn ngày giờ xuất bản"
                style={{ marginBottom: 0 }}
              >
                <Input
                  type="datetime-local"
                  size="large"
                  value={approveOptions.publishDate || ""}
                  onChange={(e) =>
                    setApproveOptions({
                      ...approveOptions,
                      publishDate: e.target.value,
                    })
                  }
                  min={new Date().toISOString().slice(0, 16)}
                  prefix={<CalendarOutlined />}
                  placeholder="Chọn ngày giờ..."
                />
                <Text
                  type="secondary"
                  style={{ fontSize: 12, display: "block", marginTop: 4 }}
                >
                  Bài viết sẽ tự động xuất bản vào thời gian đã chọn
                </Text>
              </Form.Item>
            )}

            {/* Thông tin tóm tắt */}
            <Alert
              message="Tóm tắt"
              description={
                <Space direction="vertical">
                  <Text>
                    <strong>Tác giả:</strong> {articleDetail.authorName}
                  </Text>
                  <Text>
                    <strong>Tiêu đề:</strong> {articleDetail.title}
                  </Text>
                  <Text>
                    <strong>Cách xuất bản:</strong>{" "}
                    {approveOptions.publishNow ? (
                      <Tag color="success">Xuất bản ngay</Tag>
                    ) : approveOptions.publishDate ? (
                      <Tag color="blue">
                        Hẹn giờ:{" "}
                        {new Date(approveOptions.publishDate).toLocaleString(
                          "vi-VN"
                        )}
                      </Tag>
                    ) : (
                      <Tag color="default">Chưa chọn</Tag>
                    )}
                  </Text>
                </Space>
              }
              type="info"
              showIcon={false}
            />
          </Space>
        </Modal>
      </div>
    </>
  );
};

export default ArticleDetailPage;
