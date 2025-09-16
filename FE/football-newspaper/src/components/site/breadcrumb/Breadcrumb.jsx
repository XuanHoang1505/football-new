import { NavLink, useLocation } from "react-router-dom";
import Breadcrumb from "react-bootstrap/Breadcrumb";

function DynamicBreadcrumb({ category }) {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  let breadcrumbItems = [];

  if (category) {
    // ---- Trường hợp trang tin tức / danh mục
    if (category.parentName && category.parentSlug) {
      breadcrumbItems.push({
        label: category.parentName,
        path: `/category/${category.parentSlug}`,
      });
    }

    breadcrumbItems.push({
      label: category.name,
      path: `/category/${category.slug}`,
    });
  } else {
    // ---- Trường hợp trang account (hoặc các page khác không có category)
    breadcrumbItems = pathnames
      .filter((name) => name !== "account")
      .map((name, index, arr) => {
        let label;
        switch (name) {
          case "account-info":
            label = "Quản lý tài khoản";
            break;
          case "change-password":
            label = "Đổi mật khẩu";
            break;
          case "watch-history":
            label = "Tin đã xem";
            break;
          case "profile":
            label = "Trang cá nhân";
            break;
          case "latest":
            label = "Tin tức mới nhất";
            break;  
          default:
            label = name;
        }
        return {
          label,
          path: "/" + arr.slice(0, index + 1).join("/"),
        };
      });
  }

  return (
    <Breadcrumb style={{ borderBottom: "1px dotted #ccc" }}>
      <Breadcrumb.Item linkAs={NavLink} linkProps={{ to: "/" }}>
        Trang chủ
      </Breadcrumb.Item>

      {breadcrumbItems.map((item, index) => {
        const isLast = index === breadcrumbItems.length - 1;
        return isLast ? (
          <Breadcrumb.Item key={item.path} active>
            {item.label}
          </Breadcrumb.Item>
        ) : (
          <Breadcrumb.Item
            key={item.path}
            linkAs={NavLink}
            linkProps={{ to: item.path }}
          >
            {item.label}
          </Breadcrumb.Item>
        );
      })}
    </Breadcrumb>
  );
}

export default DynamicBreadcrumb;
