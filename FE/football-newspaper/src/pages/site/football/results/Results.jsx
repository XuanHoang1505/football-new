import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import dayjs from "dayjs";
import styles from "./Results.module.scss";
import { leagueTranslations } from "../../../../data/VnTransLeague";
import { FootballService } from "../../../../services/site/FootballService";
import { Helmet } from "react-helmet-async";

function Results() {
  const currentYear = new Date().getFullYear();
  const { leagueCode } = useParams();

  const [roundsToShow, setRoundsToShow] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMatches = async () => {
    try {
      setIsLoading(true);
      const data = await FootballService.getMatches(leagueCode, currentYear);

      // chỉ lấy trận đã diễn ra
      const finished = data.matches.filter((m) =>
        ["FINISHED", "IN_PLAY", "PAUSED"].includes(m.status)
      );

      // group theo vòng -> ngày
      const grouped = {};
      finished.forEach((match) => {
        const round = match.matchday;
        const date = dayjs(match.utcDate).format("YYYY-MM-DD");

        if (!grouped[round]) grouped[round] = {};
        if (!grouped[round][date]) grouped[round][date] = [];

        grouped[round][date].push(match);
      });

      // danh sách vòng, mới nhất trước
      const rounds = Object.keys(grouped)
        .map(Number)
        .sort((a, b) => b - a);

      // lấy 3 vòng gần nhất
      const nearest3 = rounds.slice(0, 3);

      // chuẩn hóa dữ liệu để render
      const formatted = nearest3.map((round) => ({
        round,
        days: Object.keys(grouped[round])
          .sort((a, b) => new Date(b) - new Date(a)) // ngày mới nhất trước
          .map((date) => ({
            date,
            matches: grouped[round][date],
          })),
      }));

      setRoundsToShow(formatted);
    } catch (err) {
      console.log("Lỗi khi fetch Matches", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [leagueCode]);

  return (
    <>
      <Helmet>
        <title>
          {`Kết quả bóng đá ${
            leagueTranslations[leagueCode] || leagueCode
          } ${currentYear}/${currentYear + 1} | Thể Thao 247`}
        </title>
      </Helmet>
      <div className="mt-3">
        <span className="fs-4 me-2 fw-bold text-uppercase text-danger">
          Kết quả {leagueTranslations[leagueCode] || leagueCode} hôm nay
        </span>
        <i className="bi bi-chevron-right fs-4 text-primary fw-bold"></i>

        {isLoading ? (
          <p className="mt-3">⏳ Đang tải dữ liệu...</p>
        ) : roundsToShow.length === 0 ? (
          <p className="mt-3 text-muted fst-italic">
            Hiện chưa có dữ kết quả trận đấu cho mùa giải {currentYear}.
          </p>
        ) : (
          roundsToShow.map(({ round, days }) => (
            <div
              key={round}
              className="mt-3 border"
              style={{ borderRadius: "10px" }}
            >
              <div className="fw-bold px-2 py-2 border-bottom bg-light">
                Vòng {round}
              </div>

              {days.map(({ date, matches }) => (
                <div key={date} className="mb-3">
                  <div
                    className="border-bottom "
                    style={{ lineHeight: "35px" }}
                  >
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
                      {/* Trạng thái */}
                      <div
                        className="me-3 text-muted"
                        style={{ width: "40px" }}
                      >
                        {m.status === "FINISHED" ? "FT" : m.status}
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

                        <div className={styles.score}>
                          {m.score.fullTime.home !== null
                            ? m.score.fullTime.home
                            : "-"}{" "}
                          -{" "}
                          {m.score.fullTime.away !== null
                            ? m.score.fullTime.away
                            : "-"}
                        </div>

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
    </>
  );
}

export default Results;
