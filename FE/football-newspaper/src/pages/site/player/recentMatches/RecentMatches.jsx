import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import dayjs from "dayjs";

import "dayjs/locale/vi"; // giữ để hiển thị tiếng Việt
import styles from "./RecentMatches.module.scss";
import { PlayerService } from "../../../../services/site/PlayerService";
import { clubMenu } from "../../../../data/MenuData";
import { Helmet } from "react-helmet-async";
import { Spinner } from "react-bootstrap";

function RecentMatches() {
  const currentYear = new Date().getFullYear();
  const { playerId } = useParams();

  const [groupedMatches, setGroupedMatches] = useState({});
  const [playerInfo, setPlayerInfo] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchMatches = async () => {
    try {
      setLoading(true);

      const data = await PlayerService.getPlayerMatches(playerId, currentYear);

      setPlayerInfo(data.person);

      const finished = data.matches.filter((m) =>
        ["FINISHED"].includes(m.status)
      );

      const grouped = {};
      finished.forEach((match) => {
        const monthKey = dayjs(match.utcDate).format("YYYY-MM");
        if (!grouped[monthKey]) grouped[monthKey] = [];
        grouped[monthKey].push(match);
      });

      const sorted = Object.keys(grouped)
        .sort((a, b) => new Date(b + "-01") - new Date(a + "-01"))
        .reduce((acc, key) => {
          acc[key] = grouped[key].sort(
            (b, a) => new Date(a.utcDate) - new Date(b.utcDate)
          );
          return acc;
        }, {});

      setGroupedMatches(sorted);
    } catch (err) {
      console.error("Lỗi khi fetch Matches", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [playerId]);

  console.log(groupedMatches);

  return (
    <>
      <Helmet>
        <title>{`${playerInfo.name} - Tin tức, lịch thi đấu & sự nghiệp | Thể Thao 247`}</title>
      </Helmet>
      <div className="mt-3">
        {loading ? (
          <div className="w-100 h-100 d-flex justify-content-center align-items-center">
            <Spinner animation="border" className="text-primary" />
          </div>
        ) : (
          Object.entries(groupedMatches).map(([month, matches]) => (
            <div key={month} className="mt-3 border rounded">
              <div
                className="border-bottom bg-light"
                style={{ lineHeight: "35px" }}
              >
                <p
                  className="pe-2 ms-auto"
                  style={{
                    borderBottom: "1px solid red",
                    width: "fit-content",
                    color: "#3a4e91",
                  }}
                >
                  Tháng{" "}
                  {dayjs(month + "-01")
                    .locale("vi")
                    .format("MM/YYYY")}
                </p>
              </div>

              {Array.isArray(matches) &&
                matches.map((m) => (
                  <div
                    key={m.id}
                    className={`${styles.matchRow} d-flex align-items-center border-bottom py-3 px-3`}
                  >
                    <div className="me-3 text-center" style={{ width: "70px" }}>
                      <div style={{ color: "#254892" }}>
                        {m.status === "FINISHED" ? "FT" : m.status}
                      </div>
                    </div>

                    <div
                      className={`${styles.teams} d-flex align-items-center flex-grow-1`}
                    >
                      <div className={styles.teamHome}>
                        <span className={styles.teamName}>
                          {m.homeTeam.shortName}
                        </span>
                        <img
                          src={m.homeTeam.crest}
                          alt={m.homeTeam.shortName}
                          width={25}
                          className="ms-1"
                        />
                      </div>

                      <div
                        className={styles.score}
                        style={{ color: "#254892" }}
                      >
                        {m.score?.fullTime?.home} - {m.score?.fullTime?.away}
                      </div>

                      <div className={styles.teamAway}>
                        <img
                          src={m.awayTeam.crest}
                          alt={m.awayTeam.shortName}
                          width={20}
                          className="me-1"
                        />
                        <span className={styles.teamName}>
                          {m.awayTeam.shortName}
                        </span>
                      </div>
                    </div>

                    <div className={styles.matchAction}>
                      <Link>&nbsp;</Link>
                    </div>
                  </div>
                ))}
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default RecentMatches;
