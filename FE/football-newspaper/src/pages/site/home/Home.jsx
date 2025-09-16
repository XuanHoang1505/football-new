import { Link, NavLink } from "react-router-dom";
import { Figure, Spinner } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";

import Sidebar from "../../../components/site/appSidebar/Sidebar";
import styles from "./Home.module.scss";
import AppRank from "../../../components/site/appRank/AppRank";
import AppMatches from "../../../components/site/appMatches/AppMatches";
import ArticleService from "../../../services/site/ArticleService";
import { clubMenu } from "../../../data/MenuData";

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await ArticleService.getArticles();
        const sorted = data.sort(
          (a, b) => new Date(b.datePublished) - new Date(a.datePublished)
        );
        setArticles(sorted);
      } catch (error) {
        console.error("Lỗi khi fetch articles", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center p-5">
        <Spinner animation="border" variant="danger" />
      </div>
    );
  }

  if (articles.length === 0) {
    return <div className="text-center p-5">Không có bài viết nào</div>;
  }

  const mainNews = articles[0];
  const subNews = articles.slice(1, 4);
  const sideNews = articles.slice(4, 14);

  return (
    <>
      <Helmet>
        <title>
          Thể thao 247 - MXH Thể thao, Bóng đá mới nhất cập nhật 24/7
        </title>
      </Helmet>

      <div className={styles.container}>
        {/* menu CLB */}
        <div className={styles.list_item}>
          {clubMenu.map((club, index) => (
            <NavLink
              className={styles.item}
              to={`/club/${club.url}`}
              key={index}
            >
              <img src={club.logo} alt={club.name} className={styles.logo} />
              <span className={styles.name}>{club.name}</span>
            </NavLink>
          ))}
        </div>

        {/* content */}
        <div className="row">
          <div className="col-lg-2 d-none d-lg-block p-0">
            <Sidebar />
          </div>

          <div className="col-lg-10 col-12 p-0">
            <div className="row">
              {/* Main news */}
              <div className="col-lg-9 col-12 p-0 ps-lg-2 pe-lg-3">
                <Figure className="p-0 m-0">
                  <Figure.Image
                    alt={mainNews.title}
                    src={mainNews.imageUrl}
                    className="w-100 m-0 p-0"
                    title={mainNews.title}
                  />
                  <Figure.Caption>
                    <div className={styles.mainNewsContent}>
                      <Link
                        to={`/news/${mainNews.slug}`}
                        title={mainNews.categoryName}
                        className={styles.category}
                      >
                        {mainNews.categoryName}
                      </Link>
                      <h2 className="mt-3">
                        <Link
                          to={`/news/${mainNews.slug}`}
                          title={mainNews.title}
                          className={styles.title}
                        >
                          {mainNews.title}
                        </Link>
                      </h2>
                      <p className={styles.summary}>{mainNews.summary}</p>
                    </div>
                  </Figure.Caption>
                </Figure>
              </div>

              {/* Side news */}
              <div className="col-lg-3 col-md-6 col-12 mt-3 mt-lg-0 ps-sm-4 p-lg-0" >
                <h3 className="text-danger text-uppercase border-bottom fw-bold mb-3">
                  Tin hot
                </h3>
                <ul className={styles.sideNews} style={{maxHeight: "630px", overflowY: "auto"}}>
                  {sideNews.map((news, index) => (
                    <li key={index}>
                      <NavLink to={`/news/${news.slug}`} title={news.title}>
                        {news.title}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sub news */}
            <div className="row mt-3">
              {subNews.map((news, index) => (
                <div className="col-12 col-sm-4" key={index}>
                  <Figure>
                    <Figure.Image
                      alt={news.title}
                      src={news.imageUrl}
                      title={news.title}
                      className={`${styles.subNewsImage} m-0`}
                    />
                    <Figure.Caption>
                      <div className={styles.subNewsContent}>
                        <Link
                          to={`/news/${news.slug}`}
                          title={news.categoryName}
                          className={styles.category}
                        >
                          {news.categoryName}
                        </Link>
                        <h2>
                          <Link
                            to={`/news/${news.slug}`}
                            title={news.title}
                            className={styles.title}
                          >
                            {news.title}
                          </Link>
                        </h2>
                      </div>
                    </Figure.Caption>
                  </Figure>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Matches & Rank */}
        <div className="row">
          <div className="col-lg-8 col-12 mb-3 mb-lg-0 ps-0">
            <AppMatches />
          </div>
          <div className="col-lg-4 col-12 p-0">
            <AppRank />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
