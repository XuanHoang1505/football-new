import axiosInstance from "../../config/axiosInstance";
import handleErrorResponse from "../../utils/errors/ErrorHandler";

// URL chung cho Comment API
const API_URL = "/comments"; // vì controller [Route("api/comments")]

const getAllComments = async () => {
  try {
    const response = await axiosInstance.get(API_URL);
    return response.data;
  } catch (error) {
    handleErrorResponse(error);
    throw error;
  }
};

//Lấy danh sách bình luận cha
const getRootComments = async () => {
  try {
    const response = await axiosInstance.get(`${API_URL}/parent`);
    return response.data;
  } catch (error) {
    handleErrorResponse(error);
    throw error;
  }
};

/**
 * Lấy danh sách comment theo bài viết
 */
const getCommentsByArticleId = async (articleId) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/article/${articleId}`);
    return response.data;
  } catch (error) {
    handleErrorResponse(error);
    throw error;
  }
};

/**
 * Tạo comment mới
 */
const createComment = async (commentData) => {
  try {
    const response = await axiosInstance.post(API_URL, commentData);
    return response.data;
  } catch (error) {
    handleErrorResponse(error);
    throw error;
  }
};

/**
 * Cập nhật comment
 */
const updateComment = async (id, updateData) => {
  try {
    const response = await axiosInstance.put(`${API_URL}/${id}`, updateData);
    return response.data;
  } catch (error) {
    handleErrorResponse(error);
    throw error;
  }
};

/**
 * Xóa comment
 */
const deleteComment = async (id) => {
  try {
    const response = await axiosInstance.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    handleErrorResponse(error);
    throw error;
  }
};

/**
 * Like / Unlike comment
 */
const toggleLikeComment = async (id) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/${id}/like`);
    return response.data; // { liked: true/false }
  } catch (error) {
    handleErrorResponse(error);
    throw error;
  }
};


export default {
  getAllComments,
  getRootComments,
  getCommentsByArticleId,
  createComment,
  updateComment,
  deleteComment,
  toggleLikeComment,
};
