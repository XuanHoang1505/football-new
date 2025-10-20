import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ClubService } from "../../../../services/site/ClubService";
import { clubMenu } from "../../../../data/MenuData";
import styles from "./Transfers.module.scss";
import footballLogo from "../../../../assets/site/images/footballLogo.png";
import { Helmet } from "react-helmet-async";

function Transfers() {
  const { clubCode } = useParams();
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const club = clubMenu.find((c) => c.code === clubCode);

  const fetchTransfersByClub = async () => {
    try {
      const data = await ClubService.getClubTransfers(club.apiId);

      let allTransfers = [];
      data.forEach((item) => {
        item.transfers.forEach((t) => {
          // xác định đội đối tác (không phải đội chính)
          let otherTeam = null;
          if (t.teams?.in?.id !== club.apiId) {
            otherTeam = t.teams?.in;
          } else if (t.teams?.out?.id !== club.apiId) {
            otherTeam = t.teams?.out;
          }

          allTransfers.push({
            date: t.date,
            type: t.type,
            playerName: item.player.name,
            otherTeam,
            direction: t.teams?.in?.id === club.apiId ? "Đến" : "Đi",
          });
        });
      });

      // Sắp xếp theo ngày mới nhất
      allTransfers.sort((a, b) => new Date(b.date) - new Date(a.date));

      // Lấy 30 thương vụ gần nhất
      setTransfers(allTransfers.slice(0, 30));
    } catch (error) {
      console.log("Lỗi khi fetch Transfers", error);
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
    fetchTransfersByClub();
  }, [clubCode]);

  return (
    <>
      <Helmet>
        <title>{`Tin tức & danh sách chuyển nhượng của ${club.name} ${new Date().getFullYear()} | Thể Thao 247`}</title>
      </Helmet>
      <div className="mt-3">
        <span className="fs-4 me-2 fw-bold text-uppercase text-danger">
          CHUYỂN NHƯỢNG {club.name} {new Date().getFullYear()}
        </span>
        <i className="bi bi-chevron-right fs-4 text-primary fw-bold"></i>

        {loading ? (
          <p className="mt-3">⏳ Đang tải dữ liệu...</p>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.transfersTable}>
              <thead>
                <tr>
                  <th>Ngày</th>
                  <th>Cầu thủ</th>
                  <th>Loại</th>
                  <th>Chiều</th>
                  <th>Từ/Đến</th>
                </tr>
              </thead>
              <tbody>
                {transfers.map((t, index) => (
                  <tr key={index}>
                    <td>{new Date(t.date).toLocaleDateString("vi-VN")}</td>
                    <td className="fw-bold">{t.playerName}</td>
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
                    <td className="text-start">
                      {t.direction === "Đến" ? (
                        <i className="bi bi-arrow-down-circle-fill text-success fs-5"></i>
                      ) : (
                        <i className="bi bi-arrow-up-circle-fill text-danger fs-5"></i>
                      )}
                    </td>
                    <td>
                      {t.otherTeam && (
                        <div className="text-start">
                          <img
                            className={styles.clubLogo}
                            src={t.otherTeam.logo || footballLogo}
                            alt={""}
                          />
                          <span className="fw-bold">{t.otherTeam.name}</span>
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

export default Transfers;
