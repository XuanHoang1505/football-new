import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { Button, Spinner } from "react-bootstrap";
import styles from "./LatestPage.module.scss";
import DynamicBreadcrumb from "../../../components/site/breadcrumb/Breadcrumb";
import { formatDateToDMY } from "../../../utils/formatDate";
import ArticleService from "../../../services/admin/ArticleService";

function LatestPage() {
  const today = new Date();
  const formattedToday = today.toISOString().split("T")[0]; // "2025-09-15"
  const [date, setDate] = useState(formattedToday);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchArticlesByDate = async () => {
    try {
      setLoading(true);
      const data = await ArticleService.getArticlesByDate(date);
      setArticles(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticlesByDate();
  }, [date]);

  const onDateChange = (e) => {
    setDate(e.target.value);
  };

  return (
    <>
      <Helmet>
        <title>Tin tức mới nhất trên Thể Thao 247 tr</title>
      </Helmet>
      <div className={`${styles.container} container-fluid`}>
        <DynamicBreadcrumb />
        {loading ? (
          <div className="w-100 h-100 d-flex justify-content-center align-items-center">
            <Spinner animation="border" className="text-primary" />
          </div>
        ) : (
          <div className="row">
            <div className="col-12 col-lg-8">
              <div className={styles.selectDay}>
                <input
                  className="px-2 py-1"
                  type="date"
                  onChange={onDateChange}
                  value={date}
                  max={formattedToday}
                />
                <div>
                  Bạn đang xem tin ngày:{" "}
                  <strong className="text-danger">
                    {" "}
                    {formatDateToDMY(date)}
                  </strong>
                </div>
              </div>
              <div className={styles.caption}>
                <Link
                  className="text-light text-uppercase ps-2"
                  style={{ fontSize: "15px" }}
                  to={``}
                >
                  Latest
                </Link>
              </div>
              <ul className={styles.articleList}>
                {articles.length === 0 && (
                  <div className="text-center text-secondary my-5">
                    Không có bài viết nào vào ngày {formatDateToDMY(date)}
                  </div>
                )}
                {articles.map((article) => (
                  <li key={article.id} className={styles.articleItem}>
                    <div className={styles.articleInfo}>
                      <div className={styles.time}>{article.timeAgo}</div>
                      <Link
                        to={`/news/${article.slug}`}
                        className={styles.title}
                        title={article.title}
                      >
                        {article.title}
                      </Link>
                      <p className={styles.sapo}>{article.summary}</p>
                    </div>
                    <Link
                      to={`/news/${article.slug}`}
                      className={styles.thumb}
                      title={article.title}
                    >
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        style={{
                          width: "clamp(125px, 20vw, 196px)",
                          height: "clamp(80px, 12vw, 125px)",
                        }}
                      />
                    </Link>
                  </li>
                ))}
                {articles.length > 0 && (
                  <Button
                    size="lg"
                    variant="outline-secondary"
                    className="w-100"
                  >
                    Xem thêm{" "}
                  </Button>
                )}
              </ul>
            </div>
            <div className="col-12 col-lg-4 "></div>
          </div>
        )}
      </div>
    </>
  );
}

export default LatestPage;
