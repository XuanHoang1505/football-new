import { useEffect, useState, useCallback, useRef } from "react";
import { Helmet } from "react-helmet-async";
import {
  Form,
  Input,
  Upload,
  Button,
  Card,
  Typography,
  Select,
  Space,
  Dropdown,
  Row,
  Col,
  Steps,
  Divider,
  Tag,
  Progress,
  Alert,
  Modal,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  UploadOutlined,
  FileTextOutlined,
  PictureOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  EditOutlined,
  EyeOutlined,
  SendOutlined,
  SaveOutlined,
  ClockCircleOutlined,
  InfoCircleOutlined,
  CheckOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import ReactQuill from "react-quill";
import { toast } from "react-toastify";
import CategoryService from "../../../services/admin/CategoryService";
import ArticleService from "../../../services/admin/ArticleService";
import DynamicBreadcrumb from "../../../components/site/breadcrumb/Breadcrumb";

import "react-quill/dist/quill.snow.css";
import styles from "./Submit.module.scss";

const { Title, Text, Paragraph } = Typography;

// Toolbar cho Quill
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

const contentTypeMap = {
  paragraph: 0,
  image: 1,
  code: 2,
};

const Submit = () => {
  const [title, setTitle] = useState("");
  const [mainImage, setMainImage] = useState(null);
  const [summary, setSummary] = useState("");
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [updating, setUpdating] = useState(false);
  const [mainCategory, setMainCategory] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  
  // Draft states
  const [lastSaved, setLastSaved] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [draftLoaded, setDraftLoaded] = useState(false);
  
  // Spell check states
  const [isCheckingSpelling, setIsCheckingSpelling] = useState(false);
  const [spellingErrors, setSpellingErrors] = useState([]);
  const [showSpellingModal, setShowSpellingModal] = useState(false);
  
  const autoSaveTimerRef = useRef(null);
  const isFirstRenderRef = useRef(true);

  const user = JSON.parse(localStorage.getItem("userDetail"));
  const DRAFT_KEY = `article_draft_${user?.userId || 'guest'}`;
  const AUTOSAVE_DELAY = 3000;

  // Tính toán % hoàn thành
  const calculateProgress = () => {
    let progress = 0;
    if (title.trim()) progress += 20;
    if (mainCategory) progress += 15;
    if (mainImage) progress += 15;
    if (summary.trim()) progress += 20;
    if (blocks.length > 0) progress += 30;
    return progress;
  };

  // Chuyển đổi File sang Base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Chuyển đổi Base64 sang File
  const base64ToFile = (base64String, filename) => {
    if (!base64String) return null;
    try {
      const arr = base64String.split(',');
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    } catch (error) {
      console.error('Error converting base64 to file:', error);
      return null;
    }
  };

  // Lưu bản nháp
  const saveDraft = useCallback(async () => {
    if (!title && !summary && blocks.length === 0) {
      return;
    }

    try {
      setIsSaving(true);

      const blocksWithBase64 = await Promise.all(
        blocks.map(async (block) => {
          if (block.type === 'image' && block.image instanceof File) {
            const base64 = await fileToBase64(block.image);
            return {
              ...block,
              image: null,
              imageData: base64,
              imageName: block.image.name,
            };
          }
          return {
            ...block,
            image: null,
          };
        })
      );

      let mainImageData = null;
      let mainImageName = null;
      if (mainImage instanceof File) {
        mainImageData = await fileToBase64(mainImage);
        mainImageName = mainImage.name;
      }

      const draftData = {
        title,
        summary,
        mainCategory,
        subCategories,
        blocks: blocksWithBase64,
        mainImageData,
        mainImageName,
        currentStep,
        savedAt: new Date().toISOString(),
        version: '2.0',
      };

      localStorage.setItem(DRAFT_KEY, JSON.stringify(draftData));
      setLastSaved(new Date());
      
    } catch (error) {
      console.error('Error saving draft:', error);
    } finally {
      setIsSaving(false);
    }
  }, [title, summary, mainCategory, subCategories, blocks, mainImage, currentStep, DRAFT_KEY]);

  // Debounced autosave
  const debouncedSaveDraft = useCallback(() => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
    
    autoSaveTimerRef.current = setTimeout(() => {
      saveDraft();
    }, AUTOSAVE_DELAY);
  }, [saveDraft, AUTOSAVE_DELAY]);

  // Load draft
  const loadDraft = useCallback(() => {
    try {
      const savedDraft = localStorage.getItem(DRAFT_KEY);
      if (!savedDraft) return;

      const draftData = JSON.parse(savedDraft);
      const savedDate = new Date(draftData.savedAt);
      
      Modal.confirm({
        title: (
          <Space>
            <SaveOutlined style={{ color: '#1890ff' }} />
            <span>Phát hiện bản nháp</span>
          </Space>
        ),
        icon: null,
        content: (
          <div>
            <Paragraph>
              Bạn có một bản nháp đã lưu vào lúc:{' '}
              <Text strong>{savedDate.toLocaleString('vi-VN')}</Text>
            </Paragraph>
            <Paragraph type="secondary" style={{ marginBottom: 0 }}>
              Bạn có muốn tiếp tục viết từ bản nháp này không?
            </Paragraph>
          </div>
        ),
        okText: 'Khôi phục bản nháp',
        cancelText: 'Bắt đầu mới',
        onOk: async () => {
          setTitle(draftData.title || '');
          setSummary(draftData.summary || '');
          setMainCategory(draftData.mainCategory || '');
          setSubCategories(draftData.subCategories || []);
          setCurrentStep(draftData.currentStep || 0);

          if (draftData.mainImageData && draftData.mainImageName) {
            const mainImageFile = base64ToFile(draftData.mainImageData, draftData.mainImageName);
            setMainImage(mainImageFile);
          }

          const restoredBlocks = draftData.blocks.map(block => {
            if (block.imageData && block.imageName) {
              const imageFile = base64ToFile(block.imageData, block.imageName);
              return {
                ...block,
                image: imageFile,
                imageData: undefined,
                imageName: undefined,
              };
            }
            return block;
          });
          setBlocks(restoredBlocks);

          setLastSaved(savedDate);
          setDraftLoaded(true);
          toast.success('Đã khôi phục bản nháp thành công!');
        },
        onCancel: () => {
          localStorage.removeItem(DRAFT_KEY);
          setDraftLoaded(true);
        },
      });
    } catch (error) {
      console.error('Error loading draft:', error);
      toast.error('Không thể tải bản nháp. Bản nháp có thể bị lỗi.');
      localStorage.removeItem(DRAFT_KEY);
      setDraftLoaded(true);
    }
  }, [DRAFT_KEY]);

  // Xóa bản nháp
  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(DRAFT_KEY);
      setLastSaved(null);
    } catch (error) {
      console.error('Error clearing draft:', error);
    }
  }, [DRAFT_KEY]);

  // Lưu thủ công
  const handleManualSave = async () => {
    await saveDraft();
    toast.success('Đã lưu bản nháp!', { autoClose: 2000 });
  };

  // Kiểm tra chính tả
  const checkSpelling = async () => {
    setIsCheckingSpelling(true);
    const errors = [];

    try {
      if (title.trim()) {
        const titleErrors = await checkTextSpelling(title, 'Tiêu đề');
        errors.push(...titleErrors);
      }

      if (summary.trim()) {
        const summaryErrors = await checkTextSpelling(summary, 'Tóm tắt');
        errors.push(...summaryErrors);
      }

      for (let i = 0; i < blocks.length; i++) {
        if (blocks[i].type === 'paragraph' && blocks[i].text) {
          const plainText = blocks[i].text.replace(/<[^>]*>/g, ' ').trim();
          if (plainText) {
            const blockErrors = await checkTextSpelling(plainText, `Đoạn văn #${i + 1}`);
            errors.push(...blockErrors);
          }
        }
      }

      setSpellingErrors(errors);
      setShowSpellingModal(true);

      if (errors.length === 0) {
        toast.success('Không phát hiện lỗi chính tả! 🎉');
      } else {
        toast.warning(`Phát hiện ${errors.length} lỗi tiềm năng`);
      }
    } catch (error) {
      console.error('Spell check error:', error);
      toast.error('Không thể kiểm tra chính tả. Vui lòng thử lại!');
    } finally {
      setIsCheckingSpelling(false);
    }
  };

  const checkTextSpelling = async (text, location) => {
    if (!text || text.trim().length === 0) return [];

    try {
      const response = await fetch('https://api.languagetool.org/v2/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          text: text,
          language: 'vi',
        }),
      });

      const data = await response.json();
      
      return data.matches.map((match) => ({
        location,
        message: match.message,
        context: match.context.text,
        offset: match.context.offset,
        length: match.context.length,
        suggestions: match.replacements.slice(0, 3).map((r) => r.value),
        type: match.rule.issueType,
      }));
    } catch (error) {
      console.error('Error checking spelling:', error);
      return [];
    }
  };

  // Check draft khi mount
  useEffect(() => {
    if (isFirstRenderRef.current) {
      const savedDraft = localStorage.getItem(DRAFT_KEY);
      if (savedDraft && !draftLoaded) {
        loadDraft();
      } else {
        setDraftLoaded(true);
      }
      isFirstRenderRef.current = false;
    }
  }, [DRAFT_KEY, loadDraft, draftLoaded]);

  // Auto-save khi có thay đổi
  useEffect(() => {
    if (draftLoaded && !isFirstRenderRef.current) {
      debouncedSaveDraft();
    }
    
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [title, summary, mainCategory, subCategories, blocks, mainImage, currentStep, debouncedSaveDraft, draftLoaded]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, []);

  const handleAddBlock = (type) => {
    setBlocks([
      ...blocks,
      {
        type,
        orderIndex: blocks.length,
        text: "",
        image: null,
        caption: "",
        credits: "",
      },
    ]);
  };

  const handleRemoveBlock = (index) => {
    const newBlocks = [...blocks];
    newBlocks.splice(index, 1);
    setBlocks(newBlocks);
  };

  const handleTextChange = (index, value) => {
    const newBlocks = [...blocks];
    newBlocks[index].text = value;
    setBlocks(newBlocks);
  };

  const handleImageChange = (index, file) => {
    const newBlocks = [...blocks];
    newBlocks[index].image = file;
    setBlocks(newBlocks);
  };

  const handleCaptionChange = (index, value) => {
    const newBlocks = [...blocks];
    newBlocks[index].caption = value;
    setBlocks(newBlocks);
  };

  const handleCreditsChange = (index, value) => {
    const newBlocks = [...blocks];
    newBlocks[index].credits = value;
    setBlocks(newBlocks);
  };

  const handleFormSubmit = async () => {
    if (!title.trim()) {
      toast.error("Tiêu đề không được để trống!");
      return;
    }
    if (!summary.trim()) {
      toast.error("Tóm tắt không được để trống!");
      return;
    }
    if (!mainCategory) {
      toast.error("Vui lòng chọn danh mục chính!");
      return;
    }
    if (!mainImage) {
      toast.error("Vui lòng chọn ảnh đại diện!");
      return;
    }
    if (blocks.length === 0) {
      toast.error("Vui lòng thêm ít nhất 1 block nội dung!");
      return;
    }
    if (!user?.userId) {
      toast.error("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại!");
      return;
    }

    try {
      setUpdating(true);

      const generateSlug = (str) =>
        str.toLowerCase().trim().replace(/ /g, "-").replace(/[^\w-]+/g, "");

      const articleData = {
        title: title.trim(),
        summary: summary.trim(),
        slug: generateSlug(title),
        authorId: user.userId,
        mainCategoryId: mainCategory,
        subCategoryIds: subCategories,
        contents: blocks.map((b, idx) => ({
          orderIndex: idx + 1,
          type: contentTypeMap[b.type] ?? 0,
          text: b.text,
          caption: b.caption,
          credits: b.credits,
        })),
      };

      const contentImages = blocks
        .map((b, idx) => (b.image ? { file: b.image, blockIndex: idx } : null))
        .filter(Boolean);

      await ArticleService.createArticle(articleData, mainImage, contentImages);
      console.log(contentImages);
      
      toast.success("Bài báo đã được gửi tới Admin, hãy chờ phê duyệt!");
      
      clearDraft();
      resetFormData();
    } catch (error) {
      toast.error("Có lỗi xảy ra khi gửi bài!");
      console.error("Submit error:", error);
    } finally {
      setUpdating(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await CategoryService.getCategories();
      setCategories(data);
    } catch (error) {
      console.log("Lỗi khi fetch categories", error);
    } finally {
      setLoading(false);
    }
  };

  const resetFormData = () => {
    setTitle("");
    setSummary("");
    setMainCategory("");
    setSubCategories([]);
    setMainImage(null);
    setBlocks([]);
    setCurrentStep(0);
    clearDraft();
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const validateCurrentStep = () => {
    if (currentStep === 0) {
      if (!title.trim()) {
        toast.error("Vui lòng nhập tiêu đề!");
        return false;
      }
      if (!mainCategory) {
        toast.error("Vui lòng chọn danh mục chính!");
        return false;
      }
      if (!mainImage) {
        toast.error("Vui lòng chọn ảnh đại diện!");
        return false;
      }
      if (!summary.trim()) {
        toast.error("Vui lòng nhập tóm tắt!");
        return false;
      }
    } else if (currentStep === 1) {
      if (blocks.length === 0) {
        toast.error("Vui lòng thêm ít nhất 1 block nội dung!");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const menuItems = [
    {
      key: "paragraph",
      label: (
        <Space>
          <FileTextOutlined />
          <span>Thêm đoạn văn</span>
        </Space>
      ),
      onClick: () => handleAddBlock("paragraph"),
    },
    {
      key: "image",
      label: (
        <Space>
          <PictureOutlined />
          <span>Thêm hình ảnh</span>
        </Space>
      ),
      onClick: () => handleAddBlock("image"),
    },
  ];

  const steps = [
    {
      title: "Thông tin cơ bản",
      icon: <EditOutlined />,
    },
    {
      title: "Nội dung bài viết",
      icon: <FileTextOutlined />,
    },
    {
      title: "Xem trước & Gửi",
      icon: <SendOutlined />,
    },
  ];

  const progress = calculateProgress();

  return (
    <>
      <Helmet>
        <title>Gửi bài viết mới</title>
      </Helmet>
      <div className={styles.container}>
        <DynamicBreadcrumb />

        <Card
          className="shadow-lg mt-3 border-0"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: "12px",
          }}
        >
          <Row align="middle" justify="space-between">
            <Col>
              <Title level={2} className="mb-2" style={{ color: "white" }}>
                ✍️ Tạo bài viết mới
              </Title>
              <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: "16px" }}>
                Chia sẻ những câu chuyện bóng đá độc đáo của bạn với cộng đồng
              </Text>
            </Col>
            <Col>
              <div style={{ textAlign: "center" }}>
                <Progress
                  type="circle"
                  percent={progress}
                  size={80}
                  strokeColor={{
                    "0%": "#52c41a",
                    "100%": "#73d13d",
                  }}
                  format={(percent) => (
                    <span style={{ color: "white", fontWeight: "bold" }}>
                      {percent}%
                    </span>
                  )}
                />
                <div style={{ color: "white", marginTop: 8, fontSize: 12 }}>
                  Hoàn thành
                </div>
              </div>
            </Col>
          </Row>
        </Card>

        {lastSaved && (
          <Alert
            type={isSaving ? "info" : "success"}
            showIcon={false}
            style={{
              marginTop: 12,
              borderRadius: "8px",
              border: `1px solid ${isSaving ? '#91d5ff' : '#b7eb8f'}`,
            }}
            message={
              <Row justify="space-between" align="middle">
                <Col>
                  <Space>
                    {isSaving ? (
                      <>
                        <ClockCircleOutlined spin />
                        <Text>Đang lưu bản nháp...</Text>
                      </>
                    ) : (
                      <>
                        <CheckCircleOutlined style={{ color: '#52c41a' }} />
                        <Text>
                          Đã lưu lúc {lastSaved.toLocaleTimeString('vi-VN')}
                        </Text>
                      </>
                    )}
                    <Tooltip title="Bản nháp được tự động lưu sau 3 giây khi bạn ngừng nhập">
                      <InfoCircleOutlined style={{ color: '#8c8c8c', cursor: 'help' }} />
                    </Tooltip>
                  </Space>
                </Col>
                <Col>
                  <Space>
                    <Button
                      size="small"
                      type="link"
                      icon={<CheckOutlined />}
                      onClick={checkSpelling}
                      loading={isCheckingSpelling}
                    >
                      Kiểm tra chính tả
                    </Button>
                    <Button
                      size="small"
                      type="link"
                      icon={<SaveOutlined />}
                      onClick={handleManualSave}
                      disabled={isSaving}
                    >
                      Lưu ngay
                    </Button>
                  </Space>
                </Col>
              </Row>
            }
          />
        )}

        <Card className="mt-4 shadow-sm" style={{ borderRadius: "12px" }}>
          <Steps current={currentStep} items={steps} />
        </Card>

        <Card className="mt-4 shadow-sm" style={{ borderRadius: "12px" }}>
          <Form layout="vertical" onFinish={handleFormSubmit}>
            {currentStep === 0 && (
              <div>
                <Title level={4} className="mb-3">
                  <EditOutlined /> Thông tin cơ bản
                </Title>
                <Divider style={{ margin: "12px 0 24px 0" }} />

                <Row gutter={16}>
                  <Col xs={24} lg={16}>
                    <Form.Item
                      label={
                        <span style={{ fontSize: 15, fontWeight: 500 }}>
                          Tiêu đề bài viết <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                    >
                      <Input
                        size="large"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Nhập tiêu đề hấp dẫn cho bài viết của bạn..."
                        maxLength={200}
                      />
                      <div style={{ marginTop: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {title.length}/200 ký tự
                        </Text>
                        {title.trim() && (
                          <Tag color="success" icon={<CheckCircleOutlined />}>
                            Đã nhập
                          </Tag>
                        )}
                      </div>
                    </Form.Item>
                  </Col>

                  <Col xs={24} lg={8}>
                    <Form.Item
                      label={
                        <span style={{ fontSize: 15, fontWeight: 500 }}>
                          Danh mục chính <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                    >
                      <Select
                        size="large"
                        loading={loading}
                        options={categories
                          .filter((c) => !subCategories.includes(String(c.id)))
                          .map((c) => ({ value: String(c.id), label: c.name }))}
                        value={mainCategory || undefined}
                        onChange={(val) => setMainCategory(val)}
                        placeholder="Chọn danh mục"
                        allowClear
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  label={
                    <span style={{ fontSize: 15, fontWeight: 500 }}>
                      Danh mục phụ
                    </span>
                  }
                >
                  <Select
                    size="large"
                    mode="multiple"
                    loading={loading}
                    options={categories
                      .filter((c) => String(c.id) !== mainCategory)
                      .map((c) => ({ value: String(c.id), label: c.name }))}
                    value={subCategories}
                    onChange={(vals) => setSubCategories(vals)}
                    placeholder="Chọn các danh mục bổ sung (không bắt buộc)"
                    maxTagCount="responsive"
                  />
                </Form.Item>

                <Row gutter={16}>
                  <Col xs={24} lg={12}>
                    <Form.Item
                      label={
                        <span style={{ fontSize: 15, fontWeight: 500 }}>
                          Ảnh đại diện <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                    >
                      <Upload.Dragger
                        accept="image/*"
                        beforeUpload={() => false}
                        maxCount={1}
                        onChange={(info) => setMainImage(info.file)}
                        style={{ borderRadius: "8px" }}
                      >
                        <p className="ant-upload-drag-icon">
                          <PictureOutlined style={{ fontSize: 48, color: "#1890ff" }} />
                        </p>
                        <p className="ant-upload-text" style={{ fontSize: 16 }}>
                          Kéo & thả ảnh vào đây
                        </p>
                        <p className="ant-upload-hint">
                          hoặc click để chọn ảnh từ thiết bị
                        </p>
                      </Upload.Dragger>
                      {mainImage && (
                        <div style={{ marginTop: 16, position: "relative" }}>
                          <img
                            src={URL.createObjectURL(mainImage)}
                            alt="preview"
                            className="rounded shadow"
                            style={{
                              maxHeight: 250,
                              width: "100%",
                              objectFit: "cover",
                              borderRadius: "8px",
                            }}
                          />
                          <Tag
                            color="success"
                            icon={<CheckCircleOutlined />}
                            style={{
                              position: "absolute",
                              top: 8,
                              right: 8,
                            }}
                          >
                            Đã chọn
                          </Tag>
                        </div>
                      )}
                    </Form.Item>
                  </Col>

                  <Col xs={24} lg={12}>
                    <Form.Item
                      label={
                        <span style={{ fontSize: 15, fontWeight: 500 }}>
                          Tóm tắt bài viết <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                    >
                      <Input.TextArea
                        rows={6}
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        placeholder="Viết tóm tắt ngắn gọn, súc tích về nội dung bài viết..."
                        showCount
                        maxLength={500}
                        style={{ borderRadius: "8px" }}
                      />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        Tóm tắt giúp độc giả nhanh chóng hiểu nội dung chính
                      </Text>
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            )}

            {currentStep === 1 && (
              <div>
                <Title level={4} className="mb-3">
                  <FileTextOutlined /> Nội dung bài viết
                </Title>
                <Divider style={{ margin: "12px 0 24px 0" }} />

                {blocks.length === 0 && (
                  <Card
                    style={{
                      background: "#f0f5ff",
                      borderRadius: "8px",
                      border: "2px dashed #1890ff",
                      textAlign: "center",
                      padding: "40px 20px",
                    }}
                  >
                    <FileTextOutlined
                      style={{ fontSize: 48, color: "#1890ff", marginBottom: 16 }}
                    />
                    <Paragraph style={{ fontSize: 16, marginBottom: 8 }}>
                      Chưa có nội dung nào
                    </Paragraph>
                    <Text type="secondary">
                      Nhấn nút "Thêm block" bên dưới để bắt đầu viết bài
                    </Text>
                  </Card>
                )}

                {blocks.map((block, index) => (
                  <Card
                    key={index}
                    size="small"
                    className="mb-3 shadow-sm"
                    style={{
                      borderRadius: "8px",
                      border: "1px solid #e8e8e8",
                    }}
                    title={
                      <Space>
                        {block.type === "paragraph" ? (
                          <FileTextOutlined style={{ color: "#1890ff" }} />
                        ) : (
                          <PictureOutlined style={{ color: "#52c41a" }} />
                        )}
                        <span style={{ fontWeight: 500 }}>
                          {block.type === "paragraph" ? "Đoạn văn" : "Hình ảnh"} #{index + 1}
                        </span>
                      </Space>
                    }
                    extra={
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleRemoveBlock(index)}
                      >
                        Xóa
                      </Button>
                    }
                  >
                    {block.type === "paragraph" && (
                      <div style={{ minHeight: 200 }}>
                        <ReactQuill
                          theme="snow"
                          value={block.text}
                          onChange={(value) => handleTextChange(index, value)}
                          modules={modules}
                          formats={formats}
                          placeholder="Bắt đầu viết nội dung..."
                          style={{ borderRadius: "8px" }}
                        />
                      </div>
                    )}

                    {block.type === "image" && (
                      <div>
                        <Upload
                          accept="image/*"
                          beforeUpload={() => false}
                          maxCount={1}
                          onChange={(info) => handleImageChange(index, info.file)}
                          listType="picture-card"
                        >
                          {!block.image && (
                            <div>
                              <PlusOutlined />
                              <div style={{ marginTop: 8 }}>Chọn ảnh</div>
                            </div>
                          )}
                        </Upload>

                        {block.image && (
                          <div style={{ marginTop: 12 }}>
                            <img
                              src={URL.createObjectURL(block.image)}
                              alt="block preview"
                              className="rounded shadow"
                              style={{
                                maxHeight: 300,
                                width: "100%",
                                objectFit: "contain",
                                borderRadius: "8px",
                              }}
                            />
                          </div>
                        )}

                        <Input
                          className="mt-3"
                          placeholder="Nhập chú thích cho ảnh..."
                          value={block.caption}
                          onChange={(e) => handleCaptionChange(index, e.target.value)}
                          prefix={<EditOutlined />}
                        />
                        <Input
                          className="mt-2"
                          placeholder="Nguồn ảnh (nếu có)..."
                          value={block.credits}
                          onChange={(e) => handleCreditsChange(index, e.target.value)}
                          prefix={<FileTextOutlined />}
                        />
                      </div>
                    )}
                  </Card>
                ))}

                <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
                  <Button
                    type="dashed"
                    icon={<PlusOutlined />}
                    size="large"
                    block
                    style={{
                      height: 60,
                      fontSize: 16,
                      borderRadius: "8px",
                      borderWidth: 2,
                    }}
                  >
                    Thêm block nội dung
                  </Button>
                </Dropdown>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <Title level={4} className="mb-3">
                  <EyeOutlined /> Xem trước bài viết
                </Title>
                <Divider style={{ margin: "12px 0 24px 0" }} />

                <Card
                  style={{
                    background: "#fafafa",
                    borderRadius: "8px",
                  }}
                >
                  <Title level={2} style={{ marginBottom: 16 }}>
                    {title || "Chưa có tiêu đề"}
                  </Title>

                  <Space size="large" style={{ marginBottom: 16 }}>
                    <Text type="secondary">
                      Danh mục: {categories.find(c => String(c.id) === mainCategory)?.name || "Chưa chọn"}
                    </Text>
                    <Text type="secondary">
                      Số block: {blocks.length}
                    </Text>
                  </Space>

                  <Divider />

                  {mainImage && (
                    <div style={{ marginBottom: 24 }}>
                      <img
                        src={URL.createObjectURL(mainImage)}
                        alt="preview"
                        style={{
                          width: "100%",
                          maxHeight: 400,
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                    </div>
                  )}

                  <Paragraph
                    style={{
                      fontSize: 16,
                      fontStyle: "italic",
                      background: "#f0f5ff",
                      padding: "16px",
                      borderRadius: "8px",
                      borderLeft: "4px solid #1890ff",
                      marginBottom: 24,
                    }}
                  >
                    {summary || "Chưa có tóm tắt"}
                  </Paragraph>

                  {blocks.map((block, index) => (
                    <div key={index} style={{ marginBottom: 24 }}>
                      {block.type === "paragraph" && (
                        <div
                          dangerouslySetInnerHTML={{ __html: block.text }}
                          style={{ fontSize: 15, lineHeight: 1.8 }}
                        />
                      )}
                      {block.type === "image" && block.image && (
                        <div style={{ textAlign: "center" }}>
                          <img
                            src={URL.createObjectURL(block.image)}
                            alt={`content-${index}`}
                            style={{
                              maxWidth: "100%",
                              borderRadius: "8px",
                              marginBottom: 8,
                            }}
                          />
                          {block.caption && (
                            <Text type="secondary" style={{ display: "block" }}>
                              {block.caption}
                            </Text>
                          )}
                          {block.credits && (
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              Nguồn: {block.credits}
                            </Text>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </Card>
              </div>
            )}

            <Divider />

            <Form.Item>
              <Space size="middle" style={{ width: "100%", justifyContent: "space-between" }}>
                <div>
                  {currentStep > 0 && (
                    <Button size="large" onClick={handlePrev} style={{ minWidth: 120 }}>
                      ← Quay lại
                    </Button>
                  )}
                </div>

                <div>
                  {currentStep < 2 ? (
                    <Button
                      type="primary"
                      size="large"
                      onClick={handleNext}
                      style={{
                        minWidth: 150,
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        border: "none",
                      }}
                    >
                      Tiếp theo →
                    </Button>
                  ) : (
                    <Space>
                      <Button size="large" onClick={resetFormData} style={{ minWidth: 120 }}>
                        Hủy bỏ
                      </Button>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={updating}
                        size="large"
                        icon={<SendOutlined />}
                        style={{
                          minWidth: 200,
                          background: "linear-gradient(135deg, #52c41a 0%, #73d13d 100%)",
                          border: "none",
                        }}
                      >
                        {updating ? "Đang gửi..." : "Gửi bài viết"}
                      </Button>
                    </Space>
                  )}
                </div>
              </Space>
            </Form.Item>
          </Form>
        </Card>

        <Card
          className="mt-4 shadow-sm"
          style={{
            borderRadius: "12px",
            background: "#fffbe6",
            borderColor: "#ffe58f",
          }}
        >
          <Title level={5} style={{ color: "#faad14" }}>
            💡 Mẹo viết bài hay
          </Title>
          <ul style={{ marginBottom: 0, paddingLeft: 20 }}>
            <li>Tiêu đề nên ngắn gọn, súc tích và thu hút</li>
            <li>Sử dụng ảnh chất lượng cao, có bản quyền rõ ràng</li>
            <li>Chia nhỏ nội dung thành các đoạn ngắn dễ đọc</li>
            <li>Kiểm tra kỹ chính tả và ngữ pháp trước khi gửi</li>
          </ul>
        </Card>

        <Modal
          title={
            <Space>
              <CheckOutlined style={{ color: spellingErrors.length === 0 ? '#52c41a' : '#faad14' }} />
              <span>Kết quả kiểm tra chính tả</span>
            </Space>
          }
          open={showSpellingModal}
          onCancel={() => setShowSpellingModal(false)}
          footer={[
            <Button key="close" type="primary" onClick={() => setShowSpellingModal(false)}>
              Đóng
            </Button>,
          ]}
          width={700}
        >
          {spellingErrors.length === 0 ? (
            <Card
              style={{
                textAlign: 'center',
                background: '#f6ffed',
                border: '1px solid #b7eb8f',
              }}
            >
              <CheckCircleOutlined
                style={{ fontSize: 48, color: '#52c41a', marginBottom: 16 }}
              />
              <Title level={4} style={{ color: '#52c41a' }}>
                Tuyệt vời! Không có lỗi chính tả
              </Title>
              <Text type="secondary">
                Bài viết của bạn không có vấn đề về chính tả
              </Text>
            </Card>
          ) : (
            <div>
              <Alert
                message={`Phát hiện ${spellingErrors.length} lỗi tiềm năng`}
                type="warning"
                showIcon
                style={{ marginBottom: 16 }}
              />
              
              <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                {spellingErrors.map((error, index) => (
                  <Card
                    key={index}
                    size="small"
                    style={{
                      marginBottom: 12,
                      borderLeft: '3px solid #faad14',
                    }}
                  >
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <div>
                        <Tag color="blue">{error.location}</Tag>
                        <Text strong>{error.message}</Text>
                      </div>
                      
                      <div
                        style={{
                          background: '#fafafa',
                          padding: '8px 12px',
                          borderRadius: '4px',
                          fontFamily: 'monospace',
                        }}
                      >
                        {error.context.substring(0, error.offset)}
                        <span
                          style={{
                            background: '#fff1b8',
                            padding: '2px 4px',
                            borderRadius: '2px',
                            color: '#d46b08',
                            fontWeight: 'bold',
                          }}
                        >
                          {error.context.substring(
                            error.offset,
                            error.offset + error.length
                          )}
                        </span>
                        {error.context.substring(error.offset + error.length)}
                      </div>

                      {error.suggestions.length > 0 && (
                        <div>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            Gợi ý:{' '}
                          </Text>
                          <Space wrap>
                            {error.suggestions.map((suggestion, idx) => (
                              <Tag key={idx} color="green">
                                {suggestion}
                              </Tag>
                            ))}
                          </Space>
                        </div>
                      )}
                    </Space>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </Modal>
      </div>
    </>
  );
};

export default Submit;