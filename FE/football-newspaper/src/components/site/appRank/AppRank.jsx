import styles from "./AppRank.module.scss";
import { useStandings } from "../../../hooks/useFootballData";

const AppRank = () => {
  const currentYear = new Date().getFullYear();

  const { data, isLoading, isError } = useStandings("PL", currentYear);

  if (isError) return <p>Lỗi khi tải BXH</p>;

  const top6 = data?.standings?.[0]?.table?.slice(0, 6) || [];

  return (
    <div className={styles.container}>
      <div className={styles.tableWrapper}>
        <p className={styles.title}>BXH Ngoại hạng Anh</p>
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
            {isLoading ? (
              <tr>
                <td>
                  <p>Đang tải BXH...</p>
                </td>
              </tr>
            ) : (
              top6.map((team) => (
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppRank;
