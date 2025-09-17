import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/vi"; // giữ để hiển thị tiếng Việt
import styles from "./ClubFixtures.module.scss";
import { ClubService } from "../../../../services/site/ClubService";
import { clubMenu } from "../../../../data/MenuData";
import { Helmet } from "react-helmet-async";
import { Spinner } from "react-bootstrap";

function ClubFixtures() {
  const currentYear = new Date().getFullYear();
  const { clubCode } = useParams();
  dayjs.extend(utc);
  dayjs.extend(timezone);

  const club = clubMenu.find((c) => c.code === clubCode);
  const [groupedMatches, setGroupedMatches] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchMatches = async () => {
    try {
      setLoading(true);

      if (!club) return;

      const data = await ClubService.getClubMatches(club.id, currentYear);

      // chỉ lấy trận chưa diễn ra
      const upcoming = data.matches.filter((m) =>
        ["SCHEDULED", "TIMED", "LIVE"].includes(m.status)
      );

      // group theo tháng
      const grouped = {};
      upcoming.forEach((match) => {
        const monthKey = dayjs(match.utcDate).format("YYYY-MM");
        if (!grouped[monthKey]) grouped[monthKey] = [];
        grouped[monthKey].push(match);
      });

      // sort tháng + trận trong tháng
      const sorted = Object.keys(grouped)
        .sort()
        .reduce((acc, key) => {
          acc[key] = grouped[key].sort(
            (a, b) => new Date(a.utcDate) - new Date(b.utcDate)
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
  }, [clubCode]);

  console.log(groupedMatches);

  return (
    <>
      <Helmet>
        <title>{`Lịch thi đấu của ${club.name} mới nhất | Thể Thao 247`}</title>
      </Helmet>
      <div className="mt-3">
        {loading ? (
          <div className="w-100 h-100 d-flex justify-content-center align-items-center">
            <Spinner animation="border" className="text-primary" />
          </div>
        ) : (
          Object.entries(groupedMatches).map(([month, matches]) => (
            <div key={month} className="mt-3 border rounded">
              {/* Header tháng */}
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

              {/* Danh sách trận */}
              {Array.isArray(matches) &&
                matches.map((m) => (
                  <div
                    key={m.id}
                    className={`${styles.matchRow} d-flex align-items-center border-bottom py-3 px-3`}
                  >
                    {/* Ngày + giờ */}
                    <div className="me-3 text-center" style={{ width: "70px" }}>
                      <div style={{ color: "#254892" }}>
                        {dayjs(m.utcDate).format("DD-MM")}
                      </div>
                    </div>

                    {/* Đội bóng */}
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
                        {" "}
                        {dayjs(m.utcDate).format("HH:mm")}
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

                    {/* Icon mũi tên */}
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

export default ClubFixtures;
