import { Link, NavLink } from "react-router-dom";
import { Button, Figure, Spinner } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";

import Sidebar from "../../../components/site/appSidebar/Sidebar";
import styles from "./Home.module.scss";
import AppRank from "../../../components/site/appRank/AppRank";
import AppMatches from "../../../components/site/appMatches/AppMatches";
import ArticleService from "../../../services/admin/ArticleService";
import { clubMenu } from "../../../data/MenuData";
import BoxCategory from "../../../components/site/boxCategory/BoxCategory";

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vietnamArticles, setVietnamArticles] = useState([]);
  const [nationalArticles, setNationalArticles] = useState([]);
  const [transferArticles, setTransferArticles] = useState([]);
  const [internationalArticles, setInternationalArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await ArticleService.getArticles();
        const sorted = data.sort(
          (a, b) => new Date(b.datePublished) - new Date(a.datePublished)
        );
        setArticles(sorted);

        setVietnamArticles(
          sorted.filter((a) => a.categoryName === "Bóng đá Việt Nam")
        );
        setNationalArticles(
          sorted.filter((a) => a.categoryName === "Đội tuyển quốc gia")
        );
        setTransferArticles(
          sorted.filter((a) => a.categoryName === "Chuyển nhượng")
        );
        setInternationalArticles(
          sorted.filter((a) => a.categoryName === "Bóng đá quốc tế")
        );
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

  const mainNews = articles[0];
  const subNews = articles.slice(1, 4);
  const sideNews = articles.slice(4, 14);
  const latestNews = articles.slice(11, 30);

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
              <div className="col-lg-3 col-12 mt-3 mt-lg-0 ps-sm-4 p-lg-0">
                <h3 className={`${styles.sideTitle} text-danger text-uppercase border-bottom fw-bold mb-3`} style={{maxWidth: "245px"}}>
                  Tin hot
                </h3>
                <ul
                  className={styles.sideNews}
                  style={{ maxHeight: "630px", overflowY: "auto" }}
                >
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
            <div className="row mt-3">
              <div className="col-12 col-lg-6">
                <div className={styles.caption}>
                  <Link
                    className="text-light text-uppercase ps-2"
                    style={{ fontSize: "15px" }}
                    to={`/latest`}
                  >
                    Latest
                  </Link>
                </div>
                {latestNews.map((news, index) => (
                  <div className={styles.boxList} key={index}>
                    <Link
                      to={`/news/${news.slug}`}
                      className={`${styles.thumb} me-3`}
                    >
                      <img
                        src={news.imageUrl}
                        alt={news.title}
                        className="w-100 h-auto"
                      />
                    </Link>

                    <div className={styles.content}>
                      <Link to={`/news/${news.slug}`} className={styles.title}>
                        {news.title.length > 90
                          ? `${news.title.slice(0, 90)}...`
                          : news.title}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              <div className="col-12 col-lg-6">
                {/* Bóng đá Việt Nam */}
                <BoxCategory
                  articles={vietnamArticles}
                  name={"Bóng đá Việt Nam"}
                  path={`/category/bong-da-viet-nam`}
                />
                <div className={styles.box_trending}>
                  <div className={styles.caption_2}>
                    <h2>
                      <Link className={styles.trending_title} to={""}>
                        # Trending
                      </Link>
                    </h2>
                  </div>
                  <div className={styles.content}>
                    <p className="d-flex flex-column">
                      <Link
                        className={styles.trending_tag_6}
                        title="Bóng đá Việt Nam"
                        to={"/category/bong-da-viet-nam"}
                      >
                        Bóng đá Việt Nam
                      </Link>
                      <Link
                        className={styles.trending_tag_4}
                        title="V-League"
                        to={""}
                      >
                        V-League
                      </Link>
                      <Link
                        className={styles.trending_tag_6}
                        title="Đội tuyển quốc gia"
                        to={"/category/doi-tuyen-quoc-gia"}
                      >
                        Đội tuyển quốc gia
                      </Link>
                    </p>
                  </div>
                </div>
                <BoxCategory
                  articles={transferArticles}
                  name={"Chuyển nhượng"}
                  path={`/category/chuyen-nhuong`}
                />
                <div className={styles.box_trending}>
                  <div className={styles.caption_2}>
                    <h2>
                      <Link className={styles.trending_title} to={""}>
                        # Trending
                      </Link>
                    </h2>
                  </div>
                  <div className={styles.content}>
                    <p className="d-flex flex-column">
                      <Link
                        className={styles.trending_tag_7}
                        title="Tin chuyển nhượng"
                        to={"/category/chuyen-nhuong"}
                      >
                        Tin chuyển nhượng
                      </Link>
                      <Link
                        className={styles.trending_tag_4}
                        title="category/ngoai-hang-anh"
                        to={""}
                      >
                        Bóng đá anh
                      </Link>
                      <Link
                        className={styles.trending_tag_7}
                        title="Đội tuyển quốc gia"
                        to={"/category/bong-da-quoc-te"}
                      >
                        Cúp C1
                      </Link>
                      <Link
                        className={styles.trending_tag_3}
                        title="Europa league"
                        to={""}
                      >
                        Europa league
                      </Link>
                    </p>
                  </div>
                </div>
                <BoxCategory
                  articles={nationalArticles}
                  name={"Đội tuyển quốc gia"}
                  path={`/category/doi-tuyen-quoc-gia`}
                />
                <BoxCategory
                  articles={internationalArticles}
                  name={"Bóng đá quốc tế"}
                  path={`/category/bong-da-quoc-te`}
                />
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-12 p-0">
            <AppRank />
          </div>
        </div>
        <div className="row">
          {/* Mới nhất */}
          <div className="col-md-8 p-0">
            <div className="mt-4">
              <div className={`${styles.caption} mb-3`}>
                <Link
                  className="text-light text-uppercase ps-2"
                  style={{ fontSize: "15px" }}
                  to={``}
                >
                  Latest
                </Link>
              </div>
              {articles.slice(4).map((news, index) => (
                <div className={styles.boxListLatest} key={index}>
                  <Link
                    to={`/news/${news.slug}`}
                    className={`${styles.thumb} me-3`}
                  >
                    <img
                      src={news.imageUrl}
                      alt={news.title}
                      className="w-100 h-auto"
                    />
                  </Link>
                  <div style={{ flex: "1" }}>
                    <Link to={`/news/${news.slug}`} className={styles.title}>
                      {news.title}
                    </Link>
                    <p className={styles.summary}>{news.summary}</p>
                  </div>
                </div>
              ))}
              <Button size="lg" variant="outline-secondary" className="w-100">
                Xem thêm{" "}
              </Button>
            </div>
          </div>
          <div className="col-4"></div>
        </div>
      </div>
    </>
  );
};

export default Home;
