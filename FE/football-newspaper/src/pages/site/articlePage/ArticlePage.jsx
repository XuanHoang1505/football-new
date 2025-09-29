import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import ArticleService from "../../../services/admin/ArticleService";
import Breadcrumb from "../../../components/site/breadcrumb/Breadcrumb";

import styles from "./ArticlePage.module.scss";
import { formatDateTimeToDMY } from "../../../utils/formatDate";
import ArticleContentRenderer from "./ArticleContentRender";

function ArticlePage() {
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
    } catch (error) {
      console.log("Lỗi khi fetch bài báo", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchArticle();
  }, []);

  console.log(articleDetail);

  return (
    <>
      {loading ? (
        <div className="w-100 h-100 d-flex justify-content-center align-items-center">
          <Spinner animation="border" className="text-primary" />
        </div>
      ) : (
        <div className={styles.container}>
          <div className="row">
            <div className="col-md-9">
              <Breadcrumb />
              <div className={styles.article_detail}>
                <h1
                  className="mt2 fw-bold"
                  style={{ color: "#254892", fontSize: "30px" }}
                >
                  {articleDetail.title}
                </h1>
                <div className={styles.author_info}>
                  <div className={styles.left_content}>
                    <Link className="d-flex justify-content-center align-items-center ps-2">
                      <img
                        src={articleDetail.authorAvatar}
                        alt={articleDetail.authorName}
                        width={35}
                        height={35}
                        style={{ objectFit: "cover", borderRadius: "50%" }}
                        className="me-2"
                      />
                      <p>{articleDetail.authorName}</p>
                      <i className="bi bi-check-circle-fill ms-2 text-info"></i>
                    </Link>
                    <p className="text-muted ms-4">{`${formatDateTimeToDMY(
                      articleDetail.datePublished
                    )} (GMT+7)`}</p>
                  </div>
                  <div className={styles.right_content}>
                    <ul>
                      <li>
                        <Link to={""}>
                          <i className="bi bi-facebook fs-5 text-primary"></i>
                        </Link>
                      </li>
                      <li>
                        <Link to={""}>
                          <i className="bi bi-twitter fs-5 text-info"></i>
                        </Link>
                      </li>
                      <li>
                        <Link to={""}>
                          <i className="bi bi-instagram fs-5 text-danger"></i>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className={styles.article_content}>
                  <p className="fs-3 fw-bold my-4">{articleDetail.summary}</p>
                  <ArticleContentRenderer contents={articleDetail.contents} />
                </div>
              </div>
            </div>
            <div className="col-md-3"></div>
          </div>
        </div>
      )}
    </>
  );
}

export default ArticlePage;
