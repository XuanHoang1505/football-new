import React from "react";
import { Home, Profile, Account, AccountInfo, ChangePassword, WatchHistory } from "../../pages";
import { TopScores, Fixtures, Results, Clubs, Standings } from "../../pages/site/football";
import { Summary, Squad, ClubFixtures, ClubResults, Transfers } from "../../pages/site/club";
import { RecentMatches } from "../../pages/site/player";

const routes = (user) => [
  {
    path: "/",
    element: <Home />,
    name: "Trang chủ",
  },
  {
    path: "profile",
    element: <Profile />,
    name: "Trang cá nhân",
  },
  {
    path: "account",
    element: <Account />,
    name: "Quản lý tài khoản",
    children: [
      { path: "account-info", element: <AccountInfo user={user} />, name: "Cập nhật thông tin" },
      { path: "change-password", element: <ChangePassword user={user} />, name: "Đổi mật khẩu" },
      { path: "watch-history", element: <WatchHistory />, name: "Lịch sử xem" },
    ],
  },
  // Football routes
  {
    path: "football/:leagueCode",
    element: null, 
    name: "Football",
    children: [
      { path: "", element: <Fixtures />, name: "Lịch thi đấu" },
      { path: "results", element: <Results />, name: "Kết quả" },
      { path: "clubs", element: <Clubs />, name: "Câu lạc bộ" },
      { path: "top-scorers", element: <TopScores />, name: "Vua phá lưới" },
      { path: "standings", element: <Standings />, name: "Bảng xếp hạng" },
    ],
  },
  // Club routes
  {
    path: "club/:clubCode",
    element: null,
    name: "Club",
    children: [
      { path: "", element: <Summary />, name: "Tóm tắt" },
      { path: "squad", element: <Squad />, name: "Đội hình" },
      { path: "fixtures", element: <ClubFixtures />, name: "Lịch thi đấu" },
      { path: "results", element: <ClubResults />, name: "Kết quả" },
      { path: "transfers", element: <Transfers />, name: "Chuyển nhượng" },
    ],
  },
  // Player routes
  {
    path: "player/:playerId",
    element: null, 
    name: "Player",
    children: [{ path: "", element: <RecentMatches />, name: "Trận gần đây" }],
  },
];

export default routes;
