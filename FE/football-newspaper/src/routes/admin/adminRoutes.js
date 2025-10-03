import {
  Dashboard,
  CategoryManagement,
  UserManagement,
  PendingArticlesPage,
  MyProfile,
  ArticleDetailPage,
  AllArticlesPage,
} from "../../pages/admin";

const routes = [
  { path: "", name: "Bảng điều khiển", element: Dashboard },
  { path: "category", name: "Danh mục", element: CategoryManagement },
  { path: "user", name: "Người dùng", element: UserManagement },
  { path: "articles", name: "Tất cả bài viết", element: AllArticlesPage },
  { path: "articles/pending", name: "Duyệt bài viết", element: PendingArticlesPage },
  {
    path: "article/:slug",
    name: "Chi tiết bài viết",
    element: ArticleDetailPage,
  },
  { path: "myProfile", name: "Hồ sơ của tôi", element: MyProfile },
];

export default routes;
