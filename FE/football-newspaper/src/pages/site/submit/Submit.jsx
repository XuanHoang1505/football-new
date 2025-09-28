import { Helmet } from "react-helmet-async";
import styles from "./Submit.module.scss";
import DynamicBreadcrumb from "../../../components/site/breadcrumb/Breadcrumb";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import { Button } from "antd";
import CategoryService from "../../../services/admin/CategoryService";
import ArticleService from "../../../services/admin/ArticleService";
import { toast } from "react-toastify";
import "react-quill/dist/quill.snow.css";
import Select from "react-select";


// --- Toolbar mặc định với font + size ---
const modules = {
  toolbar: [
    [{ font: [] }, { size: [] }], // font + size dropdown
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"]
  ]
};

const formats = [
  "font", "size",
  "bold", "italic", "underline", "strike",
  "color", "background",
  "list", "bullet",
  "link"
];

const Submit = () => {
  const [title, setTitle] = useState("");
  const [mainImage, setMainImage] = useState(null);
  const [summary, setSummary] = useState("");
  const [blocks, setBlocks] = useState([{ text: "", image: null, caption: "", source: "" }]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [updating, setUpdating] = useState(false);
  const handleMainImageChange = (e) => setMainImage(e.target.files[0]);
  const [mainCategory, setMainCategory] = useState("");   // danh mục chính
  const [subCategories, setSubCategories] = useState([]); // danh mục phụ

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

  const handleSourceChange = (index, value) => {
    const newBlocks = [...blocks];
    newBlocks[index].source = value;
    setBlocks(newBlocks);
  };

  const handleAddBlock = () => setBlocks([...blocks, { text: "", image: null, caption: "", source: "" }]);
  const handleRemoveBlock = (index) => {
    const newBlocks = [...blocks];
    newBlocks.splice(index, 1);
    setBlocks(newBlocks);
  };

  // Giả sử bạn có thông tin user hiện tại
  const user = JSON.parse(localStorage.getItem("userDetail")); // Lấy user từ localStorage
  
 const handleFormSubmit = async (e) => {
  e.preventDefault();

  // Kiểm tra dữ liệu bắt buộc
  if (!title.trim()) {
    toast.error("Tiêu đề không được để trống!");
    return;
  }
  if (!summary.trim()) {
    toast.error("Tóm tắt không được để trống!");
    return;
  }
  if (!user?.userId) {
    toast.error("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại!");
    return;
  }

  try {
    setUpdating(true);

     // Tạo slug từ title
    const generateSlug = (str) => {
      return str
        .toLowerCase()
        .trim()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, ""); // loại bỏ ký tự đặc biệt
    };

    // Chuẩn bị articleData
    const articleData = {
    title: title.trim(),
    summary: summary.trim(),
    slug: generateSlug(title),
    authorId: user.userId,
    mainCategoryId: mainCategory,
    subCategoryIds: subCategories,
    contents: blocks.map(b => ({
      text: b.text,
      image: null,   // sẽ gán URL back-end
      caption: b.caption,
      source: b.source
    })),
  };

    // Lấy tất cả ảnh block (File) để gửi riêng
    const contentImages = blocks
      .map(b => b.image)
      .filter(Boolean);

    // Gọi API
    await ArticleService.createArticle(articleData, mainImage, contentImages);

    console.log("Submitted articleData:", articleData);
    
    toast.success("Bài báo đã được gửi tới Admin, hãy chờ phê duyệt!");

    // Reset form
    setTitle("");
    setSummary("");
    setMainCategory("");
    setSubCategories([]);
    setMainImage(null);
    setBlocks([{ text: "", image: null, caption: "", source: "" }]);
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

  useEffect(() => {
    fetchCategories();
  }, []);


  return (
    <>
      <Helmet>
        <title>Gửi bài</title>
      </Helmet>
      <div className={styles.container}>
        <DynamicBreadcrumb />
        <div className="container mt-3">
          <div className="row">
            <div className="col-12 col-lg-9">
              <div className="p-3 rounded mb-3" style={{ backgroundColor: "#DCE7FF" }}>
                <h2 className="mb-0">GỬI BÀI CHO TÒA SOẠN</h2>
                <small className="text-muted">Chia sẻ tin tức và bài viết bóng đá của bạn</small>
              </div>

              <form onSubmit={handleFormSubmit} className="p-3 border rounded shadow-sm bg-white">
                {/* Tiêu đề */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Tiêu đề bài viết</label>
                  <input
                    type="text"
                    className="form-control"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                {/* Danh mục */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Danh mục chính</label>
                  <Select
                    options={categories.map((c) => ({ value: String(c.id), label: c.name }))}
                    value={
                      categories
                        .filter((c) => mainCategory === String(c.id))
                        .map((c) => ({ value: String(c.id), label: c.name }))[0] || null
                    }
                    onChange={(selected) => setMainCategory(selected ? String(selected.value) : "")}
                    placeholder="-- Chọn danh mục chính --"
                    isClearable
                    noOptionsMessage={() => "Không có danh mục nào"}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Danh mục phụ</label>
                  <Select
                    isMulti
                    options={categories.map((c) => ({ value: String(c.id), label: c.name }))}
                    value={categories
                      .filter((c) => subCategories.includes(String(c.id)))
                      .map((c) => ({ value: String(c.id), label: c.name }))}
                    onChange={(selected) =>
                      setSubCategories(selected.map((s) => String(s.value)))
                    }
                    placeholder="-- Chọn danh mục phụ --"
                    noOptionsMessage={() => "Không có danh mục nào"}
                  />
                </div>


                {/* Ảnh chính */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Ảnh chính (ảnh đại diện)</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={handleMainImageChange}
                  />
                  {mainImage && (
                    <div className="mt-2">
                      <img
                        src={URL.createObjectURL(mainImage)}
                        alt="main preview"
                        className="img-fluid rounded shadow-sm"
                        style={{ maxHeight: "200px" }}
                      />
                    </div>
                  )}
                </div>

                {/* Summary */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Tóm tắt bài viết</label>
                  <input
                    type="text"
                    className="form-control"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    required
                  />
                </div>

                {/* Blocks */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Nội dung bài viết</label>

                  {blocks.map((block, index) => (
                    <div key={index} className="border p-3 rounded mb-3 bg-light">
                      <h6>Đoạn {index + 1}</h6>

                      <ReactQuill
                        theme="snow"
                        value={block.text}
                        onChange={(value) => handleTextChange(index, value)}
                        modules={modules}
                        formats={formats}
                        style={{ minHeight: "200px" }}
                      />

                      <input
                        type="file"
                        className="form-control mb-2"
                        accept="image/*"
                        onChange={(e) => handleImageChange(index, e.target.files[0])}
                      />
                      {block.image && (
                        <img
                          src={URL.createObjectURL(block.image)}
                          alt="block preview"
                          className="img-fluid rounded shadow-sm mb-2"
                          style={{ maxHeight: "200px" }}
                        />
                      )}

                      <div className="row">
                        <div className="col-md-8">
                          <label className="form-label">Chú thích ảnh</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Chú thích ảnh (nếu có)"
                            value={block.caption}
                            onChange={(e) => handleCaptionChange(index, e.target.value)}
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">Nguồn</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Nguồn (nếu có)"
                            value={block.source}
                            onChange={(e) => handleSourceChange(index, e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="text-end mt-3">
                        <Button
                          type="primary"
                          danger
                          size="middle"
                          onClick={() => handleRemoveBlock(index)}
                        >
                          Xóa
                        </Button>
                      </div>
                    </div>
                  ))}


                  <Button type="dashed" onClick={handleAddBlock}>
                    + Thêm đoạn mới
                  </Button>
                </div>

                <Button
                  type="primary"
                  htmlType="submit"
                  loading={updating} // khi updating=true thì hiển thị spinner
                  className="mt-3 mb-5"
                  size="large"
                >
                  {updating ? "Đang xử lý..." : "Gửi bài"}
                </Button>


              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Submit;
