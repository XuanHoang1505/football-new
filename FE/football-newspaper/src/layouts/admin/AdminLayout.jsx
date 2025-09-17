import { CContainer, CSpinner, useColorModes } from "@coreui/react";
import { Outlet } from "react-router-dom";

import {
  AppSidebar,
  AppHeader,
  AppFooter,
} from "../../components/admin";
import GlobalStyles from "../../assets/admin/scss/GlobalStyles/GlobalStyles";
import { Suspense, useEffect } from "react";
import { useSelector } from "react-redux";

const AdminLayout = () => {

  const { isColorModeSet, setColorMode } = useColorModes(
      "coreui-free-react-admin-template-theme"
    ); // để quản lý chế độ màu (color mode) của giao diện người dùng
    const storedTheme = useSelector((state) => state.theme);
  
    useEffect(() => {
      const urlParams = new URLSearchParams(window.location.href.split("?")[1]);
      const theme =
        urlParams.get("theme") &&
        urlParams.get("theme").match(/^[A-Za-z0-9\s]+/)[0];
      if (theme) {
        setColorMode(theme);
      }
  
      if (isColorModeSet()) {
        return;
      }
  
      setColorMode(storedTheme);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
  
  return (
    <GlobalStyles>
      <AppSidebar />
      <div className=" wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <CContainer  fluid className="p-0">
            <Suspense fallback={<CSpinner color="primary" />}>
              <Outlet />
            </Suspense>
          </CContainer>
        </div>
        <AppFooter />
      </div>
    </GlobalStyles>
  );
};

export default AdminLayout;
