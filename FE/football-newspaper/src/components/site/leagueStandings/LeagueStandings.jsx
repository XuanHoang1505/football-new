import { useEffect, useState } from "react";
import styles from "./LeagueStandings.module.scss";
import { FootballService } from "../../../services/site/FootballService";
import { Spinner } from "react-bootstrap";

function LeagueStandings({ leagueCode, isFullWidth = true, clubId = null }) {
  const [standingsData, setStandingsData] = useState([]);
  const currentYear = new Date().getFullYear();

  const [loading, setLoading] = useState(true);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const data = await FootballService.getStandings(leagueCode, currentYear);

      setStandingsData(data.standings[0].table);
    } catch (err) {
      console.log("Lỗi khi fetch BXH", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [leagueCode]);
  console.log(clubId);
  

  const leagueRules = {
    PL: { c1: [1, 4], c2: [5, 5], conference: [6, 6], relegation: [18, 20] },
    PD: { c1: [1, 4], c2: [5, 6], conference: [7, 7], relegation: [18, 20] },
    SA: { c1: [1, 4], c2: [5, 6], conference: [7, 7], relegation: [18, 20] },
    BL1: { c1: [1, 4], c2: [5, 5], conference: [6, 6], relegation: [16, 18] },
    FL1: { c1: [1, 3], c2: [4, 4], conference: [5, 5], relegation: [18, 20] },
  };

  function getTeamClass(leagueCode, position) {
    const rule = leagueRules[leagueCode];
    if (!rule) return "";

    if (position >= rule.c1[0] && position <= rule.c1[1]) return styles.c1;
    if (position >= rule.c2[0] && position <= rule.c2[1]) return styles.c2;
    if (position >= rule.conference[0] && position <= rule.conference[1])
      return styles.conference;
    if (position >= rule.relegation[0] && position <= rule.relegation[1])
      return styles.relegation;

    return "";
  }
  const notes = [
    {
      color: "#004682",
      text: "Lọt vào (cúp quốc tế) - Champions League (Giai đoạn giải đấu: )",
    },
    {
      color: "#7F0029",
      text: "Lọt vào (cúp quốc tế) - Europa League (Giai đoạn giải đấu: )",
    },
    {
      color: "#B8860B",
      text: "Lọt vào (cúp quốc tế) - Conference League (Vòng loại: )",
    },
    {
      color: "#BD0000",
      text: "Rớt hạng ",
    },
  ];
  return (
    <>
      {loading ? (
        <div className="w-100 h-100 d-flex justify-content-center align-items-center">
          <Spinner animation="border" className="text-primary" />
        </div>
      ) : (
        <>
          <div className={styles.tableWrapper}>
            <table
              className={`${styles.rankTable} ${
                isFullWidth ? styles.fullWidth : styles.compact
              }`}
            >
              <thead>
                <tr>
                  <th className={styles.th_team}>Main</th>
                  <th>TR</th>
                  <th>T</th>
                  <th>H</th>
                  <th>B</th>
                  {isFullWidth && (
                    <>
                      <th>BT</th>
                      <th>BB</th>
                    </>
                  )}
                  <th>HS</th>
                  <th>Đ</th>
                </tr>
              </thead>
              <tbody>
                {standingsData.map((team) => (
                  <tr key={team.team.id}  className={`${clubId === team.team.id ? styles.active : ""}`}>
                    <td className={styles.th_team}>
                      <span
                        className={`${styles.rankNumber} ${getTeamClass(
                          leagueCode,
                          team.position
                        )}`}
                      >
                        {team.position}
                      </span>
                      <img
                        src={team.team.crest}
                        alt={team.team.shortName}
                        width={21}
                        height={21}
                        className="me-2"
                      />
                      <strong style={{ color: "#254892", fontSize: "13px" }}>
                        {team.team.shortName}
                      </strong>
                    </td>
                    <td>{team.playedGames}</td>
                    <td>{team.won}</td>
                    <td>{team.draw}</td>
                    <td>{team.lost}</td>
                    {isFullWidth && (
                      <>
                        <td>{team.goalsFor}</td>
                        <td>{team.goalsAgainst}</td>
                      </>
                    )}
                    <td>{team.goalDifference}</td>
                    <td>{team.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={`${styles.legend} mt-3`}>
            <div
              style={{
                borderRadius: "8px",
                backgroundColor: "#E5E5E5",
                padding: "10px 15px",
                display: "inline-block",
              }}
            >
              {notes.map((note, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "6px",
                  }}
                >
                  <span
                    style={{
                      width: "14px",
                      height: "14px",
                      borderRadius: "50%",
                      backgroundColor: note.color,
                      display: "inline-block",
                      marginRight: "8px",
                    }}
                  ></span>
                  <span style={{ fontSize: "13px", color: "#333" }}>
                    {note.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default LeagueStandings;
