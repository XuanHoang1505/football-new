import { Link, useParams } from "react-router-dom";
import { clubMenu } from "../../../../data/MenuData";
import { useState, useEffect } from "react";
import { ClubService } from "../../../../services/site/ClubService";
import dayjs from "dayjs";

import styles from "./Summary.module.scss";
import { Helmet } from "react-helmet-async";

function Summary() {
  const [loading, setLoading] = useState(true);
  const [lastMatch, setLastMatch] = useState(null);
  const [nextMatch, setNextMatch] = useState(null);

  const currentYear = new Date().getFullYear();
  const { clubCode } = useParams();
  const club = clubMenu.find((c) => c.code === clubCode);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const data = await ClubService.getClubMatches(club.id, currentYear);

      // trận đã kết thúc (mới nhất)
      const finished = data.matches
        .filter((m) => m.status === "FINISHED")
        .sort((a, b) => new Date(b.utcDate) - new Date(a.utcDate));
      setLastMatch(finished[0] || null);

      // trận sắp tới (gần nhất)
      const upcoming = data.matches
        .filter((m) => ["SCHEDULED", "TIMED", "LIVE"].includes(m.status))
        .sort((a, b) => new Date(a.utcDate) - new Date(b.utcDate));
      setNextMatch(upcoming[0] || null);
    } catch (err) {
      console.error("Lỗi khi fetch Matches", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [clubCode]);

  if (loading) return <p>Đang tải...</p>;

  return (
    <>
      <Helmet>
        <title>{`${club.name} - Tin tức, sự kiện nổi bật & mới nhất | Thể Thao 247`}</title>
      </Helmet>
      <div className="container-fluid mt-3">
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
      </div>
    </>
  );
}

export default Summary;
