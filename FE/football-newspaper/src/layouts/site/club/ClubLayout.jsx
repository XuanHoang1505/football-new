import { Container, Row } from "react-bootstrap";

import styles from "./ClubLayout.module.scss";
import { NavLink, Outlet, useParams } from "react-router-dom";

import { mainMenu, clubMenu, clubTabs } from "../../../data/MenuData";
import { areaTranslations } from "../../../data/VnTransLeague";

import { ClubService } from "../../../services/site/ClubService";
import { useEffect, useState } from "react";

function ClubLayout() {
  const { clubCode } = useParams();
  const [clubData, setClubData] = useState([]);

  const fetchClubData = async () => {
    try {
       const club = clubMenu.find(c => c.code === clubCode);
      if (!club) {
        console.error("Không tìm thấy club trong menu:", clubCode);
        return;
      }

      const data = await ClubService.getClubDetail(club.id); 
      setClubData(data);
    } catch (err) {
      console.error("Lỗi khi fetch thông tin giải đấu:", err);
    }
  };
  useEffect(() => {
    fetchClubData();
  }, [clubCode]);

  
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
                      CÂU LẠC BỘ NỔI BẬT
                    </h6>
                    <ul className="list-unstyled">
                      {clubMenu.map((club) => (
                        <li key={club.url}>
                          <NavLink
                            to={`/club/${club.url}`}
                            className={({ isActive }) =>
                              `${
                                styles.navItem
                              } d-flex align-items-center px-3 py-2 text-decoration-none fw-light ${
                                isActive ? styles.active : "text-black"
                              }`
                            }
                          >
                            <img
                              src={club.logo}
                              alt={club.name}
                              width={18}
                              height={18}
                              className="me-3"
                            />
                            {club.name}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                </aside>

                <main className="col-12 col-lg-12 col-xl-9">
                  <div className={`${styles.caption} mb-4`}>Câu lạc bộ</div>
                  {clubData && (
                    <div className={styles.boxClubInfo}>
                      <div className={styles.logo}>
                        <img
                          className="lazy"
                          src={
                            clubData.crest ||
                            "https://mediares.thethao247.vn/res/image/data/zNgMnejD-ppeQpVoc.png"
                          }
                          alt={clubData.name}
                          width={100}
                          height={100}
                        />
                      </div>
                      <div className={styles.content}>
                        <h5 className="ms-3 fw-bold text-uppercase">{clubData.name}</h5>
                        <div className="d-flex ms-3">                   
                            <p>Khu vực:</p>
                            <div>
                              <a
                                href={`#`}
                                style={{ textTransform: "capitalize" }}
                                className="px-3"
                              >
                                {areaTranslations[clubData.area?.name] ||
                                  clubData.area?.name}
                              </a>
                            </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className={styles.tabsWrapper}>
                    <ul className="d-flex justify-content-between list-unstyled m-0 p-0 border-top">
                      {clubTabs.map((tab) => (
                        <li key={tab.key} className={styles.tabItem}>
                          <NavLink
                            to={`/club/${clubCode}/${tab.path}`}
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

export default ClubLayout;
