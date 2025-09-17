import React, { useContext } from "react";
import { toast } from "react-toastify";
import { UserSwitchOutlined } from "@ant-design/icons"
import { NavLink, useNavigate } from "react-router-dom";
import {
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from "@coreui/react";
import {
  cilCreditCard,
  cilFile,
  cilSettings,
  cilUser,
  cilAccountLogout,
} from "@coreui/icons";
import CIcon from "@coreui/icons-react";

import defaultAvatar from "../../../assets/admin/images/avatars/user.png";
import { UserContext } from "../../../contexts/UserContext";
import { logout } from "../../../services/site/AuthService";

const AppHeaderDropdown = () => {
  const { user, updateUser } = useContext(UserContext);
  const navigate = useNavigate();
  const handleLogout = async () => {
    logout(user.userId);
    updateUser(null);
    navigate("/");
    toast.success("Đăng xuất thành công!");
  };
  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle
        placement="bottom-end"
        className="py-0 pe-0"
        caret={false}
      >
        <img
          src={user.avatar || defaultAvatar}
          alt="avatar"
          size="md"
          className="object-fit-cover rounded-circle"
          style={{ width: "40px", height: "40px" }}
        />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-body-secondary fw-semibold mb-2" style={{ minWidth: "200px", fontSize: "15px" }}>
          Account
        </CDropdownHeader>

        <CDropdownItem as={NavLink} to="/admin/myProfile" className="py-2" style={{fontSize: "15px"}}>
          <CIcon icon={cilUser} className="me-2" />
          Profile
        </CDropdownItem>
        <CDropdownItem as={NavLink} to="/" className="py-2" style={{fontSize: "15px"}}>
          <UserSwitchOutlined className="me-2"/>
          Cilent
        </CDropdownItem>
        <CDropdownItem href="#" className="py-2" style={{fontSize: "15px"}}>
          <CIcon icon={cilSettings} className="me-2" />
          Settings
        </CDropdownItem>
        <CDropdownItem href="#" className="py-2" style={{fontSize: "15px"}}>
          <CIcon icon={cilCreditCard} className="me-2" />
          Payments
          <CBadge color="secondary" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownItem href="#" className="py-2" style={{fontSize: "15px"}}>
          <CIcon icon={cilFile} className="me-2" />
          Projects
          <CBadge color="primary" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownDivider />
        <CDropdownItem onClick={handleLogout} className="py-2" style={{ cursor: "pointer", fontSize:"15px" }}>
          <CIcon icon={cilAccountLogout} className="me-2" />
          Log out
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default AppHeaderDropdown;
