import { Outlet, useLocation } from "react-router-dom";
import AppHeader from "../../components/site/appHeader/AppHeader";
import GlobalStyle from "../../assets/site/scss/GlobalStyles";
import AppFooter from "../../components/site/appFooter/AppFooter";

const SiteLayout = () => {
  const { pathname } = useLocation();

  const bgClassMap = {
    "/": "bg-white",
  };

  const bgClass = bgClassMap[pathname] || "bg-light";

  return (
    <GlobalStyle>
      <AppHeader />
      <div className={bgClass}>
        <Outlet />
      </div>
      <AppFooter />
    </GlobalStyle>
  );
};

export default SiteLayout;
