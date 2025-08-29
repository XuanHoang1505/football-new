import { NavLink } from "react-router-dom";
import Sidebar from "../../../components/site/appSidebar/Sidebar";
import styles from "./Home.module.scss";
import AppRank from "../../../components/site/appRank/AppRank"
const Home = () => {
  const listClub = [
    {
      name: "MU",
      logo: "https://mediares.thethao247.vn/res/image/data/nwSRlyWg-h2pPXz3k.png",
      url: "/manchester-united",
    },
    {
      name: "Liverpool",
      logo: "https://mediares.thethao247.vn/res/image/data/Gr0cGteM-KCp4zq5F.png",
      url: "/liverpool",
    },
    {
      name: "Arsenal",
      logo: "https://mediares.thethao247.vn/res/image/data/pfchdCg5-vcNAdtF9.png",
      url: "/arsenal",
    },
    {
      name: "Man City",
      logo: "https://mediares.thethao247.vn/res/image/data/UXcqj7HG-lQuhqN8N.png",
      url: "/manchester-city",
    },
    {
      name: "Chelsea",
      logo: "https://mediares.thethao247.vn/res/image/data/GMmvDEdM-IROrZEJb.png",
      url: "/chelsea",
    },
    {
      name: "Barcelona",
      logo: "https://mediares.thethao247.vn/res/image/data/8dhw5vxS-fcDVLdrL.png",
      url: "/barcelona",
    },
    {
      name: "Real Madrid",
      logo: "https://mediares.thethao247.vn/res/image/data/A7kHoxZA-fcDVLdrL.png",
      url: "/real-madrid",
    },
  ];


  return (
    <div className="container px-5">
      <div className={styles.list_item}>
        {listClub.map((club, index) => (
          <NavLink className={styles.item} to={club.url} key={index}>
            <img src={club.logo} alt={club.name} className={styles.logo} />
            <span className={styles.name}>{club.name}</span>
          </NavLink>
        ))}
      </div>
      <div className="row">
        <div className="col-2">
          <Sidebar/>
        </div>
        <div className="col-7">
        </div>
        <div className="col-3"></div>
      </div>
      <div className="row mt-3">
        <div className="col-8"></div>
        <div className="col-4">
          <AppRank />
        </div>
      </div>
    </div>
  );
};
export default Home;
