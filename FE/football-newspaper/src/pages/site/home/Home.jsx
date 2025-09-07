import { NavLink } from "react-router-dom";
import Sidebar from "../../../components/site/appSidebar/Sidebar";
import styles from "./Home.module.scss";
import AppRank from "../../../components/site/appRank/AppRank";
import AppMatches from "../../../components/site/appMatches/AppMatches";

import { clubMenu } from "../../../data/MenuData";
const Home = () => {
  

  return (
    <div className={styles.container}>
      <div className={styles.list_item}>
        {clubMenu.map((club, index) => (
          <NavLink className={styles.item} to={`/club/${club.url}`} key={index}>
            <img src={club.logo} alt={club.name} className={styles.logo} />
            <span className={styles.name}>{club.name}</span>
          </NavLink>
        ))}
      </div>

      <div className="row">
        <div className="col-2">
          <Sidebar />
        </div>
        <div className="col-7"></div>
        <div className="col-3"></div>
      </div>

      <div className="row mt-3">
        <div className="col-8">
          <AppMatches />
        </div>
        <div className="col-4">
          <AppRank />
        </div>
      </div>
    </div>
  );
};

export default Home;
