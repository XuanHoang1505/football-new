import { useEffect, useState } from "react";
import dayjs from "dayjs";

import { FootballService } from "../../../services/site/FootballService";
import { Link } from "react-router-dom";
import styles from "./LeagueFixtures.module.scss";
import { Spinner } from "react-bootstrap";
function LeagueFixtures({ leagueCode, isCategoryPage = false }) {
  const [groupedMatches, setGroupedMatches] = useState({});
  const [loading, setLoading] = useState(true);
  const currentYear = new Date().getFullYear();

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const data = await FootballService.getMatches(leagueCode, currentYear);

      // chỉ lấy các trận chưa diễn ra
      const upcoming = data.matches.filter((m) =>
        ["SCHEDULED", "TIMED", "LIVE"].includes(m.status)
      );

      // group theo matchday -> date
      const grouped = {};
      upcoming.forEach((match) => {
        const round = match.matchday;
        const date = dayjs(match.utcDate).format("YYYY-MM-DD");

        if (!grouped[round]) grouped[round] = {};
        if (!grouped[round][date]) grouped[round][date] = [];

        grouped[round][date].push(match);
      });

      // chỉ lấy 3 vòng gần nhất
      const rounds = Object.keys(grouped)
        .map(Number) // đảm bảo là số
        .sort((a, b) => a - b); // sắp xếp tăng dần

      const limit = isCategoryPage ? 1 : 3;
      const nearestRounds = rounds.slice(0, limit);

      const filtered = {};
      nearestRounds.forEach((r) => (filtered[r] = grouped[r]));

      setGroupedMatches(filtered);
    } catch (err) {
      console.log("Lỗi khi fetch Matches", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [leagueCode]);
  return (
    <>
      {loading ? (
        <div className="w-100 h-100 d-flex justify-content-center align-items-center">
          <Spinner animation="border" className="text-primary" />
        </div>
      ) : (
        Object.entries(groupedMatches).map(([round, days]) => (
          <div
            key={round}
            className="mt-3 border"
            style={{ borderRadius: "10px" }}
          >
            <div className="fw-bold px-2 py-2 border-bottom bg-light">
              {isCategoryPage ? (
                <>
                  <strong className="fs-6" style={{ color: "var(--primary)" }}>
                    Chính
                  </strong>
                  <i className="bi bi-chevron-right fs-6 text-danger fw-bold"></i>
                </>
              ) : (
                `Vòng ${round}`
              )}
            </div>
            {Object.entries(days).map(([date, matches]) => (
              <div key={date} className="mb-3">
                <div className="border-bottom " style={{ lineHeight: "35px" }}>
                  <p
                    className="text-muted pe-2 ms-auto"
                    style={{
                      borderBottom: "1px solid red",
                      width: "fit-content",
                    }}
                  >
                    {dayjs(date).format("DD-MM-YYYY")}
                  </p>
                </div>
                {matches.map((m) => (
                  <div
                    key={m.id}
                    className={`${styles.matchRow} d-flex align-items-center border-bottom py-3 px-3`}
                  >
                    {/* Giờ đá */}
                    <div className={styles.matchTime}>
                      {dayjs(m.utcDate).format("HH:mm")}
                    </div>

                    {/* Đội bóng */}
                    <div
                      className={`${styles.teams} d-flex align-items-center flex-grow-1`}
                    >
                      <div className={styles.teamHome}>
                        <img
                          src={m.homeTeam.crest}
                          alt={m.homeTeam.shortName}
                          width={20}
                          className="me-1"
                        />
                        <span className={styles.teamName}>
                          {m.homeTeam.shortName}
                        </span>
                      </div>

                      <div className={styles.score}> ? - ? </div>

                      <div className={styles.teamAway}>
                        <span className={styles.teamName}>
                          {m.awayTeam.shortName}
                        </span>
                        <img
                          src={m.awayTeam.crest}
                          alt={m.awayTeam.shortName}
                          width={20}
                          className="ms-1"
                        />
                      </div>
                    </div>
                    {/* Mũi tên (tùy chọn) */}
                    <div className={styles.matchAction}>
                      <Link>&nbsp;</Link>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))
      )}
    </>
  );
}

export default LeagueFixtures;
