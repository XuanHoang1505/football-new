import { Container, Row } from "react-bootstrap";

import styles from "./PlayerLayout.module.scss";
import { Link, NavLink, Outlet, useParams } from "react-router-dom";

import {
  mainMenu,
  leagueMenu,
  playerTabs,
  clubMenu,
} from "../../../data/MenuData";


import defenceIcon from "../../../assets/site/images/icons/shield.png";
import strickerIcon from "../../../assets/site/images/icons/ball.png";
import goalkeeperIcon from "../../../assets/site/images/icons/gloves.png";

import { PlayerService } from "../../../services/site/PlayerService";
import { useEffect, useState } from "react";
import { formatDateToDMY } from "../../../utils/formatDate";

function PlayerLayout() {
  const { playerId } = useParams();
  const [playerData, setPlayerData] = useState([]);

  const fetchLeagueData = async () => {
    try {
      const data = await PlayerService.getPlayerDetail(playerId);
      setPlayerData(data);
    } catch (err) {
      console.error("Lỗi khi fetch thông tin giải đấu:", err);
    }
  };
  useEffect(() => {
    fetchLeagueData();
  }, [playerId]);

  const club = clubMenu.find((c) => c.id === playerData?.currentTeam?.id);

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  return (
    <>
      {/* <Container
        className="px-0 w-auto"
        style={{ maxWidth: "1200px", minHeight: "299px" }}
      >
        <div className="zone_ads-1"></div>
      </Container > */}
      <Container
        className="bg-white py-3"
        style={{ maxWidth: "1200px", width: "auto" }}
      >
        <Row>
          <div className="d-flex">
            <div className={`${styles.contentWrapper}`}>
              <Row className="d-flex flex-row">
                <aside className="d-none d-xl-block col-xl-3 d-flex flex-column px-0 border-end">
                  <div className="mb-4">
                    <h6 className="fw-bold px-3 border-bottom pb-2 text-center">
                      TIỆN ÍCH
                    </h6>
                    <ul className="list-unstyled">
                      {mainMenu.map((item) => (
                        <li key={item.path}>
                          <NavLink
                            to={item.path}
                            className={({ isActive }) =>
                              `${
                                styles.navItem
                              } d-flex align-items-center px-3 py-2 text-decoration-none fw-light ${
                                isActive ? styles.active : "text-black"
                              }`
                            }
                          >
                            <span className="me-3">{item.icon}</span>
                            {item.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h6 className="fw-bold px-3 border-bottom pb-2 text-center">
                      GIẢI ĐẤU NỔI BẬT
                    </h6>
                    <ul className="list-unstyled">
                      {leagueMenu.map((league) => (
                        <li key={league.path}>
                          <NavLink
                            to={`/football/${league.path}`}
                            className={({ isActive }) =>
                              `${
                                styles.navItem
                              } d-flex align-items-center px-3 py-2 text-decoration-none fw-light ${
                                isActive ? styles.active : "text-black"
                              }`
                            }
                          >
                            <img
                              src={league.icon}
                              alt={league.label}
                              width={18}
                              height={18}
                              className="me-3"
                            />
                            {league.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                </aside>

                <main className="col-12 col-lg-12 col-xl-9">
                  <div className={`${styles.caption} mb-4`}>Cầu thủ</div>
                  {playerData && (
                    <div className={styles.boxLeagueInfo}>
                      <div className={styles.logo}>
                        <img
                          className="lazy"
                          src={
                            playerData.position === "Defence"
                              ? defenceIcon
                              : playerData.position === "Goalkeeper"
                              ? goalkeeperIcon
                              : strickerIcon
                          }
                          alt={playerData.name}
                          width={100}
                          height={100}
                        />
                      </div>
                      <div className={styles.content}>
                        <ul className="flex-grow-1" style={{ listStyle: "none" }} >
                          <li>
                            <p className="text-uppercase fw-bold text-black">
                              {playerData.name}
                            </p>
                          </li>
                          <li className="mt-3">
                            <p className="text-black">Vị trí: </p>
                            <div className="fw-bold ms-2 text-black">
                              {" "}
                              {playerData.section} ({playerData.position})
                            </div>
                          </li>
                          <li>
                            <p className="text-black">Tuổi:</p>
                            <p className="ms-2 fw-bold text-black">
                              {calculateAge(playerData.dateOfBirth)} (
                              {formatDateToDMY(playerData.dateOfBirth)})
                            </p>
                          </li>
                        </ul>
                        {club && (
                          <div className="d-flex flex-column justify-content-center align-items-center ">
                            <div className={styles.clubLogo}>
                              <Link to={`/club/${club.code}/`}>
                                <img
                                  src={playerData?.currentTeam?.crest}
                                  alt={playerData?.currentTeam?.name}
                                  width={60}
                                />
                              </Link>
                            </div>
                            <strong style={{fontSize:"12px"}}>{playerData?.currentTeam?.name}</strong>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  <div className={styles.tabsWrapper}>
                    <ul className="d-flex justify-content-between list-unstyled m-0 p-0 border-top">
                      {playerTabs.map((tab) => (
                        <li key={tab.key} className={styles.tabItem}>
                          <NavLink
                            to={`/player/${playerId}/${tab.path}`}
                            end={tab.path === ""}
                            className={({ isActive }) =>
                              `${styles.tabLink} ${
                                isActive ? styles.active : ""
                              }`
                            }
                          >
                            {tab.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Outlet />
                </main>
              </Row>
            </div>
          </div>
        </Row>
      </Container>
    </>
  );
}

export default PlayerLayout;
