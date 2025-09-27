import {
  Dashboard,
  CategoryManagement,
  UserManagement,
  ArticleListPage,
  MyProfile,
} from "../../pages/admin";

const routes = [
  { path: "", name: "Bảng điều khiển", element: Dashboard },
  { path: "category", name: "Danh mục", element: CategoryManagement },
  { path: "user", name: "Người dùng", element: UserManagement },
  { path: "article", name: "Duyệt bài viết", element: ArticleListPage },
  { path: "myProfile", name: "Hồ sơ của tôi", element: MyProfile },
];

export default routes;
