import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
  useColorModes,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";

import { AppSidebarNav } from "./AppSidebarNav";

import { logo } from "../../../assets/admin/brand/logo";
import { sygnet } from "../../../assets/admin/brand/sygnet";

// sidebar nav config
import navigation from "./_nav.jsx";
import { NavLink } from "react-router-dom";
import { setSidebarShow } from "../../../redux/slices/themeSlice.js";

const AppSidebar = () => {
  const colorMode = localStorage.getItem("coreui-free-react-admin-template-theme");

  const dispatch = useDispatch();
  const [unfoldable, setUnfoldable] = useState(false);
  const sidebarShow = useSelector((state) => state.theme.sidebarShow);

  const toggle = () => {
    setUnfoldable(!unfoldable);
  };
  return (
    <CSidebar
      className="border-end"
      colorScheme={colorMode === "dark" ? "dark" : "light"}
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch(setSidebarShow(visible));
      }}
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand to="/admin/" as={NavLink}>
          <CIcon customClassName="sidebar-brand-full" icon={logo} height={28} />
          <CIcon
            customClassName="sidebar-brand-narrow"
            icon={sygnet}
            height={32}
          />
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch(setSidebarShow(!sidebarShow))}
        />
      </CSidebarHeader>
      <AppSidebarNav items={navigation} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler onClick={toggle} />
      </CSidebarFooter>
    </CSidebar>
  );
};

export default React.memo(AppSidebar);
