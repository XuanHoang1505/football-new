import { useState } from "react";

import { Form, Row, Col, Button, Container, Spinner } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import UserService from "../../../../services/admin/userService";
import { toast } from "react-toastify";

function ChangePassword({ user }) {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [changing, setChanging] = useState(false);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    const newErrors = {};

    if (!passwordData.currentPassword.trim()) {
      newErrors.currentPassword = "Mật khẩu hiện tại không được để trống.";
    }

    if (!passwordData.newPassword.trim()) {
      newErrors.newPassword = "Mật khẩu mới không được để trống.";
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = "Mật khẩu mới phải ít nhất 6 ký tự.";
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setChanging(true);
      await UserService.changePassword(
        user.userId,
        passwordData.currentPassword,
        passwordData.newPassword
      );
      toast.success("Đổi mật khẩu thành công!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      handleReset();
    } catch (error) {
      console.error("Error changing password:", error);
    } finally {
      setChanging(false);
    }
  };

  const handleReset = () => {
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    })
    setErrors({});
  }

  return (
    <>
      <Helmet>
        <title>Đổi mật khẩu | {user?.fullName ?? ""}</title>
      </Helmet>
      <Container fluid className="p-0 mt-1">
        <div
          style={{
            color: "#244892",
            fontSize: "20px",
            borderBottom: "1px solid #ccc",
          }}
        >
          <h3 className="fw-bold mb-3">Đổi mật khẩu</h3>
        </div>

        <Form onSubmit={handleChangePassword}>
          <Row className="my-4">
            <Col xs={12}>
              <Form.Group controlId="formCurrentPassword">
                <Form.Label className="fw-bold">
                  Mật khẩu hiện tại <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  isInvalid={!!errors.currentPassword}
                  placeholder="Mật khẩu hiện tại"
                  name="currentPassword"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors.currentPassword}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
  
          <Row className="mb-4">
            <Col xs={12}>
              <Form.Group controlId="formNewPassword">
                <Form.Label className="fw-bold">
                  Mật khẩu mới <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  isInvalid={!!errors.newPassword}
                  placeholder="Mật khẩu mới"
                  name="newPassword"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors.newPassword}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
  
          <Row className="mb-4">
            <Col xs={12}>
              <Form.Group controlId="formConfirmPassword">
                <Form.Label className="fw-bold">
                  Nhập lại mật khẩu mới <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Nhập lại mật khẩu mới"
                  name="confirmPassword"
                  isInvalid={!!errors.confirmPassword}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors.confirmPassword}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
  
          <div className="text-center">
            <Button
              variant="primary"
              type="submit"
              className="mt-3 mb-5"
              size="lg"
              disabled={changing}
            >
              {changing ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />{" "}
                  Đang đổi...
                </>
              ) : (
                "Cập nhật mật khẩu"
              )}
            </Button>
          </div>
        </Form>
      </Container>
    </>
  );
}

export default ChangePassword;
