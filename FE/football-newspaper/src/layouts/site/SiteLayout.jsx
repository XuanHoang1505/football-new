import AppHeader from "../../components/site/appHeader/AppHeader";
import Content from "../../components/site/appContent/Content";
import GlobalStyle from "../../assets/site/scss/GlobalStyles";
const SiteLayout = () => {
  return (
    <GlobalStyle>
      <AppHeader/>
      <Content />
    </GlobalStyle>
  );
};

export default SiteLayout;
