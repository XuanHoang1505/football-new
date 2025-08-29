import { useContext } from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Bounce, ToastContainer } from "react-toastify";
import { Suspense } from "react";
import { CSpinner } from "@coreui/react";
import SiteLayout from "./layouts/site/SiteLayout";

import { UserContext } from "./contexts/UserContext";


import { Home, Profile, Account, AccountInfo, ChangePassword } from "./pages";

function App() {
    const { user } = useContext(UserContext);
  
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
              <Route path="/" element={<SiteLayout />}>
                <Route index element={<Account />} />
                <Route path="profile" element={<Profile />} />
                <Route path="account" element={<Account />}>
                  <Route path="account-info" element={<AccountInfo user={user}/>} />
                  <Route path="change-password" element={<ChangePassword user={user}/>} />
                </Route>
              </Route>
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
