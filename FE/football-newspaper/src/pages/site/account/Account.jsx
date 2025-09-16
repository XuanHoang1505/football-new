import React, { useContext } from "react";
import { UserContext } from "../../../contexts/UserContext";
import { NavLink, Outlet } from "react-router-dom";

import DynamicBreadcrumb from "../../../components/site/breadcrumb/Breadcrumb";

import styles from "./Account.module.scss";
import { Alert } from "react-bootstrap";


function Account() {
  const { user } = useContext(UserContext);

  return (
    <>
      <div className={styles.mainContainer}>
        <DynamicBreadcrumb />
        <div className="container-fluid p-0 mt-3 mx-0">
          <div className="row">
            <div className="col-12 col-lg-3">
              <div
                className="card p-4"
                style={{ boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}
              >
                <div
                  className="text-center pb-3"
                  style={{ borderBottom: "1px solid #ddd" }}
                >
                  <img
                    src={
                      user?.avatar ||
                      "https://cdn-img.thethao247.vn/resize_400x460//base/comment/img/avatar.png"
                    }
                    alt="avatar"
                    className="rounded-circle mb-2"
                    width={100}
                  />
                  <h6 className="fs-5 fw-bold">{user?.fullName}</h6>
                  <p className="text-dark ">{user?.email}</p>
                </div>
                <ul className="list-unstyled">
                  <li>
                    <NavLink
                      to="/profile"
                      end
                      className={({ isActive }) =>
                        `d-block py-3 text-dark fw-normal ${
                          styles.navbar_item
                        } ${isActive ? styles.active : ""}`
                      }
                    >
                      <i className="bi bi-person-circle me-2"></i>
                      Trang cá nhân
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                      to="/account/account-info"
                      className={({ isActive }) =>
                        `d-block py-3 text-dark fw-normal ${
                          styles.navbar_item
                        } ${isActive ? styles.active : ""}`
                      }
                    >
                      <i className="bi bi-gear me-2"></i>
                      Cập nhật thông tin
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                      to="/account/change-password"
                      className={({ isActive }) =>
                        `d-block py-3 text-dark fw-normal ${
                          styles.navbar_item
                        } ${isActive ? styles.active : ""}`
                      }
                    >
                      <i className="bi bi-shield-lock me-2"></i>
                      Đổi mật khẩu
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                      to="/account/my-posts"
                      className={({ isActive }) =>
                        `d-block py-3 text-dark fw-normal ${
                          styles.navbar_item
                        } ${isActive ? styles.active : ""}`
                      }
                    >
                      <i className="bi bi-file-post me-2"></i>
                      Viết bài
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                      to="/account/watch-history"
                      className={({ isActive }) =>
                        `d-block pt-3 text-dark fw-normal ${
                          styles.navbar_item
                        } ${isActive ? styles.active : ""}`
                      }
                    >
                      <i className="bi bi-clock-history me-2"></i>
                      Tin đã xem
                    </NavLink>
                  </li>

                  <hr />

                  <li>
                    <a
                      href="#"
                      className={`d-block text-dark fw-normal ${styles.navbar_item}`}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Thoát
                    </a>
                  </li>
                </ul>
              </div>
              <Alert variant="secondary" className="mt-3 ">
                Cần hỗ trợ, vui lòng liên hệ:{" "}
                <strong>contact@thethao247.vn</strong>
              </Alert>
            </div>
            <div className="col-12 col-lg-9">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Account;
