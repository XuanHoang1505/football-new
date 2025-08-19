import styles from "./Sidebar.module.scss";
import { NavLink } from "react-router-dom";
import {
  BsLightningFill,
  BsCameraVideo,
  BsCalendarEvent,
  BsTrophy,
  BsTable,
  BsBroadcast,
} from "react-icons/bs";
import { FaFutbol } from "react-icons/fa";
const Sidebar = () => {
  const mainMenu = [
    { label: "Latest", path: "/latest", icon: <BsLightningFill /> },
    { label: "Video", path: "/video", icon: <BsCameraVideo /> },
    { label: "Livescore", path: "/livescore", icon: <FaFutbol /> },
    { label: "Lịch thi đấu", path: "/lich-thi-dau", icon: <BsCalendarEvent /> },
    { label: "Kết quả", path: "/ket-qua", icon: <BsTrophy /> },
    { label: "BXH", path: "/bxh", icon: <BsTable /> },
    { label: "Trực tiếp", path: "/truc-tiep", icon: <BsBroadcast /> },
  ];

  const leagueMenu = [
    {
      label: "V.League 1",
      path: "/vleague",
      icon: "https://mediares.thethao247.vn/res/image/data/xpaWkCiU-2iUIBqTc.png",
    },
    {
      label: "Cúp C1",
      path: "/cup-c1",
      icon: "https://mediares.thethao247.vn/res/image/data/YaCIsrjD-ragmsdpt.png",
    },
    {
      label: "Ngoại hạng Anh",
      path: "/premier-league",
      icon: "https://cdn-img.thethao247.vn/storage/files/hoan106/2023/10/11/prlogo2-1696993839.jpeg",
    },
    {
      label: "La Liga",
      path: "/la-liga",
      icon: "	https://mediares.thethao247.vn/res/image/data/8tslw3T1-baecXIX8.png",
    },
    {
      label: "Ligue 1",
      path: "/ligue-1",
      icon: "	https://mediares.thethao247.vn/res/image/data/EeVwWyWI-Qih5KUIb.png",
    },
    {
      label: "Bundesliga",
      path: "/bundesliga",
      icon: "https://mediares.thethao247.vn/res/image/data/ddvweuSp-tG6tnjVM.png",
    },
    {
      label: "Serie A",
      path: "/serie-a",
      icon: "https://mediares.thethao247.vn/res/image/data/pv8pwbmd-ULj8sFKt.png",
    },
    {
      label: "World Cup 2026",
      path: "/world-cup-2026",
      icon: "	https://cdn-img.thethao247.vn/storage/files/SyNguyen/2024/03/21/65fc179521964.jpg",
    },
    {
      label: "C1 Châu Á",
      path: "/c1-chau-a",
      icon: "	https://cdn-img.thethao247.vn/storage/files/SyNguyen/2024/03/21/65fc179521964.jpg",
    },
    {
      label: "Saudi Pro",
      path: "/saudi-pro",
      icon: "	https://mediares.thethao247.vn/res/image/data/ziaSnuU1-O2zulDZO.png",
    },
    {
      label: "Asian Cup",
      path: "/asian-cup",
      icon: "	https://mediares.thethao247.vn/res/image/data/pEhdGO9j-fJY7yogh.png",
    },
    {
      label: "U23 Châu Á",
      path: "/u23-chau-a",
      icon: "	https://mediares.thethao247.vn/res/image/data/GhHXu597-nDJ4YAff.png",
    },
    {
      label: "MLS",
      path: "/mls",
      icon: "	https://mediares.thethao247.vn/res/image/data/UcfmORjD-SnDeBFHH.png",
    },
    {
      label: "Vô địch quốc gia nữ",
      path: "/nu",
      icon: "https://mediares.thethao247.vn/res/image/data/Uywp4FjD-v9B9vL2k.png",
    },
  ];
  return (
    <div className={styles.sidebar}>
      <ul className={styles.menuList}>
        {mainMenu.map((item, idx) => (
          <li key={idx} className={styles.menuItem}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                isActive
                  ? `${styles.menuLink} ${styles.active}`
                  : styles.menuLink
              }
            >
              <span className={styles.icon}>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      <ul className={`${styles.menuList} ${styles.leagueMenu}`}>
        {leagueMenu.map((item, idx) => (
          <li key={idx} className={styles.menuItem}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                isActive
                  ? `${styles.menuLink} ${styles.active}`
                  : styles.menuLink
              }
            >
              <span className={styles.icon}>
                <img src={item.icon} alt={item.label} />
              </span>
              <span className="fw-bold">{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
