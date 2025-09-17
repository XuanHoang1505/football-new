import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { PlayerService } from "../../../../services/site/PlayerService";
import footballLogo from "../../../../assets/site/images/footballLogo.jpg";

import styles from "./PlayerCareer.module.scss";
import { Spinner } from "react-bootstrap";

function PlayerCareer() {
  const { playerId } = useParams();
  const [career, setCareer] = useState([]);
  const [playerInfo, setPlayerInfo] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchPlayerCareer = async () => {
    try {
      setLoading(true);
      const data = await PlayerService.getPlayerCareer(playerId);
      setCareer(data);
    } catch (error) {
      console.log("lỗi khi fetch career", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlayerData = async () => {
    try {
      const data = await PlayerService.getPlayerDetail(playerId);
      setPlayerInfo(data);
    } catch (err) {
      console.error("Lỗi khi fetch thông tin giải đấu:", err);
    }
  };

  useEffect(() => {
    fetchPlayerData();
    fetchPlayerCareer();
  }, [playerId]);

  return (
    <>
      <Helmet>
        <title>
          {`Sự nghiệp của ${playerInfo?.name || "Cầu thủ"} | Thể Thao 247`}
        </title>
      </Helmet>

      <div className="mt-3">
        <span className="fs-4 me-2 fw-bold text-uppercase text-danger">
          Sự nghiệp và danh hiệu của {playerInfo?.name}
        </span>
        <i className="bi bi-chevron-right fs-4 text-primary fw-bold"></i>

        {loading ? (
          <div className="w-100 h-100 d-flex justify-content-center align-items-center">
            <Spinner animation="border" className="text-primary" />
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.careerTable}>
              <thead>
                <tr>
                  <th>Mùa giải</th>
                  <th>Đội bóng</th>
                  <th>Giải đấu</th>
                  <th>Số trận</th>
                  <th>Thắng</th>
                  <th>Hòa</th>
                  <th>Thua</th>
                </tr>
              </thead>
              <tbody>
                {career.map((t, index) => (
                  <tr key={index}>
                    <td>{t.season}</td>
                    <td>
                      {
                        <div className="text-start">
                          <img
                            className={styles.clubLogo}
                            src={t.crest || footballLogo}
                            alt=""
                          />
                          <span className="fw-bold">{t.name}</span>
                        </div>
                      }
                    </td>
                    <td>{t.competition}</td>
                    <td>{t.matches}</td>
                    <td>{t.wins}</td>
                    <td>{t.draws}</td>
                    <td>{t.losses}</td>
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

export default PlayerCareer;
