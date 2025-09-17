import axiosInstance from "../../config/axiosInstance"; // Import axiosInstance
import handleErrorResponse from "../../utils/errors/ErrorHandler";

// Cấu hình URL API chung
const API_URL = "/admin/categories";

// Lấy tất cả category
const getCategories = async () => {
  try {
    const response = await axiosInstance.get(API_URL);
    return response.data;
  } catch (error) {
    handleErrorResponse(error);
    throw error;
  }
};

// Lấy category theo ID
const getCategoryById = async (id) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    handleErrorResponse(error);
    throw error;
  }
};

// Lấy category theo slug
const getCategoryBySlug = async (slug) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/slug/${slug}`);
    return response.data;
  } catch (error) {
    handleErrorResponse(error);
    console.error(`Lỗi khi lấy category với slug: ${slug}`, error);
    throw error;
  }
};

// Lấy danh sách bài báo theo slug của category
const getArticlesByCategorySlug = async (slug) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/${slug}/articles`);
    return response.data;
  } catch (error) {
    handleErrorResponse(error);
    console.error(`Lỗi khi lấy bài báo của category với slug: ${slug}`, error);
    throw error;
  }
};

// Tạo category
const createCategory = async (categoryData) => {
  try {
    const response = await axiosInstance.post(API_URL, categoryData);
    return response.data;
  } catch (error) {
    handleErrorResponse(error);
    console.error("Lỗi khi thêm category:", error);
    throw error;
  }
};

// Cập nhật category
const updateCategory = async (id, categoryData) => {
  try {
    const response = await axiosInstance.put(`${API_URL}/${id}`, categoryData);
    return response.data;
  } catch (error) {
    handleErrorResponse(error);
    console.error(`Lỗi khi cập nhật category với ID: ${id}`, error);
    throw error;
  }
};

// Xoá category
const deleteCategory = async (id) => {
  try {
    const response = await axiosInstance.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    handleErrorResponse(error);
    console.error(`Lỗi khi xoá category với ID: ${id}`, error);
    throw error;
  }
};

// Export service
const CategoryService = {
  getCategories,
  getCategoryById,
  getCategoryBySlug,
  getArticlesByCategorySlug,
  createCategory,
  updateCategory,
  deleteCategory,
};

export default CategoryService;
