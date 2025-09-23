import { Link } from "react-router-dom";
import logo from "../../../assets/site/images/logo_mobile_footer.png";
import styles from "./AppFooter.module.scss";
import { footerData } from "../../../data/MenuData";

const AppFooter = () => {
  return (
    <footer>
      <div className={styles.top_footer}>
        <div className={styles.container}>
          <div className={styles.top_footer_content}>
            <Link to={"/"} className={styles.footer_logo}>
              <img src={logo} alt={"Thể thao 247"} className="py-3" />
            </Link>
          </div>
        </div>
      </div>
      <div className={styles.footer_menu}>
        <div className={styles.container}>
          <div className={styles.footer_menu_content}>
            {footerData.map((col, i) => (
              <div key={i} className={styles.footer_column}>
                <h4>{col.title}</h4>
                <ul>
                  {col.links.map((link, j) => (
                    <li key={j}>
                      <Link to={link.url}>{link.name}</Link>
                    </li>
                  ))}
                </ul>

                {col.extra && (
                  <>
                    <h4>{col.extra.title}</h4>
                    <ul>
                      {col.extra.links.map((link, k) => (
                        <li key={k}>
                          <Link to={link.url}>{link.name}</Link>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.footer_info}>
        <div className={styles.container}>
          <div className={styles.footer_info_content}>
            <div className={styles.col_app_com}>
              <img
                src="https://cdn-img.thethao247.vn/frontend/images/logo-mxh-event.png"
                style={{ width: "200px" }}
              />
              <p className="fw-bold mt-3 mb-2">Công ty TNHH MTV GenPress</p>
              <p className="my-2 fw-bold">
                Giấy phép thiết lập MXH số 365/GP-BTTTT, Ký ngày 4/12/2024
              </p>
              <p className="my-2">
                <strong>Địa chỉ Hà Nội:</strong> Tầng 04, Tòa nhà Star, Lô D32
                KĐT Cầu Giấy, Đường Dương Đình Nghệ, Yên Hòa, Cầu Giấy, Hà Nội.
              </p>
              <p className="my-2">
                <strong>Điện thoại:</strong> 0847100247
              </p>
              <p className="my-2">
                <strong>Email:</strong> contact@thethao247.vn
              </p>
            </div>
            <div className={styles.col_social}>
              <p className="text-uppercase fs-6 fw-bold mb-3">social</p>
              <ul>
                <li>
                  <a href="#">
                    <i className="bi bi-youtube me-2 text-danger" />
                    Foutube
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="bi bi-facebook me-2 text-info" />
                    Facebook
                  </a>
                </li>

                <li>
                  <a href="#">
                    <i className="bi bi-twitter me-2 text-primary" />
                    Twitter
                  </a>
                </li>

                <li>
                  <a href="#">
                    <i className="bi bi-tiktok me-2 text-black" />
                    Tiktok
                  </a>
                </li>
              </ul>
            </div>
            <div className={styles.col_info_com}>
              <p className="mb-2">
                <a href="#" className="fw-normal">
                  Thỏa thuận chia sẻ nội dung
                </a>
              </p>
              <p className="my-2">
                <a href="/chinh-sach-bao-mat-p5.html" className="fw-normal">
                  Chính sách bảo mật
                </a>
              </p>
              <p className="my-2">
                <strong>Báo giá quảng cáo:</strong>{" "}
                <a href="/bao-gia.html"  className="fw-normal">Tại đây</a>
              </p>
              <p className="my-2">
                <strong>
                  Liên hệ quảng cáo, truyền thông, hợp tác kinh doanh:
                </strong>{" "}
                0985 233 950
              </p>
              <p className="my-2">
                <strong>VPGD:</strong> Tầng 4, số 248 Lương Thế Vinh, Trung Văn,
                Nam Từ Liêm, Hà Nội.
              </p>
              <p className="my-2">© LANGTUCCAU 2024 . All Rights Reserved.</p>
              <a
                href="https://www.dmca.com/Protection/Status.aspx?ID=d31a2a19-f919-485f-93b2-8697b3a6ff75&amp;refurl=https://thethao247.vn/"
                target="_blank"
                rel="nofollow noopener"
                title="DMCA.com Protection Status"
              >
                {" "}
                <img
                  style={{ marginLeft: "-5px" }}
                  src="https://images.dmca.com/Badges/dmca-badge-w250-5x1-06.png?ID=d31a2a19-f919-485f-93b2-8697b3a6ff75"
                  alt="DMCA.com Protection Status"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;
