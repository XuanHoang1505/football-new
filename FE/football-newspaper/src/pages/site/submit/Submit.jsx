import { Helmet } from "react-helmet-async";
import styles from "./Submit.module.scss";
import DynamicBreadcrumb from "../../../components/site/breadcrumb/Breadcrumb";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

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

  const handleMainImageChange = (e) => setMainImage(e.target.files[0]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Title:", title);
    console.log("Main Image:", mainImage);
    console.log("Blocks:", blocks);
    alert("Bài viết đã được gửi!");
  };

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

              <form onSubmit={handleSubmit} className="p-3 border rounded shadow-sm bg-white">
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
                        <button
                          type="button"
                          className="btn btn-sm btn-danger px-4 py-1.5"
                          onClick={() => handleRemoveBlock(index)}
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={handleAddBlock}
                  >
                    + Thêm đoạn mới
                  </button>
                </div>

                <button type="submit" className="btn btn-success px-4">
                  Gửi bài
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Submit;
