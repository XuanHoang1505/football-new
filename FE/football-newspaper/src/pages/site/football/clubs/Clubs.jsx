import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { FootballService } from "../../../../services/site/FootballService";
import { leagueTranslations } from "../../../../data/VnTransLeague";

import styles from "./Clubs.module.scss";
import { Helmet } from "react-helmet-async";

function Clubs() {
  const { leagueCode } = useParams();
  const currentYear = new Date().getFullYear();

  const [clubsData, setClubsData] = useState([]);
  const [loading, setLoading] = useState(true);

  const isCupCompetition = (code) => {
    const cupCodes = ["CL", "WC", "EC", "CDR", "FAC", "COPA"]; 
    return cupCodes.includes(code.toUpperCase());
  };

  const fetchClubs = async () => {
    try {
      setLoading(true);
      let data;

      if (isCupCompetition(leagueCode)) {
        data = await FootballService.getTeams(leagueCode, currentYear);
        setClubsData(
          data.teams.map((team, index) => ({
            id: team.id,
            position: index + 1, 
            crest: team.crest,
            shortName: team.shortName,
          }))
        );
      } else {
        data = await FootballService.getStandings(leagueCode, currentYear);
        setClubsData(
          data.standings[0].table.map((team) => ({
            id: team.team.id,
            position: team.position,
            crest: team.team.crest,
            shortName: team.team.shortName,
          }))
        );
      }
    } catch (err) {
      console.log("Lỗi khi fetch clubs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, [leagueCode]);

  return (
    <>
    <Helmet>
        <title>
          {`Danh sách câu lạc bộ ${
            leagueTranslations[leagueCode] || leagueCode
          } ${currentYear}/${currentYear + 1} | Thể Thao 247` }
        </title>
      </Helmet>
      <div className="mt-3">
        <span className="fs-4 me-2 fw-bold text-uppercase text-danger">
          {leagueTranslations[leagueCode] || leagueCode} - Danh sách Câu lạc bộ
        </span>
        <i className="bi bi-chevron-right fs-4 text-primary fw-bold"></i>
  
        {loading ? (
          <p className="mt-3">⏳ Đang tải dữ liệu...</p>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.clubsTable}>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Logo</th>
                  <th>Tên CLB</th>
                </tr>
              </thead>
              <tbody>
                {clubsData.map((team) => (
                  <tr key={team.id}>
                    <td className={styles.position}>{team.position}</td>
                    <td>
                      <img
                        className={styles.clubLogo}
                        src={team.crest}
                        alt={team.shortName}
                      />
                    </td>
                    <td className={styles.clubName}>{team.shortName}</td>
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

export default Clubs;
