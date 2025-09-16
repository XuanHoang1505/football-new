import { CContainer, CSpinner } from "@coreui/react";
import { Outlet } from "react-router-dom";

import {
  AppSidebar,
  AppHeader,
  AppFooter,
} from "../../components/admin";
import GlobalStyles from "../../assets/admin/scss/GlobalStyles/GlobalStyles";
import { Suspense } from "react";

const AdminLayout = () => {
  return (
    <GlobalStyles>
      <AppSidebar />
      <div className=" wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <CContainer className="px-4" fluid>
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
