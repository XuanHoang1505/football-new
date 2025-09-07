import { useContext } from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Bounce, ToastContainer } from "react-toastify";
import { Suspense } from "react";
import { CSpinner } from "@coreui/react";
import SiteLayout from "./layouts/site/SiteLayout";

import { UserContext } from "./contexts/UserContext";

import FootballLayout from "./layouts/site/football/FootballLayout";
import ClubLayout from "./layouts/site/club/ClubLayout";

import {
  Home,
  Profile,
  Account,
  AccountInfo,
  ChangePassword,
  WatchHistory,
} from "./pages";

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
import PlayerLayout from "./layouts/site/player/PlayerLayout";
import { RecentMatches } from "./pages/site/player";

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
              <Route index element={<Home />} />
              <Route path="profile" element={<Profile />} />
              <Route path="account" element={<Account />}>
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
