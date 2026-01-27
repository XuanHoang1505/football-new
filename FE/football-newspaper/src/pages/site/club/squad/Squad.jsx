import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { clubMenu } from "../../../../data/MenuData";
import { ClubService } from "../../../../services/site/ClubService";

import styles from "./Squad.module.scss";
import { Helmet } from "react-helmet-async";

function Squad() {
  const currentYear = new Date().getFullYear();
  const { clubCode } = useParams();

  const [clubData, setClubData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const club = clubMenu.find((c) => c.code === clubCode);
  // Rule mapping: gom các vị trí chi tiết -> nhóm chính
  const positionMapping = {
    Goalkeeper: "Goalkeeper",

    // Defence
    "Centre-Back": "Defence",
    "Left-Back": "Defence",
    "Right-Back": "Defence",
    "Wing-Back": "Defence",
    Defence: "Defence",

    // Midfield
    "Central Midfield": "Midfield",
    "Defensive Midfield": "Midfield",
    "Attacking Midfield": "Midfield",
    Midfield: "Midfield",

    // Offence
    "Centre-Forward": "Offence",
    Striker: "Offence",
    "Left Winger": "Offence",
    "Right Winger": "Offence",
    Forward: "Offence",
    Offence: "Offence",
  };

  // Hàm group theo nhóm chính
  const groupByPosition = (players) => {
    const groups = {
      Goalkeeper: [],
      Defence: [],
      Midfield: [],
      Offence: [],
      Other: [],
    };

    players.forEach((player) => {
      const mapped = positionMapping[player.position] || "Other";
      groups[mapped].push(player);
    });

    return groups;
  };

  // Fetch dữ liệu CLB
  const fetchClubData = async () => {
    try {
      setLoading(true);
      if (!club) {
        console.error("Không tìm thấy club trong menu:", clubCode);
        return;
      }

      const data = await ClubService.getClubDetail(club.id);
      setClubData(data);
    } catch (err) {
      console.error("Lỗi khi fetch thông tin CLB:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubData();
  }, [clubCode]);

  if (loading) {
    return <p className="mt-3">⏳ Đang tải dữ liệu...</p>;
  }

  if (!clubData) {
    return <p>⚠️ Không có dữ liệu câu lạc bộ.</p>;
  }

  const groupedSquad = groupByPosition(clubData.squad);

  return (
    <>
      <Helmet>
        <title>{`Đội hình, danh sách cầu thủ của ${club.name} mùa giải  ${currentYear}/${currentYear+1} | Thể Thao 247`}</title>
      </Helmet>
      <div className="mt-3">
        {/* Tiêu đề */}
        <span className="fs-4 me-2 fw-bold text-uppercase text-danger">
          ĐỘI HÌNH {clubData.name} {currentYear}
        </span>
        <i className="bi bi-chevron-right fs-4 text-primary fw-bold"></i>

        <div className={`${styles.tableWrapper} mt-4`}>
          {/* HLV */}
          <div className={styles.coachCard}>
            <p className={`${styles.sectionTitle}`}># Huấn luyện viên</p>
            <div className={styles.playerRow}>
              <img
                src={clubData.crest}
                alt="Coach"
                className={styles.playerAvatar}
              />
              <span className={styles.playerName}>{clubData.coach?.name}</span>
            </div>
          </div>

          {/* Group cầu thủ */}
          {Object.entries(groupedSquad).map(([position, players]) =>
            players.length > 0 ? (
              <div key={position} className="mt-4">
                <p className={styles.sectionTitle}>
                  {position === "Goalkeeper"
                    ? "# Thủ môn"
                    : position === "Defence"
                    ? "# Hậu vệ"
                    : position === "Midfield"
                    ? "# Tiền vệ"
                    : position === "Offence"
                    ? "# Tiền đạo"
                    : "# Khác"}
                </p>
                {players.map((player, index) => (
                  <Link to={`/player/${player.id}/`}>
                    <div key={player.id} className={styles.playerRow}>
                      <span className={styles.shirtNumber}>{index + 1}</span>
                      <img
                        src={clubData.crest}
                        alt={player.name}
                        className={styles.playerAvatar}
                      />
                      <span className={styles.playerName}>{player.name}</span>
                      <span className={styles.playerNationality}>
                        {player.nationality}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : null
          )}
        </div>
      </div>
    </>
  );
}

export default Squad;
