import React, { useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { FaLock } from "react-icons/fa";
import styles from "./LoginSelectionModal.module.scss";
import iconFB from "../../../../assets/site/images/icons/facebook.png";
import iconGG from "../../../../assets/site/images/icons/google.png";

import { googleLogin, facebookLogin } from "../../../../services/site/ExternalAuthService";

const LoginSelectionModal = ({
  show,
  handleClose,
  handleShowLoginModal,
  handleShowSignUpModal,
}) => {
  useEffect(() => {
    // Load Facebook SDK
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: "YOUR_FACEBOOK_APP_ID", // ⚠️ thay bằng AppId FB của bạn
        cookie: true,
        xfbml: true,
        version: "v19.0",
      });
    };

    (function (d, s, id) {
      let js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  }, []);

  // ===== GOOGLE LOGIN =====
  const handleGoogleLogin = () => {
    /* global google */
    google.accounts.id.initialize({
      client_id: "727146363826-0vlu2b0jg50faur3fu9rpmktnpuaqumi.apps.googleusercontent.com", 
      callback: async (response) => {
        try {
          const id_token = response.credential;
          const result = await googleLogin(id_token); // gọi API backend
          console.log("Google login success:", result);
          handleClose();
        } catch (err) {
          console.error("Google login failed:", err);
        }
      },
    });

    google.accounts.id.prompt(); // hiện popup chọn tài khoản
  };

  // ===== FACEBOOK LOGIN =====
  const handleFacebookLogin = () => {
    window.FB.login(
      async (response) => {
        if (response.authResponse) {
          const accessToken = response.authResponse.accessToken;
          try {
            const result = await facebookLogin(accessToken); // gọi API backend
            console.log("Facebook login success:", result);
            handleClose();
          } catch (err) {
            console.error("Facebook login failed:", err);
          }
        }
      },
      { scope: "public_profile,email" }
    );
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="md">
      <Modal.Header closeButton className={styles.modalHeader}>
        <Modal.Title className="w-100 text-center">Đăng nhập</Modal.Title>
      </Modal.Header>
      <Modal.Body className={`text-center ${styles.modalBody}`}>
        <p className={styles.description}>
          Bạn có thể quản lý tài khoản sau khi đăng nhập, đồng bộ lịch sử xem và mục yêu thích trên nhiều thiết bị.
        </p>

        <div className="d-grid gap-2">
          <Button
            variant="light"
            className={styles.loginButton}
            onClick={handleShowLoginModal}
          >
            <FaLock className={styles.icon} /> Đăng nhập bằng Tài khoản Football-News
          </Button>

          <Button
            variant="light"
            className={styles.loginButton}
            onClick={handleGoogleLogin}
          >
            <img src={iconGG} width={25} alt="Google" className={styles.icon} />{" "}
            Đăng nhập bằng Google
          </Button>

          <Button
            variant="light"
            className={styles.loginButton}
            onClick={handleFacebookLogin}
          >
            <img src={iconFB} width={25} alt="Facebook" className={styles.icon} />{" "}
            Đăng nhập bằng Facebook
          </Button>
        </div>

        <p className="mt-4" style={{ fontWeight: "500" }}>
          Bạn không có tài khoản?{" "}
          <span
            className={styles.registerLink}
            onClick={handleShowSignUpModal}
          >
            Đăng ký
          </span>
        </p>
      </Modal.Body>
    </Modal>
  );
};

export default LoginSelectionModal;
