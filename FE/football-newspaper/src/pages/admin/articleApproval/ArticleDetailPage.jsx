import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ArticleService from "../../../services/admin/ArticleService";

export const ArticleDetailPage = () => {
  const { slug } = useParams();
  const [articleDetail, setArticleDetail] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const data = await ArticleService.getArticleBySlug(
        "sieu-may-tinh-du-doan-man-city-vs-mu"
      );
      setArticleDetail(data);
      console.log(data);
    } catch (error) {
      console.log("Lỗi khi fetch bài báo", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchArticle();
  }, []);
};
