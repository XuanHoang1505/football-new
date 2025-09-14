import styles from "./Sidebar.module.scss";
import { NavLink } from "react-router-dom";

import { mainMenu, leagueMenu } from "../../../data/MenuData";
const Sidebar = () => {

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
              to={`/football/${item.path}`}
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
