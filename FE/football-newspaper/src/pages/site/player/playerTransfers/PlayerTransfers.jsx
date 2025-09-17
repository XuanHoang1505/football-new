import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PlayerService } from "../../../../services/site/PlayerService";
import styles from "./PlayerTransfers.module.scss";
import footballLogo from "../../../../assets/site/images/footballLogo.png";
import { Helmet } from "react-helmet-async";
import { Spinner } from "react-bootstrap";

function PlayerTransfers() {
  const { playerId } = useParams();
  const [transfers, setTransfers] = useState([]);
  const [playerInfo, setPlayerInfo] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchTransfersByPlayer = async () => {
    try {
      const data = await PlayerService.getPlayerTransfers(playerId);
      const transfersData = data.response || [];

      // Nếu API có trả player info thì lấy
      if (data.player) {
        setPlayerInfo(data.player);
      }

      // Sắp xếp theo ngày giảm dần
      const sortedTransfers = [...transfersData].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      // Lấy 30 thương vụ gần nhất
      setTransfers(sortedTransfers.slice(0, 30));
    } catch (error) {
      console.error("Lỗi khi fetch Transfers", error);
    } finally {
      setLoading(false);
    }
  };

  const getTransferTypeVN = (type) => {
    if (!type) return "Không rõ";
    const lower = type.toLowerCase();

    if (lower.includes("loan")) return "Cho mượn";
    if (lower.includes("free")) return "Cầu thủ tự do";
    if (lower.includes("transfer")) return "Chuyển nhượng";
    if (/^\d/.test(type) || type.startsWith("€") || type.startsWith("$")) {
      return "Chuyển nhượng";
    }
    if (lower === "n/a") return "Không rõ";

    return type;
  };

  useEffect(() => {
    fetchTransfersByPlayer();
  }, [playerId]);

  return (
    <>
      <Helmet>
        <title>
          {`Lịch sử chuyển nhượng của ${
            playerInfo?.name || "Cầu thủ"
          } | Thể Thao 247`}
        </title>
      </Helmet>

      <div className="mt-3">
        <span className="fs-4 me-2 fw-bold text-uppercase text-danger">
          LỊCH SỬ CHUYỂN NHƯỢNG {playerInfo?.name}
        </span>
        <i className="bi bi-chevron-right fs-4 text-primary fw-bold"></i>

        {loading ? (
          <div className="w-100 h-100 d-flex justify-content-center align-items-center">
            <Spinner animation="border" className="text-primary" />
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.transfersTable}>
              <thead>
                <tr>
                  <th>Ngày</th>
                  <th>Từ</th>
                  <th>Loại</th>
                  <th>Đến</th>
                </tr>
              </thead>
              <tbody>
                {transfers.map((t, index) => (
                  <tr key={index}>
                    <td>{new Date(t.date).toLocaleDateString("vi-VN")}</td>

                    {/* Câu lạc bộ cũ */}
                    <td>
                      {t.teams?.out && (
                        <div className="text-start">
                          <img
                            className={styles.clubLogo}
                            src={t.teams.out.logo || footballLogo}
                            alt=""
                          />
                          <span className="fw-bold">{t.teams.out.name}</span>
                        </div>
                      )}
                    </td>

                    {/* Loại chuyển nhượng */}
                    <td>
                      <span
                        className={`${styles.transferType} ${
                          getTransferTypeVN(t.type) === "Cho mượn"
                            ? styles.loan
                            : getTransferTypeVN(t.type) === "Cầu thủ tự do"
                            ? styles.free
                            : getTransferTypeVN(t.type) === "Chuyển nhượng"
                            ? styles.transfer
                            : styles.unknown
                        }`}
                      >
                        {getTransferTypeVN(t.type)}
                      </span>
                    </td>

                    {/* Câu lạc bộ mới */}
                    <td>
                      {t.teams?.in && (
                        <div className="text-start">
                          <img
                            className={styles.clubLogo}
                            src={t.teams.in.logo || footballLogo}
                            alt=""
                          />
                          <span className="fw-bold">{t.teams.in.name}</span>
                        </div>
                      )}
                    </td>
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

export default PlayerTransfers;
