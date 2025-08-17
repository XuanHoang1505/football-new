import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/shift-away.css";
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
  const [tab, setTab] = useState("login");

  const handleClose = () => setShow(false);

  const handleShowLogin = () => {
    setTab("login");
    setShow(true);
  };
  const handleShowRegister = () => {
    setTab("register");
    setShow(true);
  };

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
    {
      label: "lịch thi đấu",
      path: "/lich-thi-dau",
    },
    {
      label: "u23 châu á",
      path: "/u23",
    },
    {
      label: "bóng đá việt nam",
      path: "/bong-da-vn",
      subMenu: [
        { label: "Đội tuyển Quốc gia", path: "/bong-da-vn/dtqg" },
        { label: "V-League", path: "/bong-da-vn/vleague" },
        { label: "Bóng đá nữ", path: "/bong-da-vn/bdn" },
        { label: "U17 châu Á", path: "/bong-da-vn/bdn" },
        { label: "Bóng đá trẻ", path: "/bong-da-vn/bdn" },
        { label: "U20 châu Á", path: "/bong-da-vn/bdn" },
      ],
      background: "#05A69D",
    },
    {
      label: "bóng đá quốc tế",
      path: "/bong-da-qt",
      subMenu: [
        { label: "Ngoại hạng Anh", path: "/bong-da-qt/epl" },
        { label: "La Liga", path: "/bong-da-qt/laliga" },
        { label: "Serie A", path: "/bong-da-qt/seriea" },
        { label: "Cúp C1", path: "/bong-da-qt/c1" },
        { label: "World Cup 2026", path: "/bong-da-qt/wc2026" },
      ],
      background: "#9F234E",
    },
    { label: "nhận định", path: "/nhan-dinh" },
    { label: "chuyển nhượng", path: "/chuyen-nhuong" },
    { label: "thể thao", path: "/the-thao" },
    { label: "bóng chuyền", path: "/bong-chuyen" },
    { label: "pickleball", path: "/pickleball" },
    { label: "xe", path: "/xe" },
    { label: "esport", path: "/esport" },
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
      <Modal show={show} onHide={handleClose} animation={true} centered>
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

            <div
              style={{ color: "#254892", fontWeight: "550" }}
              onClick={handleShowRegister}
              className={styles.item2}
              role="button"
            >
              <img
                className={styles.iconQc}
                src={iconRegister}
                alt="Register"
              />
              Đăng ký
            </div>

            <div
              style={{ color: "#254892", fontWeight: "550" }}
              onClick={handleShowLogin}
              className={styles.item2}
              role="button"
            >
              <img className={styles.iconQc} src={iconLogin} alt="login" />
              Đăng nhập
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className={styles.navigation}>
        <div className={styles.navbar_container}>
          {/* Icon Home */}
          <i
            className={`bi bi-house-door-fill text-light fs-4 ${styles.icon_home}`}
            style={{ cursor: "pointer" }}
          ></i>

          {/* Menu items */}
          <div className={styles.nav_content}>
            {menuItems.map((item, idx) => {
              if (item.subMenu) {
                return (
                  <Tippy
                    key={idx}
                    interactive={true}
                    placement="bottom-start"
                    arrow={false} 
                    animation="shift-away"
                    offset={[0, 0]}
                    delay={[0, 100]}
                    content={
                      <div className={styles.subMenu} style={{ background: item.background || "#fff" }}>
                        {item.subMenu.map((sub, subIdx) => (
                          <NavLink
                            key={subIdx}
                            to={sub.path}
                            className={styles.sub_item}
                          >
                            {sub.label}
                          </NavLink>
                        ))}
                      </div>
                    }
                  >
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        isActive
                          ? `${styles.nav_item} ${styles.active}`
                          : styles.nav_item
                      }
                    >
                      {item.label}
                    </NavLink>
                  </Tippy>
                );
              }
              // item không có submenu
              return (
                <NavLink
                  key={idx}
                  to={item.path}
                  className={({ isActive }) =>
                    isActive
                      ? `${styles.nav_item} ${styles.active}`
                      : styles.nav_item
                  }
                >
                  {item.label}
                </NavLink>
              );
            })}

            {/* Toggle button */}
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
