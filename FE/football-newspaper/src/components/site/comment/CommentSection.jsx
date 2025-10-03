import { useEffect, useState, useCallback, useMemo, useContext } from "react";
import { useDispatch } from "react-redux";

import { Tooltip, Button } from "antd";
import { message, Modal } from "antd";
import { Input } from "antd";
const { TextArea } = Input;
import {
  DeleteOutlined,
  ExclamationCircleOutlined,
  EditOutlined,
} from "@ant-design/icons";

import { UserContext } from "../../../contexts/UserContext";
import { openModal } from "../../../redux/slices/authModalSlice";

import CommentService from "../../../services/site/CommentService";
import styles from "./CommentSection.module.scss";
import { formatDateTimeToDMY } from "../../../utils/formatDate";

function CommentSection({ articleId }) {
  const { user } = useContext(UserContext);

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [actionLoading, setActionLoading] = useState({});
  const [error, setError] = useState(null);
  const [editingComment, setEditingComment] = useState(null);

  const dispatch = useDispatch();

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await CommentService.getCommentsByArticleId(articleId);
      setComments(data || []);
    } catch (error) {
      console.error("Lỗi khi fetch comments", error);
      setError("Không thể tải bình luận. Vui lòng thử lại.");
      message.error("Không thể tải bình luận");
    } finally {
      setLoading(false);
    }
  }, [articleId]);

  useEffect(() => {
    if (articleId) {
      fetchComments();
    }
  }, [articleId, fetchComments]);

  // Submit new comment
  const handleSubmitComment = useCallback(async () => {
    if (!newComment.trim()) {
      message.warning("Vui lòng nhập nội dung bình luận");
      return;
    }

    if (!user) {
      message.warning("Vui lòng đăng nhập để bình luận");
      return;
    }

    try {
      setActionLoading((prev) => ({ ...prev, submitComment: true }));

      const commentData = {
        content: newComment.trim(),
        articleId: articleId,
        parentId: null,
      };

      const comment = await CommentService.createComment(commentData);

      // Optimistic update
      setComments((prev) => [comment, ...prev]);
      setNewComment("");
      message.success("Bình luận đã được gửi");
    } catch (error) {
      console.error("Lỗi khi gửi bình luận", error);
      message.error("Không thể gửi bình luận. Vui lòng thử lại.");
    } finally {
      setActionLoading((prev) => ({ ...prev, submitComment: false }));
    }
  }, [newComment, articleId, user]);

  const handleSubmitReply = useCallback(
    async (commentId) => {
      if (!replyContent.trim()) {
        message.warning("Vui lòng nhập nội dung trả lời");
        return;
      }

      if (!user) {
        message.warning("Vui lòng đăng nhập để trả lời");
        return;
      }

      try {
        setActionLoading((prev) => ({ ...prev, [`reply-${commentId}`]: true }));

        const reply = {
          articleId: articleId,
          content: replyContent.trim(),
          parentId: commentId,
        };

        const data = await CommentService.createComment(reply);

        setComments((prev) =>
          prev.map((comment) =>
            comment.id === commentId
              ? {
                  ...comment,
                  replies: [...(comment.replies || []), data],
                }
              : comment
          )
        );

        setReplyContent("");
        setReplyTo(null);
        message.success("Trả lời đã được gửi");
      } catch (error) {
        console.error("Lỗi khi trả lời bình luận", error);
        message.error("Không thể gửi trả lời. Vui lòng thử lại.");
      } finally {
        setActionLoading((prev) => ({
          ...prev,
          [`reply-${commentId}`]: false,
        }));
      }
    },
    [replyContent, articleId, user]
  );

  const handleLike = useCallback(
    async (commentId, isReply = false, parentId = null) => {
      if (!user) {
        message.warning("Vui lòng đăng nhập để thích bình luận");
        return;
      }

      try {
        setActionLoading((prev) => ({ ...prev, [`like-${commentId}`]: true }));

        const { liked } = await CommentService.toggleLikeComment(commentId);

        // Update state
        setComments((prev) =>
          prev.map((comment) => {
            if (isReply && comment.id === parentId) {
              // Update reply like count
              return {
                ...comment,
                replies: (comment.replies || []).map((reply) =>
                  reply.id === commentId
                    ? {
                        ...reply,
                        likeCount: liked
                          ? reply.likeCount + 1
                          : reply.likeCount - 1,
                      }
                    : reply
                ),
              };
            } else if (!isReply && comment.id === commentId) {
              // Update comment like count
              return {
                ...comment,
                likeCount: liked
                  ? comment.likeCount + 1
                  : comment.likeCount - 1,
                isLikedByCurrentUser: liked,
              };
            }
            return comment;
          })
        );
      } catch (error) {
        console.error("Lỗi khi like bình luận", error);
        message.error("Không thể thực hiện thao tác. Vui lòng thử lại.");
      } finally {
        setActionLoading((prev) => ({ ...prev, [`like-${commentId}`]: false }));
      }
    },
    [user]
  );

  const handleDeleteComment = useCallback(
    async (commentId, isReply = false, parentId = null) => {
      const comment = isReply
        ? comments
            .find((c) => c.id === parentId)
            ?.replies?.find((r) => r.id === commentId)
        : comments.find((c) => c.id === commentId);

      if (!comment) {
        message.error("Không tìm thấy bình luận");
        return;
      }

      // Đếm số lượng sẽ bị xóa
      const totalToDelete = isReply ? 1 : 1 + (comment.replies?.length || 0);

      const confirmMessage =
        totalToDelete > 1
          ? `Bạn có chắc muốn xóa bình luận này và ${comment.replies.length} câu trả lời?`
          : "Bạn có chắc muốn xóa bình luận này?";

      Modal.confirm({
        title: "Xác nhận xóa",
        icon: <ExclamationCircleOutlined />,
        content: confirmMessage,
        okText: "Xóa",
        okType: "danger",
        cancelText: "Hủy",
        onOk: async () => {
          await performDelete(commentId, isReply, parentId, totalToDelete);
        },
      });
    },
    [comments]
  );

  const performDelete = async (commentId, isReply, parentId, totalToDelete) => {
    try {
      setActionLoading((prev) => ({ ...prev, [`delete-${commentId}`]: true }));

      await CommentService.deleteComment(commentId);

      setComments((prev) => {
        if (isReply) {
          return prev.map((comment) =>
            comment.id === parentId
              ? {
                  ...comment,
                  replies: comment.replies.filter(
                    (reply) => reply.id !== commentId
                  ),
                }
              : comment
          );
        } else {
          return prev.filter((comment) => comment.id !== commentId);
        }
      });

      message.success(
        totalToDelete > 1
          ? `Đã xóa ${totalToDelete} bình luận`
          : "Đã xóa bình luận"
      );
    } catch (error) {
      console.error("Lỗi khi xóa bình luận", error);
      message.error("Không thể xóa bình luận. Vui lòng thử lại.");
    } finally {
      setActionLoading((prev) => ({
        ...prev,
        [`delete-${commentId}`]: false,
      }));
    }
  };

  const handleUpdateComment = useCallback(
    async (commentId, newContent, isReply, parentId = null) => {
      if (!newContent.trim()) {
        message.warning("Nội dung không được để trống");
        return;
      }

      const originalContent = isReply
        ? comments
            .find((c) => c.id === parentId)
            ?.replies?.find((r) => r.id === commentId)?.content
        : comments.find((c) => c.id === commentId)?.content;

      if (newContent.trim() === originalContent.trim()) {
        message.info("Nội dung không thay đổi");
        setEditingComment(null);
        return;
      }

      try {
        setActionLoading((prev) => ({ ...prev, [`edit-${commentId}`]: true }));
        const updateData = await CommentService.updateComment(commentId, {
          content: editingComment.content.trim(),
        });

        setComments((prev) => {
          if (isReply) {
            return prev.map((comment) =>
              comment.id === parentId
                ? {
                    ...comment,
                    replies: comment.replies.map((reply) =>
                      reply.id === commentId
                        ? {
                            ...reply,
                            content: updateData.content,
                            updateAt: updateData.updateDAt,
                            isEdited: updateData.isEdited,
                          }
                        : reply
                    ),
                  }
                : comment
            );
          } else {
            return prev.map((comment) =>
              comment.id === commentId
                ? {
                    ...comment,
                    content: updateData.content,
                    updateAt: updateData.updateAt,
                    isEdited: updateData.isEdited,
                  }
                : comment
            );
          }
        });
        message.success("Đã cập nhật bình luận thành công!!")
        setEditingComment(null);
      } catch (error) {
        console.error("Lỗi khi cập nhật bình luận", error);
        message.error("Không thể cập nhật bình luận. Vui lòng thử lại.");
      } finally {
        setActionLoading((prev) => ({ ...prev, [`edit-${commentId}`]: false }));
      }
    }
  );

  const handleCancelReply = useCallback(() => {
    setReplyTo(null);
    setReplyContent("");
  }, [comments]);

  const handleStartEdit = useCallback(
    (commentId, content, isReply, parentId = null) => {
      setEditingComment({
        id: commentId,
        content: content,
        isReply: isReply,
        parentId: parentId,
      });
    },
    []
  );

  const handleCancelEdit = useCallback(() => {
    setEditingComment(null);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 7) {
      return date.toLocaleDateString("vi-VN");
    } else if (days > 0) {
      return `${days} ngày trước`;
    } else if (hours > 0) {
      return `${hours} giờ trước`;
    } else if (minutes > 0) {
      return `${minutes} phút trước`;
    } else {
      return "Vừa xong";
    }
  };

  // Memoized comment count
  const commentCount = useMemo(() => {
    return comments.reduce((total, comment) => {
      return total + 1 + (comment.replies?.length || 0);
    }, 0);
  }, [comments]);


  if (loading) {
    return (
      <div className={styles.comment_section}>
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.comment_section}>
        <div className="alert alert-danger" role="alert">
          {error}
          <button className="btn btn-link" onClick={fetchComments}>
            Thử lại
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className={styles.comment_section}>
      <h3 className={styles.title}>Bình luận ({commentCount})</h3>

      {/* Comment Form */}
      <div className={styles.comment_form}>
        {!user ? (
          <div
            className="p-4 border d-flex align-items-center border-2 rounded"
            style={{ cursor: "pointer" }}
            onClick={() => {
              dispatch(openModal("showLoginModal"));
            }}
          >
            <i className="bi bi-info-circle me-2"></i>
            Vui lòng đăng nhập để bình luận
          </div>
        ) : (
          <div className={styles.form_wrapper}>
            <img
              src={
                user.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user.FullName || "User"
                )}&background=4285f4`
              }
              alt={user.FullName || "user"}
              className={styles.avatar}
              onError={(e) => {
                e.target.src =
                  "https://ui-avatars.com/api/?name=User&background=4285f4";
              }}
            />
            <div className={styles.input_wrapper}>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Viết bình luận của bạn..."
                className={styles.textarea}
                maxLength={5000}
                disabled={actionLoading.submitComment}
              />
              <div className="d-flex justify-content-between align-items-center mt-2">
                <small className="text-muted">{newComment.length}/5000</small>
                <button
                  onClick={handleSubmitComment}
                  className={styles.submit_btn}
                  disabled={!newComment.trim() || actionLoading.submitComment}
                >
                  {actionLoading.submitComment ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Đang gửi...
                    </>
                  ) : (
                    "Gửi bình luận"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Comments List */}
      <div className={styles.comments_list}>
        {comments.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <i className="bi bi-chat-left-text fs-1 d-block mb-3"></i>
            Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className={styles.comment_card}>
              <div className={styles.comment_wrapper}>
                <img
                  src={
                    comment.userAvatar ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      comment.userName
                    )}&background=random`
                  }
                  alt={comment.userName}
                  className={styles.comment_avatar}
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      comment.userName
                    )}&background=random`;
                  }}
                />
                <div className={styles.comment_content}>
                  <div className={styles.comment_header}>
                    <div>
                      <strong className={styles.author_name}>
                        {comment.userName}
                        {comment.isVerified && (
                          <i className="bi bi-patch-check-fill text-primary ms-1"></i>
                        )}
                      </strong>
                      <span className={styles.comment_date}>
                        {formatDate(comment.createdAt)}
                        {comment.isEdited && (
                          <span className="text-muted ms-1" style={{fontSize:"12px"}}>
                            {`(đã chỉnh sửa lúc ${formatDateTimeToDMY(
                              comment.updatedAt
                            )})`}
                          </span>
                        )}
                      </span>
                    </div>
                    <Tooltip
                      title={
                        user?.userId === comment.userId ? (
                          <div className="d-flex flex-column align-items-start">
                            <Button
                              type="text"
                              icon={<EditOutlined />}
                              onClick={() =>
                                handleStartEdit(
                                  comment.id,
                                  comment.content,
                                  false
                                )
                              }
                            >
                              Chỉnh sửa
                            </Button>
                            <Button
                              type="text"
                              icon={<DeleteOutlined />}
                              onClick={() =>
                                handleDeleteComment(comment.id, false)
                              }
                            >
                              Xóa bình luận
                            </Button>
                          </div>
                        ) : (
                          <Button
                            type="text"
                            icon={<ExclamationCircleOutlined />}
                          >
                            Báo cáo bình luận
                          </Button>
                        )
                      }
                      placement="bottomLeft"
                      color="rgba(255, 255, 255, 0.75)"
                      style={{
                        borderRadius: 6,
                        padding: "6px 10px",
                        fontSize: 13,
                      }}
                      arrow={false}
                    >
                      <i
                        className={`${styles.ic_more} bi bi-three-dots me-4 d-none`}
                        st
                      ></i>
                    </Tooltip>
                  </div>

                  {editingComment?.id === comment.id &&
                  !editingComment?.isReply ? (
                    <div className={styles.edit_form}>
                      <textarea
                        value={editingComment.content}
                        onChange={(e) =>
                          setEditingComment((prev) => ({
                            ...prev,
                            content: e.target.value,
                          }))
                        }
                        className={styles.edit_textarea}
                        maxLength={5000}
                        autoFocus
                        disabled={actionLoading[`edit-${comment.id}`]}
                      />
                      <div className={styles.edit_actions}>
                        <button
                          onClick={() =>
                            handleUpdateComment(
                              comment.id,
                              editingComment.content,
                              false
                            )
                          }
                          className={styles.edit_submit_btn}
                          disabled={
                            !editingComment.content.trim() ||
                            actionLoading[`edit-${comment.id}`]
                          }
                        >
                          {actionLoading[`edit-${comment.id}`] ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" />
                              Đang lưu...
                            </>
                          ) : (
                            "Lưu"
                          )}
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className={styles.edit_cancel_btn}
                          disabled={actionLoading[`edit-${comment.id}`]}
                        >
                          Hủy
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className={styles.comment_text}>{comment.content}</p>
                  )}

                  <div className={styles.comment_actions}>
                    <button
                      onClick={() => handleLike(comment.id, false)}
                      className={`${styles.action_btn} ${
                        comment.isLikedByCurrentUser ? styles.active : ""
                      }`}
                      disabled={actionLoading[`like-${comment.id}`]}
                    >
                      {actionLoading[`like-${comment.id}`] ? (
                        <span className="spinner-border spinner-border-sm me-1" />
                      ) : (
                        <i
                          className={`bi bi-hand-thumbs-up${
                            comment.isLikedByCurrentUser ? "-fill" : ""
                          }`}
                        ></i>
                      )}
                      Thích ({comment.likeCount || 0})
                    </button>
                    {user && (
                      <button
                        onClick={() =>
                          setReplyTo(replyTo === comment.id ? null : comment.id)
                        }
                        className={styles.action_btn}
                      >
                        <i className="bi bi-reply"></i>
                        Trả lời
                      </button>
                    )}
                  </div>

                  {/* Reply Form */}
                  {replyTo === comment.id && (
                    <div className={styles.reply_form}>
                      <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Viết câu trả lời..."
                        className={styles.reply_textarea}
                        maxLength={5000}
                        autoFocus
                        disabled={actionLoading[`reply-${comment.id}`]}
                      />
                      <div className={styles.reply_actions}>
                        <button
                          onClick={() => handleSubmitReply(comment.id)}
                          className={styles.reply_submit_btn}
                          disabled={
                            !replyContent.trim() ||
                            actionLoading[`reply-${comment.id}`]
                          }
                        >
                          {actionLoading[`reply-${comment.id}`] ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" />
                              Đang gửi...
                            </>
                          ) : (
                            "Gửi"
                          )}
                        </button>
                        <button
                          onClick={handleCancelReply}
                          className={styles.reply_cancel_btn}
                          disabled={actionLoading[`reply-${comment.id}`]}
                        >
                          Hủy
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Replies List */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className={styles.replies_list}>
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className={styles.reply_item}>
                          <img
                            src={
                              reply.userAvatar ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                reply.userName
                              )}&background=random`
                            }
                            alt={reply.userName}
                            className={styles.reply_avatar}
                            onError={(e) => {
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                reply.userName
                              )}&background=random`;
                            }}
                          />
                          <div className={styles.reply_content}>
                            <div className="d-flex justify-content-between">
                              <div>
                                <strong className={styles.reply_author}>
                                  {reply.userName}
                                  {reply.isVerified && (
                                    <i className="bi bi-patch-check-fill text-primary ms-1"></i>
                                  )}
                                </strong>
                                <span className={styles.reply_date}>
                                  {formatDate(reply.createdAt)}
                                  {reply.isEdited && (
                                    <span className="text-muted ms-1" style={{fontSize:"12px"}}>
                                      {`(đã chỉnh sửa lúc ${formatDateTimeToDMY(
                                        reply.updatedAt
                                      )})`}
                                    </span>
                                  )}
                                </span>
                              </div>
                              <Tooltip
                                title={
                                  user?.userId === reply.userId ? (
                                    <div className="d-flex flex-column align-items-start">
                                      <Button
                                        type="text"
                                        icon={<EditOutlined />}
                                        onClick={() =>
                                          handleStartEdit(
                                            reply.id,
                                            reply.content,
                                            true,
                                            comment.id
                                          )
                                        }
                                      >
                                        Chỉnh sửa
                                      </Button>
                                      <Button
                                        type="text"
                                        icon={<DeleteOutlined />}
                                        onClick={() =>
                                          handleDeleteComment(
                                            reply.id,
                                            true,
                                            comment.id
                                          )
                                        }
                                      >
                                        Xóa bình luận
                                      </Button>
                                    </div>
                                  ) : (
                                    <Button
                                      type="text"
                                      icon={<ExclamationCircleOutlined />}
                                    >
                                      Báo cáo bình luận
                                    </Button>
                                  )
                                }
                                placement="bottomLeft"
                                color="rgba(255, 255, 255, 0.75)"
                                style={{
                                  borderRadius: 6,
                                  padding: "6px 10px",
                                  fontSize: 13,
                                }}
                                arrow={false}
                              >
                                <i
                                  className={`${styles.ic_more_reply} bi bi-three-dots me-4 d-none`}
                                ></i>
                              </Tooltip>
                            </div>
                            {editingComment?.id === reply.id &&
                            editingComment?.isReply ? (
                              <div className={styles.edit_form}>
                                <textarea
                                  value={editingComment.content}
                                  onChange={(e) =>
                                    setEditingComment((prev) => ({
                                      ...prev,
                                      content: e.target.value,
                                    }))
                                  }
                                  className={styles.edit_textarea}
                                  maxLength={5000}
                                  autoFocus
                                  disabled={actionLoading[`edit-${reply.id}`]}
                                />
                                <div className={styles.edit_actions}>
                                  <button
                                    onClick={() =>
                                      handleUpdateComment(
                                        reply.id,
                                        editingComment.content,
                                        true,
                                        comment.id
                                      )
                                    }
                                    className={styles.edit_submit_btn}
                                    disabled={
                                      !editingComment.content.trim() ||
                                      actionLoading[`edit-${reply.id}`]
                                    }
                                  >
                                    {actionLoading[`edit-${reply.id}`] ? (
                                      <>
                                        <span className="spinner-border spinner-border-sm me-2" />
                                        Đang lưu...
                                      </>
                                    ) : (
                                      "Lưu"
                                    )}
                                  </button>
                                  <button
                                    onClick={handleCancelEdit}
                                    className={styles.edit_cancel_btn}
                                    disabled={actionLoading[`edit-${reply.id}`]}
                                  >
                                    Hủy
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <p className={styles.reply_text}>
                                {reply.content}
                              </p>
                            )}
                            <button
                              onClick={() =>
                                handleLike(reply.id, true, comment.id)
                              }
                              className={`${styles.reply_like_btn} ${
                                reply.isLikedByCurrentUser ? styles.active : ""
                              }`}
                              disabled={actionLoading[`like-${reply.id}`]}
                            >
                              {actionLoading[`like-${reply.id}`] ? (
                                <span className="spinner-border spinner-border-sm me-1" />
                              ) : (
                                <i
                                  className={`bi bi-hand-thumbs-up${
                                    reply.isLikedByCurrentUser ? "-fill" : ""
                                  }`}
                                ></i>
                              )}
                              Thích ({reply.likeCount || 0})
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CommentSection;
