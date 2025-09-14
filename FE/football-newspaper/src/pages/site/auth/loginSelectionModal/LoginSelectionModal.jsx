import React from "react";
import { Modal, Button } from "react-bootstrap";
import { FaLock } from "react-icons/fa";
import styles from "./LoginSelectionModal.module.scss";
import iconFB from "../../../../assets/site/images/icons/facebook.png";
import iconGG from "../../../../assets/site/images/icons/google.png";

const LoginSelectionModal = ({
  show,
  handleClose,
  handleShowLoginModal,
  handleShowSignUpModal,
}) => {
  return (
    <>
      <Modal show={show} onHide={handleClose} centered size="md">
        <Modal.Header closeButton className={styles.modalHeader}>
          <Modal.Title className="w-100 text-center">Đăng nhập</Modal.Title>
        </Modal.Header>
        <Modal.Body className={`text-center ${styles.modalBody}`}>
          <p className={styles.description}>
            Bạn có thể quản lý tài khoản sau khi đăng nhập, có thể đồng bộ lịch
            sử xem và mục yêu thích trên nhiều đầu cuối.
          </p>

          <div className="d-grid gap-2">
            <Button
              variant="light"
              className={styles.loginButton}
              onClick={handleShowLoginModal}
            >
              <FaLock className={styles.icon} /> Đăng nhập bằng Tài khoản
              Football-News
            </Button>

            <Button variant="light" className={styles.loginButton}>
              <img
                src={iconGG}
                width={25}
                alt="Google"
                className={styles.icon}
              />{" "}
              Đăng nhập bằng Google
            </Button>
            <Button variant="light" className={styles.loginButton}>
              <img
                src={iconFB}
                width={25}
                alt="Facebook"
                className={styles.icon}
              />{" "}
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
    </>
  );
};

export default LoginSelectionModal;
