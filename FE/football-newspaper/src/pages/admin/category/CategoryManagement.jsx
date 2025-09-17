import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
import { Spinner, Form } from "react-bootstrap";
import { TableManagement } from "../../../components/admin/index";
import CategoryService from "../../../services/admin/CategoryService";
import Page500 from "../../../pages/site/page500/Page500";

const CategoryManagement = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [formData, setFormData] = useState({});
  const [errorFields, setErrorFields] = useState({});
  const [statusFunction, setStatusFunction] = useState({
    isAdd: false,
    isEditing: false,
    isViewDetail: false,
  });
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

  // Cột hiển thị theo model
  const categoryColumns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Tên danh mục" },
    { key: "slug", label: "Slug" },
    { key: "description", label: "Mô tả" },
    { key: "parentName", label: "Danh mục cha" },
  ];

  const keysToRemove = ["description"];
  const defaultColumns = categoryColumns.filter(
    (column) => !keysToRemove.includes(column.key)
  );
  const fetchCategoryData = async () => {
    setLoadingPage(true);
    try {
      const data = await CategoryService.getCategories();
      setCategoryData(data);
    } catch (err) {
      setErrorServer(err.message);
    } finally {
      setLoadingPage(false);
    }
  };

  useEffect(() => {
    fetchCategoryData();
  }, []);

  const validateField = (key, value) => {
    let error = "";
    switch (key) {
      case "name":
        if (!value || value.trim() === "") {
          error = "Tên không được để trống.";
        }
        break;
      case "slug":
        if (!value || value.trim() === "") {
          error = "Slug không được để trống.";
        }
        break;
      default:
        break;
    }
    setErrorFields((prev) => ({ ...prev, [key]: error }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name || formData.name.trim() === "") {
      newErrors.name = "Tên danh mục không được để trống.";
    }
    if (!formData.slug || formData.slug.trim() === "") {
      newErrors.slug = "Slug không được để trống.";
    }
    setErrorFields(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
    validateField(key, value);
  };

  const updateStatus = (newStatus) => {
    setStatusFunction((prev) => ({ ...prev, ...newStatus }));
  };

  const handleResetStatus = () => {
    updateStatus({ isAdd: true, isEditing: false, isViewDetail: false });
  };

  const handleReset = () => {
    setFormData({
      name: "",
      description: "",
      slug: "",
      parentId: null,
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
        const updatedCategory = await CategoryService.updateCategory(
          formData.id,
          formData
        );
        console.log("updatedCategory", updatedCategory);
        
        const updatedData = categoryData.map((c) =>
          c.id === updatedCategory.id ? updatedCategory : c
        );
        setCategoryData(updatedData);
        toast.success("Cập nhật thành công!");
      } else if (statusFunction.isAdd) {
        const newCategory = await CategoryService.createCategory(formData);
        setCategoryData([...categoryData, newCategory]);
        toast.success("Thêm mới thành công!");
      }
      handleReset();
      return true;
    } catch (error) {
      toast.error("Có lỗi xảy ra.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (deleteId) => {
    if (!deleteId) return;
    setIsLoading(true);
    try {
      await CategoryService.deleteCategory(deleteId);
      setCategoryData((prev) => prev.filter((c) => c.id !== deleteId));
      toast.success("Xóa thành công!");
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi xóa.");
    } finally {
      setIsLoading(false);
    }
  };

  const modalContent = (
    <>
      <div className="row">
        <div className="col-md-6 mb-3">
          <Form.Group controlId="formName">
            <Form.Label>
              Tên danh mục <span className="text-danger">(*)</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name || ""}
              maxLength={100}
              onChange={(e) => handleInputChange("name", e.target.value)}
              isInvalid={!!errorFields.name}
              placeholder="Nhập tên danh mục"
              required
            />
            <Form.Control.Feedback type="invalid">
              {errorFields.name}
            </Form.Control.Feedback>
          </Form.Group>
        </div>
        <div className="col-md-6 mb-3">
          <Form.Group controlId="formSlug">
            <Form.Label>
              Slug <span className="text-danger">(*)</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="slug"
              value={formData.slug || ""}
              maxLength={100}
              onChange={(e) => handleInputChange("slug", e.target.value)}
              isInvalid={!!errorFields.slug}
              placeholder="Ví dụ: bong-da-viet-nam"
              required
            />
            <Form.Control.Feedback type="invalid">
              {errorFields.slug}
            </Form.Control.Feedback>
          </Form.Group>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <Form.Group controlId="formParent">
            <Form.Label>Danh mục cha</Form.Label>
            <Form.Select
              value={formData.parentId || ""}
              onChange={(e) =>
                handleInputChange(
                  "parentId",
                  e.target.value ? parseInt(e.target.value) : null
                )
              }
            >
              <option value="">-- Không có --</option>
              {categoryData
                .filter((c) => c.id !== formData.id) // tránh chọn chính nó
                .map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
            </Form.Select>
          </Form.Group>
        </div>
        <div className="col-md-6 mb-3">
          <Form.Group controlId="formDesc">
            <Form.Label>Mô tả</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Nhập mô tả ngắn"
            />
          </Form.Group>
        </div>
      </div>
    </>
  );

  return (
    <>
      <Helmet>
        <title>Quản lý danh mục - Star Movie</title>
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
            columns={categoryColumns}
            data={categoryData}
            title="Quản lý danh mục"
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

export default CategoryManagement;
