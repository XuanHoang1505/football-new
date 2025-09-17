import {
  Dashboard,
  // MovieManagement,
  // EpisodeManagement,
  // ReviewManagement,
  // CommentManagement,
  // GenreManagement,
  CategoryManagement,
  UserManagement,
  // ActorManagement,
  // MovieSlideManagement,
  // VipTypeManagement,
  // VipManagement,
  // MyProfile,
} from "../../pages/admin";

const routes = [
  // { path: "", name: "Trang chủ", element: AdminHome },
  { path: "", name: "Bảng điều khiển", element: Dashboard },
  // { path: "movies/movies", name: "Phim", element: MovieManagement },
  // {
  //   path: "movies/episodes",
  //   name: "Tập phim",
  //   element: EpisodeManagement,
  // },
  // { path: "comments", name: "Bình luận", element: CommentManagement },
  // { path: "movieSlides", name: "Slide", element: MovieSlideManagement },
  // { path: "reviews", name: "Đánh giá", element: ReviewManagement },
  // { path: "genres", name: "Thể loại", element: GenreManagement },
  { path: "/admin/category", name: "Danh mục", element: CategoryManagement },
  { path: "user", name: "Người dùng", element: UserManagement },
  // { path: "actors", name: "Diễn viên", element: ActorManagement },
  // { path: "vips/vipTypes", name: "Loại VIP", element: VipTypeManagement },
  // { path: "vips/vipMembers", name: "Thành viên VIP", element: VipManagement },
  // { path: "myProfile", name: "Hồ sơ của tôi", element: MyProfile },
];

export default routes;
