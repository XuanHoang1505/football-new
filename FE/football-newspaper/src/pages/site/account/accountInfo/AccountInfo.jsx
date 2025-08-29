import Alert from "react-bootstrap/Alert";
import { Helmet } from "react-helmet-async";

import { Form, Row, Col, Button, Container } from "react-bootstrap";

import styles from "./AccountInfo.module.scss";

function AccountInfo({ user }) {
  return (
    <>
      <Helmet>
        <title>Quản lý tài khoản | {user?.fullName ?? ""}</title>
      </Helmet>
      <Container fluid className="p-0 mt-1">
        <div className={styles.title}>
          <h3 className="fw-bold mt-3 mb-3">Thông tin tài khoản</h3>
        </div>
        <Alert variant="danger" className="mt-3">
          Tài khoản chưa xác thực Số điện thoại, click{" "}
          <Alert.Link href="#">vào đây</Alert.Link> để xác thực ngay!
        </Alert>

        <Row className="mb-4">
          <Col xs={12} lg={4}>
            <Form.Group controlId="formFullName">
              <Form.Label className="fw-bold">Họ tên</Form.Label>
              <Form.Control type="text" placeholder="Họ tên" name="fullName" />
            </Form.Group>
          </Col>

          <Col xs={12} lg={4}>
            <Form.Group controlId="formEmail">
              <Form.Label className="fw-bold">Email</Form.Label>
              <Form.Control type="email" placeholder="Email" name="email" />
            </Form.Group>
          </Col>

          <Col xs={12} lg={4}>
            <Form.Group controlId="formAvatar" className="d-flex flex-column">
              <Form.Label className="fw-bold">Ảnh đại diện</Form.Label>
              <Button style={{ width: "150px" }}>Chọn ảnh đại diện</Button>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col xs={12} lg={4}>
            <Form.Group controlId="formPhone">
              <Form.Label className="fw-bold">Điện thoại</Form.Label>
              <Form.Control
                type="text"
                placeholder="Điện thoại"
                name="phoneNumber"
              />
            </Form.Group>
          </Col>

          <Col xs={12} lg={4}>
            <Form.Group controlId="formBirthday">
              <Form.Label className="fw-bold">Ngày sinh</Form.Label>
              <Form.Control type="date" name="birthDate" />
            </Form.Group>
          </Col>

          <Col xs={12} lg={4}>
            <Form.Group controlId="formGender">
              <Form.Label className="fw-bold">Giới tính</Form.Label>
              <div>
                <Form.Check inline type="radio" label="Nam" name="gender" />
                <Form.Check inline type="radio" label="Nữ" name="gender" />
                <Form.Check inline type="radio" label="Khác" name="gender" />
              </div>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col xs={12}>
            <Form.Group controlId="formInfo">
              <Form.Label className="fw-bold">Thông tin thêm</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Thông tin thêm"
              />
            </Form.Group>
          </Col>
        </Row>
        <Alert variant="warning" className="mt-3">
          Theo nghị định 147 về quản lý, cung cấp, sử dụng Internet và thông tin
          trên mạng do Chính phủ ban hành và bắt đầu có hiệu lực từ ngày 25-12,
          tài khoản mạng xã hội (MXH) phải xác thực bằng số điện thoại di động
          mới được phép hoạt động, đăng bài (viết bài, bình luận, livestream,
          chia sẻ thông tin)
        </Alert>
        <div className="text-center">
          <Button
            variant="primary"
            type="submit"
            className="mt-3 mb-5"
            size="lg"
          >
            Lưu thay đổi
          </Button>
        </div>
      </Container>
    </>
  );
}

export default AccountInfo;
