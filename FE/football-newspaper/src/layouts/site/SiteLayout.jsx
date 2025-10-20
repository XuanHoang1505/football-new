import { Outlet } from "react-router-dom";
import AppHeader from "../../components/site/appHeader/AppHeader";
import GlobalStyle from "../../assets/site/scss/GlobalStyles";
const SiteLayout = () => {
  return (
    <GlobalStyle>
      <AppHeader />
      <div className="bg-light">
        <Outlet />
      </div>
    </GlobalStyle>
  );
};

export default SiteLayout;
