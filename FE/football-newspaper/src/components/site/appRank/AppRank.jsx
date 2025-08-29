import React, { useEffect, useState } from "react";
import styles from "./AppRank.module.scss";
import { FootballService } from "../../../services/site/FootballService";

const AppRank = () => {
  const [standings, setStandings] = useState([]);
  const currentYear = new Date().getFullYear();


  const fetchStandings = async () => {
    try {
      const res = await FootballService.getStandings("PL", currentYear);
      const top6 = res.standings[0].table.slice(0, 6);
      setStandings(top6);
    } catch (err) {
      console.error("Lỗi khi fetch BXH:", err);
    }
  };
  useEffect(() => {
    fetchStandings();
  }, []);
  

  return (
    <div className={styles.container}>
      <div className={styles.tableWrapper}>
        <p className={styles.title}>bxh ngoại hạng anh</p>
        <table className={styles.rankTable}>
          <thead>
            <tr>
              <th className={styles.th_team}>Main</th>
              <th>TR</th>
              <th>T</th>
              <th>H</th>
              <th>B</th>
              <th>HS</th>
              <th>Đ</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((team) => (
              <tr key={team.team.id}>
                <td className={styles.th_team}>
                  <span className={styles.rankNumber}>{team.position}</span>
                  <strong style={{ color: "#254892" }}>
                    {team.team.shortName}
                  </strong>
                </td>
                <td>{team.playedGames}</td>
                <td>{team.won}</td>
                <td>{team.draw}</td>
                <td>{team.lost}</td>
                <td>{team.goalDifference}</td>
                <td>{team.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppRank;
