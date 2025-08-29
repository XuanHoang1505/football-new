import { Home, Profile, Account, AccountInfo } from "../../pages";

const routes = [
  { path: "", name: "Trang chủ", element: Home },
  { path: "profile", name: "Trang cá nhân", element: Profile },
  { path: "account", name: "Quản lý tài khoản", element: Account },
  { path: "account-info", name: "Cập nhật thông tin", element: AccountInfo },
];
export default routes;
