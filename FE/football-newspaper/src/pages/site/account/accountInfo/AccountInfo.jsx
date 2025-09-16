import Alert from "react-bootstrap/Alert";
import { Helmet } from "react-helmet-async";

import { Form, Row, Col, Button, Container,Spinner } from "react-bootstrap";
import styles from "./AccountInfo.module.scss";
import { useEffect, useRef, useState, useContext } from "react";
import UserService from "../../../../services/admin/userService";
import { formatDateTimeToDMY, formatDateTimeToISO } from "../../../../utils/formatDate";

import { UserContext } from "../../../../contexts/UserContext";
import { toast } from "react-toastify";

function AccountInfo() {
  const { user, updateUser } = useContext(UserContext);
  const [editProfile, setEditProfile] = useState({});
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [profile, setProfile] = useState({});
  const [errors, setErrors] = useState({});
  const [selectedAvatar, setSelectedAvatar] = useState(null);

    // Ref for hidden file input
  const fileInputRef = useRef(null);
  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

    const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Kiểm tra loại tệp ảnh
      if (!file.type.startsWith("image/")) {
        toast.error("Vui lòng chọn một tệp ảnh hợp lệ!");
        return;
      }

      // Kiểm tra kích thước tệp (10MB)
      const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSizeInBytes) {
        toast.error("Kích thước ảnh không được vượt quá 10MB!");
        return;
      }

      // Cập nhật file đã chọn để gửi lên server
      setSelectedAvatar(file);

      // Tạo xem trước ảnh bằng FileReader
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditProfile((prev) => ({
          ...prev,
          avatar: reader.result || "", // Cập nhật avatar để hiển thị xem trước
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  useEffect(() => {
    if (user?.userId) {
      fetchUserProfile(user.userId);
    }
  }, [user?.userId]); 

   const fetchUserProfile = async (userId) => {
    try {
      setLoading(true);
      const data = await UserService.getUserById(userId);
      console.log(data);
      setProfile(data);
      setEditProfile({
        fullName: data.fullName || "",
        phoneNumber: data.phoneNumber || "",
        email: data.email || "",
        birthDate: data.birthDate || "",
        gender: data.gender === null ? "" : data.gender,
        avatar: data.avatar || "",
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  };


   // Handle input changes in the form
  const handleInputChange = (field, value) => {
    setEditProfile((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear errors for the field being edited
    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };


  // Validation function
  const validateProfile = () => {
    const newErrors = {};

    if (!editProfile.fullName.trim()) {
      newErrors.fullName = "Họ và tên không được để trống.";
    } else if (/\d/.test(editProfile.fullName)) {
      newErrors.fullName = "Tên không được chứa chữ số.";
    }

    if (!editProfile.email.trim()) {
      newErrors.email = "Email không được để trống.";
    } else {
      const emailRegex = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/;
      if (!emailRegex.test(editProfile.email)) {
        newErrors.email = "Email không hợp lệ.";
      }
    }


      const phoneRegex = /^[0-9]{10,15}$/;
      if (!phoneRegex.test(editProfile.phoneNumber)) {
        newErrors.phoneNumber = "Số điện thoại không hợp lệ.";
      }

    if (editProfile.birthDate) {
      const dob = new Date(editProfile.birthDate);
      const today = new Date();
      if (dob > today) {
        newErrors.birthDate = "Ngày sinh không được lớn hơn ngày hiện tại.";
      }
    }

    // Add other validations if necessary

    setErrors(newErrors);

    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };


  // Handle form submission for Profile and Contact Info
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!validateProfile()) {
      return;
    }

    try {
      setUpdating(true);

      // Prepare data for update
      const updatedData = {
        ...profile,
        fullName: editProfile.fullName,
        phoneNumber: editProfile.phoneNumber,
        email: editProfile.email,
        birthDate: editProfile.birthDate|| null,
        lastLogin: formatDateTimeToISO(profile.lastLogin),
        registeredDate: formatDateTimeToISO(profile.registeredDate),
        gender: editProfile.gender,
        // Không cần set avatar ở đây nếu đã xử lý trong handleAvatarChange
      };

      // Call API to update profile with selectedAvatar
      const updatedProfile = await UserService.updateUser(
        profile.id,
        updatedData,
        selectedAvatar,
      );

      // Update state với dữ liệu mới
      setProfile({
        ...updatedProfile,
        updatedAt: formatDateTimeToDMY(updatedProfile.updatedAt),
      });
      setEditProfile({
        ...editProfile,
        avatar: updatedProfile.avatar || "",
      });

      // Cập nhật dữ liệu trong UserContext
      const updatedUser = {
        userId: updatedProfile.id,
        fullName: updatedProfile.fullName,
        email: updatedProfile.email,
        avatar: updatedProfile.avatar,
        role: user.role, // Giữ nguyên vai trò của người dùng
      };
      updateUser(updatedUser);

      toast.success("Cập nhật hồ sơ của bạn thành công!");

      // Reset selected avatar
      setSelectedAvatar(null);

      // Cập nhật dữ liệu trong context
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleVerified = () => {
    setIsVerified(true); 
  };

  if (loading)
    return (
      <div className="p-5 d-flex justify-content-center align-items-center">
        <Spinner animation="border" role="status" className="text-primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
  );

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

        <Form 
          onSubmit={handleFormSubmit}

        >
          <Row className="mb-4">
            <Col xs={12} lg={4}>
              <Form.Group controlId="formFullName">
                <Form.Label className="fw-bold">Họ tên</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Họ tên" 
                  name="fullName" 
                  value={editProfile.fullName|| ""}
                  isInvalid={!!errors.fullName}
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value)
                  }
                />
                  <Form.Control.Feedback type="invalid">
                    {errors.fullName}
                  </Form.Control.Feedback>
              </Form.Group>
            </Col>
  
            <Col xs={12} lg={4}>
              <Form.Group controlId="formEmail">
                <Form.Label className="fw-bold">Email</Form.Label>
                <Form.Control 
                  type="email" 
                  placeholder="Email" 
                  name="email" 
                  value={editProfile.email|| ""}
                  isInvalid={!!errors.email}
                  onChange={(e) =>
                    handleInputChange("email", e.target.value)
                  }
                />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
              </Form.Group>
            </Col>
  
            <Col xs={12} lg={4}>
              <Form.Group controlId="formAvatar" className="d-flex flex-column">
                <Form.Label className="fw-bold">Ảnh đại diện</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onClick={handleAvatarClick}
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                />
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
                  isInvalid={!!errors.phoneNumber}
                  value={editProfile.phoneNumber|| ""}
                  onChange={(e) =>
                    handleInputChange("phoneNumber", e.target.value)
                  }
                />
                  <Form.Control.Feedback type="invalid">
                    {errors.phoneNumber}
                  </Form.Control.Feedback>
              </Form.Group>
            </Col>
  
            <Col xs={12} lg={4}>
              <Form.Group controlId="formBirthday">
                <Form.Label className="fw-bold">Ngày sinh</Form.Label>
                <Form.Control 
                  type="date" 
                  name="birthDate" 
                  isInvalid={!!errors.birthDate}
                  value={editProfile.birthDate||""}
                  onChange={(e) =>
                    handleInputChange("birthDate", e.target.value)
                  }
                  
                />
                <Form.Control.Feedback type="invalid">
                  {errors.birthDate}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
  
            <Col xs={12} lg={4}>
              
              <Form.Group controlId="formGender">
                <Form.Label className="fw-bold">Giới tính</Form.Label>
                <div>
                  <Form.Check
                    inline
                    type="radio"
                    label="Nam"
                    name="gender"
                    value="Nam"
                    checked={editProfile.gender === "Nam"}
                    onChange={(e) => handleInputChange("gender", e.target.value)}
                  />
                  <Form.Check
                    inline
                    type="radio"
                    label="Nữ"
                    name="gender"
                    value="Nữ"
                    checked={editProfile.gender === "Nữ"}
                    onChange={(e) => handleInputChange("gender", e.target.value)}
                  />
                  <Form.Check
                    inline
                    type="radio"
                    label="Khác"
                    name="gender"
                    value="Khác"
                    checked={editProfile.gender === "Khác"}
                    onChange={(e) => handleInputChange("gender", e.target.value)}
                  />
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
                disabled={updating}
                className="mt-3 mb-5"
                size="lg"
              >
                {updating ? (
                <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />{" "}
                Đang cập nhật...
                </>
                ) : (
                "Lưu thay đổi"
                )}
              </Button>
  
          </div>
        </Form>
      </Container>
    </>
  );
}

export default AccountInfo;
