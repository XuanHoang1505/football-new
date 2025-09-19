import { Outlet } from "react-router-dom";
import AppHeader from "../../components/site/appHeader/AppHeader";
import GlobalStyle from "../../assets/site/scss/GlobalStyles";
import AppFooter from "../../components/site/appFooter/AppFooter";
const SiteLayout = () => {
  return (
    <GlobalStyle>
      <AppHeader />
      <div className="bg-light">
        <Outlet />
      </div>
      <AppFooter/>
    </GlobalStyle>
  );
};

export default SiteLayout;
