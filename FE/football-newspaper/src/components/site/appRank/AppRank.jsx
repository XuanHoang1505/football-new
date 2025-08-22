import styles from "./AppRank.module.scss";

const AppRank = () => {
  return (
    <div className={styles.container}>
      <div className={styles.tableWrapper}>
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
            <tr>
              <td>1 Manchester City</td>
              <td>1</td>
              <td>1</td>
              <td>1</td>
              <td>1</td>
              <td>1</td>
              <td>1</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppRank;
