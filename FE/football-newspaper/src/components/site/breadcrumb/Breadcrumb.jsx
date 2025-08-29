import { NavLink, useLocation } from "react-router-dom";
import Breadcrumb from "react-bootstrap/Breadcrumb";

function DynamicBreadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <Breadcrumb style={{ borderBottom: "1px dotted #ccc"}}> 
      <Breadcrumb.Item linkAs={NavLink} linkProps={{ to: "/" }}>
        Trang chủ
      </Breadcrumb.Item>
      {pathnames.map((name, index) => {
        const routeTo = "/" + pathnames.slice(0, index + 1).join("/");
        const isLast = index === pathnames.length - 1;
        return isLast ? (
          <Breadcrumb.Item key={name} active>
            {name}
          </Breadcrumb.Item>
        ) : (
          <Breadcrumb.Item
            key={name}
            linkAs={NavLink}
            linkProps={{ to: routeTo }}
          >
            {name}
          </Breadcrumb.Item>
        );
      })}
    </Breadcrumb>
  );
}

export default DynamicBreadcrumb;
