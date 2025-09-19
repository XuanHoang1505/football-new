import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Spinner } from "react-bootstrap";
import { Helmet } from "react-helmet-async";

import CategoryService from "../../../services/admin/CategoryService";

import { leagueMenu } from "../../../data/MenuData";

import DynamicBreadcrumb from "../../../components/site/breadcrumb/Breadcrumb";
import LeagueStandings from "../../../components/site/leagueStandings/LeagueStandings";
import LeagueFixtures from "../../../components/site/leagueFixtures/LeagueFixtures";
import LeagueTopScorers from "../../../components/site/leagueTopScorers/LeagueTopScorers";

import styles from "./NewsCategory.module.scss";
function NewsCategory() {
  const { slug } = useParams();
  const [newsData, setNewsData] = useState([]);
  const [category, setCategory] = useState({});
  const [loading, setLoading] = useState(false);

  let league = leagueMenu.find((league) => league.slug === slug);
  let leagueCode = league ? league.path.replace("/", "") : null;

  if (slug === "bong-da-quoc-te") {
    league = leagueMenu.find((l) => l.path === "PL/"); // lấy object PL trong menu
    leagueCode = "PL";
  }

  console.log("League in category page:", league);

  const fetchNewsByCategory = async () => {
    try {
      setLoading(true);
      const data = await CategoryService.getArticlesByCategorySlug(slug);
      setNewsData(data);
    } catch (error) {
      console.log("Lỗi khi fetch news", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategory = async () => {
    try {
      setLoading(true);
      const data = await CategoryService.getCategoryBySlug(slug);
      setCategory(data);
    } catch (error) {
      console.log("Lỗi khi fetch news", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewsByCategory();
    fetchCategory();
  }, [slug]);

  console.log(newsData);

  if (loading) {
    return (
      <div className="w-100 h-100 d-flex justify-content-center align-items-center">
        <Spinner animation="border" className="text-primary" />
      </div>
    );
  }
  return (
    <>
      <Helmet>
        <title>{`${
          category?.name ?? ""
        } - Tin tức, lịch thi đấu, tỷ số & bxh | Thể Thao 247`}</title>
      </Helmet>
      <div className={styles.container}>
        <div className="mb-2">
          <DynamicBreadcrumb category={category} />
        </div>
        <div className="row">
          <div className="col-12 col-lg-9">
            <h1 className="mb-3 mt-0" style={{ color: "var(--primary)" }}>
              {category?.name}
            </h1>
            {newsData.length > 0 && (
              <div className={styles.boxCover}>
                <Link to={`/news/${newsData[0]?.slug}`} className={styles.image}>
                  <img
                    src={newsData[0]?.imageUrl}
                    alt={newsData[0]?.title}
                    className="mb-2 h-auto border-0"
                    style={{ maxWidth: "100%" }}
                  />
                </Link>
                <div className={styles.content}>
                  <div className={styles.isMobile}>
                    <Link to={""}>{category.name}</Link>
                  </div>
                  <Link
                    className={`${styles.title} fs-3 fw-bold mb-3 text-black`}
                    to={`/news/${newsData[0].slug}`}
                  >
                    {newsData[0].title}
                  </Link>
                  <p className="text-muted" style={{ fontSize: "15px" }}>
                    {newsData[0].summary}
                  </p>
                </div>
              </div>
            )}
            <div className="row mb-3">
              {newsData.slice(1, 4).map((news, index) => (
                <div
                  className={`${styles.boxItem} col-12 col-md-4 mb-2`}
                  key={index}
                >
                  <Link to={`/news/${news.slug}`} className={styles.image}>
                    <img
                      src={news.imageUrl}
                      alt={news.title}
                      className="h-auto border-0"
                      style={{ maxWidth: "100%" }}
                    />
                  </Link>
                  <Link to={`/news/${news.slug}`} className={styles.boxTitle}>
                    <p>{news.title}</p>
                  </Link>
                </div>
              ))}
            </div>
            {league && (
              <div className="d-flex flex-column mb-3">
                {/* Lịch thi đấu */}
                <div className={styles.caption}>
                  <Link
                    className="text-light text-uppercase ps-2"
                    style={{ fontSize: "15px" }}
                    to={`/football/${league?.path}`}
                  >{`Lịch thi đấu ${category?.name}`}</Link>
                </div>
                <LeagueFixtures leagueCode={leagueCode} isCategoryPage={true} />

                {/* Tin mới nhất */}
                <div className="mt-4">
                  <div className={`${styles.caption} mb-3`}>
                    <Link
                      className="text-light text-uppercase ps-2"
                      style={{ fontSize: "15px" }}
                      to={``}
                    >
                      Mới nhất
                    </Link>
                  </div>
                  {newsData.slice(4).map((news, index) => (
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
                      <div className="flex-grow-1">
                        <Link
                          to={`/news/${news.slug}`}
                          className={styles.title}
                        >
                          {news.title}
                        </Link>
                        <p className={styles.summary}>{news.summary}</p>
                      </div>
                    </div>
                  ))}
                  <Button
                    size="lg"
                    variant="outline-secondary"
                    className="w-100"
                  >
                    Xem thêm{" "}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Side information */}
          {league && (
            <div className="col-12 col-lg-3">
              {/* Bảng xếp hạng & Vua phá lưới */}
              <div>
                <div className={styles.caption}>
                  <Link
                    className="text-light text-uppercase ps-2"
                    style={{ fontSize: "15px" }}
                    to={`/football/${league?.path}standings`}
                  >{`Bảng xếp hạng ${category?.name}`}</Link>
                </div>
                <LeagueStandings leagueCode={leagueCode} isFullWidth={false} />
              </div>
              <div className="mt-5">
                <LeagueTopScorers leagueCode={leagueCode} isFullWidth={false} />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default NewsCategory;
