import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FootballService } from "../../../../services/site/FootballService";
import styles from "./TopScorers.module.scss";
import { leagueTranslations } from "../../../../data/VnTransLeague";
import { Helmet } from "react-helmet-async";

function TopScores() {
  const { leagueCode } = useParams();
  const currentYear = new Date().getFullYear();

  const [topScorer, setTopScorer] = useState(null);
  const [otherScorers, setOtherScorers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTopScorers = async () => {
    try {
      setLoading(true);
      const data = await FootballService.getTopScorers(leagueCode, currentYear);
      const scorers = Array.isArray(data.scorers) ? data.scorers : data;

      if (scorers.length > 0) {
        const sorted = [...scorers].sort((a, b) => b.goals - a.goals);
        setTopScorer(sorted[0]);
        setOtherScorers(sorted.slice(1));
      }
    } catch (err) {
      console.log("Lỗi khi fetch TopScorers", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopScorers();
  }, [leagueCode]);

  return (
    <>
      <Helmet>
        <title>
          {`Vua phá lưới ${
            leagueTranslations[leagueCode] || leagueCode
          } ${currentYear}/${currentYear + 1} | Thể Thao 247`}
        </title>
      </Helmet>
      <div className="mt-3">
        <span className="fs-4 me-2 fw-bold text-uppercase text-danger">
          {leagueTranslations[leagueCode] || leagueCode} - Vua phá lưới
        </span>
        <i className="bi bi-chevron-right fs-4 text-primary fw-bold"></i>

        {loading ? (
          <p className="mt-3">⏳ Đang tải dữ liệu...</p>
        ) : !topScorer && otherScorers.length === 0 ? (
          <p className="mt-3 text-muted fst-italic">
            Hiện chưa có dữ liệu vua phá lưới cho mùa giải {currentYear}.
          </p>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.topScorersTable}>
              <thead>
                <tr>
                  <th># tên cầu thủ</th>
                  <th>bàn thắng</th>
                  <th>kiến tạo</th>
                </tr>
              </thead>
              <tbody>
                {topScorer && (
                  <tr className={styles.topScorerRow}>
                    <td colSpan={3}>
                      <div className={styles.topScorerCard}>
                        <div className={styles.topRank}>1</div>
                        <div className={styles.avatar}>
                          <img
                            src={
                              topScorer.team?.crest ||
                              "https://cdn.sofifa.net/players/notfound.png"
                            }
                            alt={topScorer.player?.name}
                          />
                        </div>
                        <div className={styles.info}>
                          <div className={styles.name}>
                            {topScorer.player?.name}{" "}
                            <span className={styles.team}>
                              ({topScorer.team?.tla})
                            </span>
                          </div>
                          <div className={styles.clubName}>
                            {topScorer.team?.name}
                          </div>
                          <div className={styles.stats}>
                            <b className="text-start">{topScorer.goals} bàn</b>
                            <span
                              className="text-muted text-start"
                              style={{ fontStyle: "italic", fontSize: "10px" }}
                            >
                              ({topScorer.assists ?? 0} kiến tạo)
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}

                {otherScorers.map((item, index) => (
                  <tr key={item.player?.id || index}>
                    <td className={styles.playerCell}>
                      <span className={styles.rank}>{index + 2}</span>
                      <img
                        src={
                          item.team?.crest ||
                          "https://cdn.sofifa.net/players/notfound.png"
                        }
                        alt={item.player?.name}
                        className={styles.smallAvatar}
                      />
                      <span className={styles.name}>
                        {item.player?.name}{" "}
                        <span className={styles.team}>({item.team?.tla})</span>
                      </span>
                    </td>
                    <td className={styles.goals}>{item.goals}</td>
                    <td className={styles.assists}>{item.assists ?? 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export default TopScores;
