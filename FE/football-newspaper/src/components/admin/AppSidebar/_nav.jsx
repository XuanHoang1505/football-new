
import CIcon from "@coreui/icons-react";
import { TfiLayoutSlider } from "react-icons/tfi";
import { RiMovie2AiLine, RiVipCrown2Line } from "react-icons/ri";
import {
  cilSpeedometer,
  cilList,
  cilStar,
  cilCommentBubble,
  cilPeople,
  cilUser,
} from "@coreui/icons";

import { CNavGroup, CNavItem, CNavTitle } from "@coreui/react";

const _nav = [
  {
    component: CNavItem,
    name: "Bảng điều khiển",
    to: "/admin",
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: "Nội dung quản lý",
  },
  {
    component: CNavItem,
    name: "Danh mục",
    to: "category",
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Người dùng",
    to: "user",
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  // {
  //   component: CNavGroup,
  //   name: "VIP",
  //   to: "vips",
  //   icon: <RiVipCrown2Line className="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: "Thành viên VIP",
  //       to: "vips/vipMembers",
  //       // icon: <RiMovie2AiLine className="nav-icon" />,
  //     },
  //     {
  //       component: CNavItem,
  //       name: "Loại VIP",
  //       to: "vips/vipTypes",
  //       // icon: <CIcon icon={cilMediaPause} customClassName="nav-icon" size="sm"/>,
  //     },
  //   ],
  // },
];

export default _nav;
