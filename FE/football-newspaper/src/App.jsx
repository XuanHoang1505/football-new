import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Bounce, ToastContainer } from "react-toastify";
import { Suspense } from "react";
import { CSpinner } from "@coreui/react";
import SiteLayout from "./layouts/site/SiteLayout";

import AppFooter from './components/site/appFooter/AppFooter';
import AppHeader from './components/site/appHeader/AppHeader';
import AppLogin from "./pages/site/auth/appLogin/AppLogin";

function App() {
  return (
    <>
      <Router>
        <Suspense
          fallback={
            <div className="pt-3 text-center">
              <CSpinner color="primary" variant="grow" />
            </div>
          }
        >
          <Routes>
            <Route path="/*" element={<SiteLayout />} />
            <Route path="/login" element={<AppLogin />} />
          </Routes>
        </Suspense>
      </Router>


      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </>
  );
}

export default App;
