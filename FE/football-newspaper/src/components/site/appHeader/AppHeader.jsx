import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import logo from "../../../assets/site/images/logo.png";
import styles from "./AppHeader.module.scss";
import iconQc from "../../../assets/site/images/icons/logo_qc.png";
import iconButChi from "../../../assets/site/images/icons/icon_but_chi.png";
import iconRegister from "../../../assets/site/images/icons/icon_Register.png";
import iconLogin from "../../../assets/site/images/icons/icon_login.png";
import { Modal } from "react-bootstrap";
import AppLogin from "../../../pages/site/auth/appLogin/AppLogin";

const AppHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isFixed, setIsFixed] = useState(false);

  const [show, setShow] = useState(false);
  const [tab, setTab] = useState('login');

  const handleClose = () => setShow(false);

  const handleShowLogin = () => { setTab('login'); setShow(true);};
  const handleShowRegister = () => { setTab('register'); setShow(true); };

  const topHeaderRef = useRef(null);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    const topHeaderHeight = topHeaderRef.current?.offsetHeight || 0;

    const handleScroll = () => {
      if (window.scrollY > topHeaderHeight) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    "lịch thi đấu",
    "u23 châu á",
    "bóng đá việt nam",
    "bóng đá quốc tế",
    "nhận định",
    "chuyển nhượng",
    "thể thao",
    "bóng chuyền",
    "pickleball",
    "xe",
    "esport",
  ];

  const menuData = [
    {
      title: "Bóng đá Việt Nam",
      links: [
        "U23 Đông Nam Á",
        "V-League",
        "Asian Cup 2027",
        "Đội tuyển Quốc gia",
        "U19 Việt Nam",
        "U20 Châu Á",
      ],
    },
    {
      title: "Ngoại hạng Anh",
      links: ["Tin tức", "Lịch thi đấu", "Bảng xếp hạng"],
    },
    {
      title: "Bóng đá quốc tế",
      links: [
        "Ngoại hạng Anh",
        "World Cup 2026",
        "FIFA Club World Cup",
        "Bóng đá Tây Ban Nha - La Liga",
        "Bóng đá Ý - Serie A",
        "Ligue 1",
        "Cúp C1",
        "Các giải khác",
        "Cúp C2 Europa League",
        "Confederations Cup",
      ],
    },
    {
      title: "Serie A",
      links: ["Tin tức", "Lịch thi đấu", "Bảng xếp hạng"],
    },
    {
      title: "Pháp",
      links: ["Tin tức", "Lịch thi đấu", "Bảng xếp hạng"],
    },
    {
      title: "Tiện ích bóng đá",
      tools: [
        { icon: "bi bi-camera-reels fs-5", text: "Livescore" },
        { icon: "bi bi-calendar-week fs-5", text: "Lịch thi đấu" },
        { icon: "bi bi-globe-asia-australia fs-5", text: "Kết quả" },
        { icon: "bi bi-camera-reels fs-5", text: "BXH" },
        { icon: "bi bi-camera-video-fill fs-5", text: "Trực tiếp" },
      ],
    },
  ];

  return (
    <div>

      {/* Hiển thị đăng nhập */}
      <Modal
        show={show}
        onHide={handleClose}
        animation={true}
        centered    
      >
          <AppLogin initialTab={tab} handleClose={handleClose} />
      </Modal>


      <div className={styles.container}>
        <div ref={topHeaderRef} className={styles.top_header}>
          <img className={styles.logo} src={logo} />
          <div className={styles.right}>
            <a href="#">
              <div className={styles.item}>
                <img className={styles.iconQc} src={iconQc} />
                Quảng cáo
              </div>
            </a>
            <a href="#">
              <div className={styles.item}>
                <img className={styles.iconQc} src={iconButChi} />
                Gửi bài
              </div>
            </a>

            <div style={{color: '#254892',fontWeight:'550'}} onClick={handleShowRegister} className={styles.item2} role="button">
              <img className={styles.iconQc} src={iconRegister} alt="Register" />
              Đăng ký
            </div>
            
            <div style={{color: '#254892',fontWeight:'550'}} onClick={handleShowLogin} className={styles.item2} role="button">
              <img className={styles.iconQc} src={iconLogin} alt="login" />
              Đăng nhập
            </div>

          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className={`${styles.navigation} ${isFixed ? styles.fixed : ""}`}>
        <div className={styles.navbar_container}>
          <i
            className={`bi bi-house-door-fill text-light fs-4 ${styles.icon_home}`}
            style={{ cursor: "pointer" }}
          ></i>
          <div className={`${styles.nav_content}`}>
            {menuItems.map((item, idx) => (
              <NavLink
                key={idx}
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? `${styles.nav_item} ${styles.active}`
                    : styles.nav_item
                }
              >
                {item}
              </NavLink>
            ))}
          </div>
          {menuOpen ? (
            <i
              className={`bi bi-x-lg fs-3 text-primary ${styles.icon_toggle}`}
              onClick={toggleMenu}
              style={{ cursor: "pointer" }}
            ></i>
          ) : (
            <i
              className={`bi bi-list fs-3 text-primary ${styles.icon_toggle}`}
              onClick={toggleMenu}
              style={{ cursor: "pointer" }}
            ></i>
          )}
        </div>
      </nav>
      <div
        className={`${styles.menuContainer} ${isFixed ? styles.fixed : ""} ${
          menuOpen ? styles.show : styles.hide
        }`}
      >
        {menuData.map((menu, index) => (
          <div
            key={index}
            className={`${styles.menuColumn} ${
              menu.tools ? styles.menuTools : ""
            }`}
          >
            <h3>{menu.title}</h3>
            {menu.links &&
              menu.links.map((link, i) => (
                <a key={i} href="#">
                  {link}
                </a>
              ))}

            {menu.tools &&
              menu.tools.map((tool, i) => (
                <div key={i} className={`d-flex gap-3 ${styles.toolItem}`}>
                  <i className={tool.icon}></i>
                  <a href="#">{tool.text}</a>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppHeader;
