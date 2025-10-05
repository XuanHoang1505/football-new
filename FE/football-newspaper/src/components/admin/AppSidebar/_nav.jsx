
import CIcon from "@coreui/icons-react";
import { RiMovie2AiLine, RiVipCrown2Line } from "react-icons/ri";
import {
  cilSpeedometer,
  cilList,
  cilUser,
  cilNewspaper,
  cilCommentBubble
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
  {
    component: CNavGroup,
    name: "Bài báo",
    to: "articles",
    icon: <CIcon icon={cilNewspaper} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "Tất cả bài viết",
        to: "articles",
      },
      {
        component: CNavItem,
        name: "Duyệt bài viết",
        to: "articles/pending",
      },
    ],
  },
    {
    component: CNavItem,
    name: "Bình luận",
    to: "comments",
    icon: <CIcon icon={cilCommentBubble} customClassName="nav-icon" />,
  },
];

export default _nav;
