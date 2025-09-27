import axiosInstance from "../../config/axiosInstance";
import handleErrorResponse from "../../utils/errors/ErrorHandler";

const API_URL = "/admin/articles";

// Lấy tất cả articles
const getArticles = async () => {
  try {
    const response = await axiosInstance.get(API_URL);
    return response.data;
  } catch (error) {
    handleErrorResponse(error);
    throw error;
  }
};

// Lấy article theo ID
const getArticleById = async (id) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    handleErrorResponse(error);
    throw error;
  }
};

// Lấy article theo Slug
const getArticleBySlug = async (slug) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/slug/${slug}`);
    return response.data;
  } catch (error) {
    handleErrorResponse(error);
    throw error;
  }
};

// Lấy articles phân trang + filter
const getPagedArticles = async (
  pageIndex = 1,
  pageSize = 10,
  search,
  status,
  category,
  tag
) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/paged`, {
      params: { pageIndex, pageSize, search, status, category, tag },
    });
    return response.data;
  } catch (error) {
    handleErrorResponse(error);
    throw error;
  }
};

// Tạo article
const createArticle = async (articleData) => {
  try {
    const response = await axiosInstance.post(API_URL, articleData);
    return response.data;
  } catch (error) {
    handleErrorResponse(error);
    throw error;
  }
};

// Cập nhật article
const updateArticle = async (id, articleData) => {
  try {
    const response = await axiosInstance.put(`${API_URL}/${id}`, articleData);
    return response.data;
  } catch (error) {
    handleErrorResponse(error);
    throw error;
  }
};

// Xoá article
const deleteArticle = async (id) => {
  try {
    const response = await axiosInstance.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    handleErrorResponse(error);
    throw error;
  }
};

// Lấy articles theo status
const getArticlesByStatus = async (status) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/status/${status}`);
    return response.data;
  } catch (error) {
    handleErrorResponse(error);
    throw error;
  }
};

// Lấy articles theo categoryId
const getArticlesByCategory = async (categoryId) => {
  try {
    const response = await axiosInstance.get(
      `${API_URL}/category/${categoryId}`
    );
    return response.data;
  } catch (error) {
    handleErrorResponse(error);
    throw error;
  }
};

// Lấy articles theo tagId
const getArticlesByTag = async (tagId) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/tag/${tagId}`);
    return response.data;
  } catch (error) {
    handleErrorResponse(error);
    throw error;
  }
};

// Tăng view count (có thể có userId query)
const incrementViewCount = async (id, userId) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/${id}/view`, null, {
      params: { userId },
    });
    return response.data;
  } catch (error) {
    handleErrorResponse(error);
    throw error;
  }
};

// Tăng share count
const incrementShareCount = async (id) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/${id}/share`);
    return response.data;
  } catch (error) {
    handleErrorResponse(error);
    throw error;
  }
};

// Tăng comment count
const incrementCommentCount = async (id) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/${id}/comment`);
    return response.data;
  } catch (error) {
    handleErrorResponse(error);
    throw error;
  }
};

// Lấy danh sách bài user đã xem (histories)
const getArticlesViewedByUser = async (userId) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/${userId}/histories`);
    return response.data;
  } catch (error) {
    handleErrorResponse(error);
    throw error;
  }
};

const getArticlesByDate = async (date) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/${date}/date`);
    return response.data;
  } catch (error) {
    handleErrorResponse(error);
    throw error;
  }
};

const getPendingArticles = async () => {
  try {
    const response = await axiosInstance.get(`${API_URL}/pending`);
    return response.data;
  } catch (error) {
    handleErrorResponse(error);
    throw error;
  }
};

// ✅ Duyệt article
const approveArticle = async (id, options) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/approve/${id}`, {
      publishNow: options.publishNow,
      publishDate: options.publishNow ? null : options.publishDate,
    });
    return response.data;
  } catch (error) {
    handleErrorResponse(error);
    throw error;
  }
};

// ✅ Từ chối article (có thể kèm lý do)
const rejectArticle = async (id, reason = null) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/reject/${id}`, {
      reason,
    });
    return response.data;
  } catch (error) {
    handleErrorResponse(error);
    throw error;
  }
};

// Export service
const ArticleService = {
  getArticles,
  getArticleById,
  getArticleBySlug,
  getPagedArticles,
  createArticle,
  updateArticle,
  deleteArticle,
  getArticlesByStatus,
  getArticlesByCategory,
  getArticlesByTag,
  incrementViewCount,
  incrementShareCount,
  incrementCommentCount,
  getArticlesViewedByUser,
  getArticlesByDate,
  getPendingArticles,
  approveArticle,
  rejectArticle,
};

export default ArticleService;
