import React, { useEffect, useState } from "react";
import styles from "./AppMatches.module.scss";
import { FootballService } from "../../../services/site/FootballService";

const AppMatches = () => {
  const leagues = [
    { code: "PL", name: "Ngoại hạng Anh" },
    { code: "SA", name: "Serie A" },
    { code: "BL1", name: "Bundesliga" },
  ];

  const currentYear = new Date().getFullYear();
  const [allMatches, setAllMatches] = useState([]);

  const fetchAllMatches = async () => {
    try {
      const now = new Date();

      // Tính tuần hiện tại
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Thứ 2
      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6); // Chủ nhật
      endOfWeek.setHours(23, 59, 59, 999);

      // Call nhiều API cùng lúc
      const results = await Promise.all(
        leagues.map((lg) => FootballService.getMatches(lg.code, currentYear))
      );

      // Chuẩn hóa dữ liệu
      const formatted = results.map((res, idx) => {
        const filtered = res.matches.filter((match) => {
          const matchDate = new Date(match.utcDate);
          return (
            matchDate >= now &&
            matchDate >= startOfWeek &&
            matchDate <= endOfWeek
          );
        });
        return { code: leagues[idx].code, name: leagues[idx].name, matches: filtered };
      });

      setAllMatches(formatted);
    } catch (err) {
      console.error("Lỗi khi fetch tất cả giải đấu:", err);
    }
  };

  useEffect(() => {
    fetchAllMatches();
  }, []);

  return (
    <div className={styles.container}>
      <p className={styles.title}>Lịch thi đấu bóng đá</p>

      <div className={styles.matchesWrapper}>
      {allMatches.map((league) => (
        <div key={league.code} className={styles.match}>
          <p className={styles.matchName}>{league.name}</p>

          {league.matches.length === 0 ? (
            <p>Không có trận nào trong tuần này</p>
          ) : (
            league.matches.map((match) => (
              <div key={match.id} className={styles.matches}>
                <p className={styles.matchTime}>
                  {new Date(match.utcDate).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                  })}
                </p>

                <div className={styles.matchContent}>
                  <div className={styles.teamName}>
                    <p>{match.homeTeam?.shortName}</p>
                  </div>

                  {match.homeTeam?.crest && (
                    <img
                      src={match.homeTeam.crest}
                      alt={match.homeTeam.name}
                      className={styles.teamLogo}
                    />
                  )}

                  <span className={styles.matchHour}>
                    {new Date(match.utcDate).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>

                  {match.awayTeam?.crest && (
                    <img
                      src={match.awayTeam.crest}
                      alt={match.awayTeam.name}
                      className={styles.teamLogo}
                    />
                  )}

                  <div className={styles.teamName2}>
                    <p>{match.awayTeam?.shortName}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ))}
      </div>
    </div>
  );
};

export default AppMatches;
