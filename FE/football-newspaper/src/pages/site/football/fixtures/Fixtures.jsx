import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import dayjs from "dayjs";
import styles from "./Fixtures.module.scss";
import { leagueTranslations } from "../../../../data/VnTransLeague";
import { FootballService } from "../../../../services/site/FootballService";

function Fixtures() {
  const currentYear = new Date().getFullYear();
  const { leagueCode } = useParams();

  const [groupedMatches, setGroupedMatches] = useState({});
  const [loading, setLoading] = useState(true);

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

      const nearest3 = rounds.slice(0, 3); // lấy 3 vòng đầu tiên (gần nhất)

      const filtered = {};
      nearest3.forEach((r) => (filtered[r] = grouped[r]));

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
    <div className="mt-3">
      <span className="fs-4 me-2 fw-bold text-uppercase text-danger">
        Lịch thi đấu {leagueTranslations[leagueCode] || leagueCode} hôm nay
      </span>
      <i className="bi bi-chevron-right fs-4 text-primary fw-bold"></i>

      {loading ? (
        <p className="mt-3">⏳ Đang tải dữ liệu...</p>
      ) : (
        Object.entries(groupedMatches).map(([round, days]) => (
          <div
            key={round}
            className="mt-3 border"
            style={{ borderRadius: "10px" }}
          >
            <div className="fw-bold px-2 py-2 border-bottom bg-light">
              Vòng {round}
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
    </div>
  );
}

export default Fixtures;
