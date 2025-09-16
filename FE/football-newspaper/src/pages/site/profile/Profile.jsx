import { useContext } from "react";

import { Helmet } from "react-helmet-async";

import styles from "./Profile.module.scss";
import DynamicBreadcrumb from "../../../components/site/breadcrumb/Breadcrumb";

import { UserContext } from "../../../contexts/UserContext";

function Profile() {
  const { user } = useContext(UserContext);

  return (
    <>
      <Helmet>
        <title>Trang cá nhân | {user?.fullName ?? ""}</title>
      </Helmet>
      <div className={`${styles.container} `}>
        <DynamicBreadcrumb />
        <div className="container mt-3">
          <div className="row">
            <div className="col-12 col-lg-9">
              {/* Thông tin tác giả */}
              <div
                className="p-3 rounded"
                style={{ backgroundColor: "#DCE7FF" }}
              >
                <div className="row align-items-center">
                  {/* Avatar */}
                  <div className="col-12 col-lg-2 text-center mb-3 mb-lg-0">
                    <img
                      src={
                        user?.avatar ||
                        "https://cdn-img.thethao247.vn/resize_400x460//base/comment/img/avatar.png"
                      }
                      alt="User"
                      className="rounded-circle"
                      width={100}
                      height={115}
                    />
                  </div>

                  {/* Thông tin + mạng xã hội */}
                  <div className="col-12 col-lg-10 text-center text-lg-start">
                    <h2 className="fw-bold mb-2">Tác giả: Nguyễn Xuân Hoàng</h2>
                    <p className="mb-3">Ngày sinh: 2004-05-15</p>

                    <div className="mt-3 text-center text-lg-start">
                      <a
                        href="https://www.facebook.com/xuanhoang1505/"
                        className="me-3"
                      >
                        <i className="fa-brands fa-facebook fa-2x text-primary"></i>
                      </a>
                      <a href="#" className="me-3 k">
                        <i className="fa-brands fa-instagram fa-2x text-danger"></i>
                      </a>
                      <a href="#" className="me-3">
                        <i className="fa-brands fa-twitter fa-2x text-info"></i>
                      </a>
                      <a href="#" className="me-3">
                        <i className="fa-brands fa-youtube fa-2x text-danger"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cảnh báo */}
              <div className="alert alert-warning mt-3 text-dark">
                Theo nghị định 147 về quản lý, cung cấp, sử dụng Internet và
                thông tin trên mạng do Chính phủ ban hành và bắt đầu có hiệu lực
                từ ngày 25-12, tài khoản mạng xã hội (MXH) phải xác thực bằng số
                điện thoại di động mới được phép hoạt động, đăng bài (viết bài,
                bình luận, livestream, chia sẻ thông tin)
              </div>
            </div>

            <div className="col-12 col-lg-3"></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
