import styles from "./Summary.module.scss";
import { Helmet } from "react-helmet-async";
import { Spinner } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { useState, useEffect } from "react";

import LeagueStandings from "../../../../components/site/leagueStandings/LeagueStandings";
import { clubMenu } from "../../../../data/MenuData";
import { ClubService } from "../../../../services/site/ClubService";
import CategoryService from "../../../../services/admin/CategoryService";

function Summary() {
  const [loading, setLoading] = useState(true);
  const [lastMatch, setLastMatch] = useState(null);
  const [nextMatch, setNextMatch] = useState(null);
  const [articles, setArticles] = useState([]);

  const currentYear = new Date().getFullYear();
  const { clubCode } = useParams();
  const club = clubMenu.find((c) => c.code === clubCode);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [matchesData, articlesData] = await Promise.all([
          ClubService.getClubMatches(club.id, currentYear),
          CategoryService.getArticlesByCategorySlug(club.code),
        ]);

        // trận đã kết thúc (mới nhất)
        const finished = matchesData.matches
          .filter((m) => m.status === "FINISHED")
          .sort((a, b) => new Date(b.utcDate) - new Date(a.utcDate));
        setLastMatch(finished[0] || null);

        // trận sắp tới (gần nhất)
        const upcoming = matchesData.matches
          .filter((m) => ["SCHEDULED", "TIMED", "LIVE"].includes(m.status))
          .sort((a, b) => new Date(a.utcDate) - new Date(b.utcDate));
        setNextMatch(upcoming[0] || null);

        setArticles(articlesData);
      } catch (err) {
        console.error("Lỗi khi fetch dữ liệu", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [clubCode]);

  const highlightArticle = articles[0];
  const sideArticles = articles.slice(1, 5);
  const otherArticles = articles.slice(5);

  if (loading)
    return (
      <div className="w-100 h-100 d-flex justify-content-center align-align-items-start">
        <Spinner animation="border" className="text-primary" />
      </div>
    );

  return (
    <>
      <Helmet>
        <title>{`${club.name} - Tin tức, sự kiện nổi bật & mới nhất | Thể Thao 247`}</title>
      </Helmet>
      <div className="container-fluid mt-3">
        <span className="fs-4 me-2 fw-bold text-uppercase text-danger">
          {club.name}
        </span>
        <i className="bi bi-chevron-right fs-4 text-primary fw-bold"></i>
        {/* Main Articles */}
        <div className="row mb-3 mt-2">
          {!highlightArticle ? (
            <p className="d-flex justify-content-center p-5">
              Hiện chưa có bài báo nào liên quan tới đội bóng
            </p>
          ) : (
            <>
              <div className="col-md-6 d-flex flex-column gap-2 mb-3 mb-lg-0">
                <Link to={`/news/${highlightArticle.slug}`}>
                  <img
                    src={highlightArticle.imageUrl}
                    alt={highlightArticle.title}
                    title={highlightArticle.title}
                    className="w-100 h-auto"
                  />
                </Link>
                <Link
                  to={`/news/${highlightArticle.slug}`}
                  className="text-black fs-5"
                >
                  {highlightArticle.title}
                </Link>
                <p>{highlightArticle.summary}</p>
              </div>
              <div className="col-md-6 d-flex flex-column gap-3">
                {sideArticles.map((article, idx) => (
                  <div key={idx} className="d-flex gap-3">
                    <Link
                      style={{ width: "110px" }}
                      to={`/news/${article.slug}`}
                    >
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        title={article.title}
                        className="w-100 h-auto"
                      />
                    </Link>
                    <Link
                      style={{ flex: "1" }}
                      className="fs-6 fw-bold text-black ml-3"
                    >
                      {article.title}
                    </Link>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        {/* End Main Articles */}
        <div className={styles.line_bg} />
        {/* Match cards */}
        <div className="row">
          {/* Trận trước */}
          <div className="col-12 col-md-6">
            <p className="fw-bold fs-4 mb-2">Kết quả trận trước</p>
            <div className={styles.card}>
              {lastMatch ? (
                <div className={styles.matchBox}>
                  <div style={{ borderBottom: "1px dashed #ccc" }}>
                    <div className={styles.scoreRow}>
                      <div className={styles.team}>
                        <img
                          src={lastMatch.homeTeam.crest}
                          alt={lastMatch.homeTeam.name}
                        />
                        <span>{lastMatch.homeTeam.name}</span>
                      </div>
                      <strong>{lastMatch.score.fullTime.home}</strong>
                    </div>
                    <div className={styles.scoreRow}>
                      <div className={styles.team}>
                        <img
                          src={lastMatch.awayTeam.crest}
                          alt={lastMatch.awayTeam.name}
                        />
                        <span>{lastMatch.awayTeam.name}</span>
                      </div>
                      <strong>{lastMatch.score.fullTime.away}</strong>
                    </div>
                  </div>
                  <Link
                    className="d-flex mt-2"
                    to={`/football/${lastMatch.competition.code}/`}
                  >
                    <img
                      src={lastMatch.competition.emblem}
                      alt=""
                      width={25}
                      className="me-2"
                    />
                    <p className={styles.league}>
                      {lastMatch.competition.name}
                    </p>
                  </Link>
                </div>
              ) : (
                <p>Chưa có dữ liệu</p>
              )}
            </div>
            <div className="text-end mt-2">
              <Link to={`/club/${club.code}/results`} className="link-primary">
                Xem đầy đủ
              </Link>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <p className="fw-bold fs-4 mb-2">Trận tiếp theo </p>
            <div className={styles.card}>
              {nextMatch ? (
                <>
                  <div
                    className="d-flex "
                    style={{ borderBottom: "1px dashed #ccc" }}
                  >
                    <div className={styles.date}>
                      {dayjs(nextMatch.utcDate).format("DD-MM")}
                    </div>
                    <div className="flex-grow-1">
                      <div className={styles.scoreRow}>
                        <div className={styles.team}>
                          <img
                            src={nextMatch.homeTeam.crest}
                            alt={nextMatch.homeTeam.name}
                          />
                          <span>{nextMatch.homeTeam.name}</span>
                        </div>
                        <strong>?</strong>
                      </div>
                      <div className={styles.scoreRow}>
                        <div className={styles.team}>
                          <img
                            src={nextMatch.awayTeam.crest}
                            alt={nextMatch.awayTeam.name}
                          />
                          <span>{nextMatch.awayTeam.name}</span>
                        </div>
                        <strong>?</strong>
                      </div>
                    </div>
                  </div>
                  <Link
                    className="d-flex mt-2"
                    to={`/football/${nextMatch.competition.code}/`}
                  >
                    <img
                      src={nextMatch.competition.emblem}
                      alt=""
                      width={25}
                      className="me-2"
                    />
                    <p className={styles.league}>
                      {nextMatch.competition.name}
                    </p>
                  </Link>
                </>
              ) : (
                <p>Không có trận sắp tới</p>
              )}
            </div>
            <div className="text-end mt-2">
              <Link to={`/club/${club.code}/fixtures`} className="link-primary">
                Xem đầy đủ
              </Link>
            </div>
          </div>
        </div>
        {/*End match cards*/}

        <div className={styles.line_bg} />

        {/* Bảng xếp hạng */}
        <div>
          <p className="fw-bold fs-4">
            {`Bảng xếp hạng ${
              club.leagueCode === "PL" ? "Ngoại hạng anh" : "Laliga"
            }`}{" "}
          </p>
          <div className="" style={{ maxHeight: "400px", overflow: "auto" }}>
            <LeagueStandings leagueCode={club.leagueCode} />
          </div>
        </div>
        {/* End bảng xếp hạng  */}

        <div className={styles.line_bg} />

        {/* Tin tức */}
        <div>
          <p className="fw-bold fs-4 mb-3">Tin tức</p>
          {otherArticles.length === 0 ? (
            <p>Chưa có bài báo mới</p>
          ) : (
            <ul className={styles.listArticles}>
              {otherArticles.map((article, index) => (
                <li key={index} className="d-flex gap-3">
                  <Link to={`/news/${article.slug}`} className={styles.thumb}>
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      title={article.title}
                      className="w-100 h-auto"
                    />
                  </Link>
                  <div className={styles.title} style={{ flex: "1" }}>
                    <Link
                      to={`/news/${article.slug}`}
                      className="fs-4 fw-bold text-black"
                    >
                      {article.title}
                    </Link>
                    <p className="mt-2">{article.summary}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* End tin tức */}
      </div>
    </>
  );
}

export default Summary;
