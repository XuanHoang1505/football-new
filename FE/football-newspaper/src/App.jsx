import { useContext, useEffect } from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Bounce, ToastContainer } from "react-toastify";
import { Suspense } from "react";
import { CSpinner, useColorModes } from "@coreui/react";

import { UserContext } from "./contexts/UserContext";

import AdminLayout from "./layouts/admin/AdminLayout";
import SiteLayout from "./layouts/site/SiteLayout";
import FootballLayout from "./layouts/site/football/FootballLayout";
import ClubLayout from "./layouts/site/club/ClubLayout";
import PlayerLayout from "./layouts/site/player/PlayerLayout";

import {
  Home,
  Profile,
  Account,
  AccountInfo,
  ChangePassword,
  WatchHistory,
  Submit,
} from "./pages/site";

import {
  TopScores,
  Fixtures,
  Results,
  Clubs,
  Standings,
} from "./pages/site/football";

import {
  Summary,
  Squad,
  ClubFixtures,
  ClubResults,
  Transfers,
} from "./pages/site/club";

import {
  RecentMatches,
  PlayerTransfers,
  PlayerCareer,
} from "./pages/site/player";

import PrivateRoute from "./utils/PrivateRoute";
import Page403 from "./pages/site/page403/Page403";
import Page500 from "./pages/site/page500/Page500";
import Page404 from "./pages/site/page404/Page404";
import NewsCategory from "./pages/site/categoryPage/NewsCategory";
import ArticlePage from "./pages/site/articlePage/ArticlePage";
import LatestPage from "./pages/site/latest/LatestPage";

import routes from "./routes/admin/adminRoutes";

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
            <Route
              path="/admin/"
              element={
                <PrivateRoute roles={"ADMIN"}>
                  <AdminLayout />
                </PrivateRoute>
              }
            >
              {routes.map((route, index) => {
                return (
                  route.element && (
                    <Route
                      key={index}
                      index={route.path === ""}
                      path={route.path}
                      name={route.name}
                      element={<route.element />}
                    />
                  )
                );
              })}
            </Route>
            <Route path="/" element={<SiteLayout />}>
              <Route index element={<Home />} />
              <Route
                path="submit"
                element={
                  <PrivateRoute roles={"USER"}>
                    <Submit />
                  </PrivateRoute>
                }
              />
              <Route path="latest" element={<LatestPage />} />
              <Route path="category/:slug" element={<NewsCategory />} />
              <Route path="news/:slug" element={<ArticlePage />} />
              <Route
                path="profile"
                element={
                  <PrivateRoute roles={"USER"}>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route
                path="account"
                element={
                  <PrivateRoute roles={"USER"}>
                    <Account />
                  </PrivateRoute>
                }
              >
                <Route
                  path="account-info"
                  element={<AccountInfo user={user} />}
                />
                <Route
                  path="change-password"
                  element={<ChangePassword user={user} />}
                />
                <Route path="watch-history" element={<WatchHistory />} />
              </Route>
              <Route path="football/:leagueCode" element={<FootballLayout />}>
                <Route index element={<Fixtures />} />
                <Route path="results" element={<Results />} />
                <Route path="clubs" element={<Clubs />} />
                <Route path="top-scorers" element={<TopScores />} />
                <Route path="standings" element={<Standings />} />
              </Route>
              <Route path="club/:clubCode" element={<ClubLayout />}>
                <Route index element={<Summary />} />
                <Route path="squad" element={<Squad />} />
                <Route path="fixtures" element={<ClubFixtures />} />
                <Route path="results" element={<ClubResults />} />
                <Route path="transfers" element={<Transfers />} />
              </Route>
              <Route path="player/:playerId" element={<PlayerLayout />}>
                <Route index element={<RecentMatches />} />
                <Route path="transfers" element={<PlayerTransfers />} />
                <Route path="career" element={<PlayerCareer />} />
              </Route>
            </Route>
            <Route path="/page403" element={<Page403 />} />
            <Route path="/page500" element={<Page500 />} />
            <Route path="*" element={<Page404 />} />
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
