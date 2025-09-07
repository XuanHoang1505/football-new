import { Container, Row } from "react-bootstrap";

import styles from "./FootballLayout.module.scss";
import { NavLink, Outlet, useParams } from "react-router-dom";

import { mainMenu, leagueMenu, leagueTabs } from "../../../data/MenuData";
import { leagueTranslations, areaTranslations } from "../../../data/VnTransLeague";

import { FootballService } from "../../../services/site/FootballService";
import { useEffect, useState } from "react";

function FootballLayout() {
  const { leagueCode } = useParams();
  const [leagueData, setLeagueData] = useState([]);

  const fetchLeagueData = async () => {
    try {
      const data = await FootballService.getCompetitionDetail(leagueCode);
      setLeagueData(data);
    } catch (err) {
      console.error("Lỗi khi fetch thông tin giải đấu:", err);
    }
  };
  useEffect(() => {
    fetchLeagueData();
  }, [leagueCode]);

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
                  <div className={`${styles.caption} mb-4`}>Giải đấu</div>
                  {leagueData && (
                    <div className={styles.boxLeagueInfo}>
                      <div className={styles.logo}>
                        <img
                          className="lazy"
                          src={
                            leagueData.emblem ||
                            "https://mediares.thethao247.vn/res/image/data/zNgMnejD-ppeQpVoc.png"
                          }
                          alt={leagueData.name}
                          width={100}
                          height={100}
                        />
                      </div>
                      <div className={styles.content}>
                        <ul style={{ listStyle: "none" }}>
                          <li>
                            <p className="text-uppercase fw-bold">
                              {leagueTranslations[leagueData.code] ||
                                leagueData.name}
                            </p>
                          </li>
                          <li>
                            <p>Khu vực:</p>
                            <div>
                              <a
                                href={`https://thethao247.vn/livescores/${leagueData.area?.code?.toLowerCase()}/`}
                                style={{ textTransform: "capitalize" }}
                                className="px-3"
                              >
                                {areaTranslations[leagueData.area?.name] ||
                                  leagueData.area?.name}
                              </a>
                            </div>
                          </li>
                          <li>
                            <p>Mùa giải:</p>
                            <p className="px-3 fw-bold">
                              {leagueData.currentSeason
                                ? `${new Date(
                                    leagueData.currentSeason.startDate
                                  ).getFullYear()}/${new Date(
                                    leagueData.currentSeason.endDate
                                  ).getFullYear()}`
                                : "N/A"}
                            </p>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                  <div className={styles.tabsWrapper}>
                    <ul className="d-flex justify-content-between list-unstyled m-0 p-0 border-top">
                      {leagueTabs.map((tab) => (
                        <li key={tab.key} className={styles.tabItem}>
                          <NavLink
                            to={`/football/${leagueCode}/${tab.path}`}
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
                  {/* Nơi nội dung được render */}
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

export default FootballLayout;
