import React from "react";
import { useLocation, matchPath } from "react-router-dom";
import { CBreadcrumb, CBreadcrumbItem } from "@coreui/react";

import routes from "../../../routes/admin/adminRoutes";

const AppBreadcrumb = () => {
  const currentLocation = useLocation().pathname;

  const getRouteName = (pathname, routes) => {
    const currentRoute = routes.find((route) => {
      const fullPath = route.path ? `/admin/${route.path}` : "/admin";
      return matchPath({ path: fullPath, end: true }, pathname);
    });
    return currentRoute ? currentRoute.name : false;
  };

  const getBreadcrumbs = (location) => {
    const breadcrumbs = [];
    location
      .split("/")
      .filter((x) => x) // bỏ chuỗi rỗng
      .reduce((prev, curr, index, array) => {
        const currentPathname = `${prev}/${curr}`;
        const routeName = getRouteName(currentPathname, routes);
        if (routeName) {
          breadcrumbs.push({
            pathname: currentPathname,
            name: routeName,
            active: index + 1 === array.length,
          });
        }
        return currentPathname;
      }, "");
    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs(currentLocation);

  return (
    <CBreadcrumb className="my-0">
      {breadcrumbs.map((breadcrumb, index) => (
        <CBreadcrumbItem
          key={index}
          {...(breadcrumb.active
            ? { active: true }
            : { href: breadcrumb.pathname })}
        >
          {breadcrumb.name}
        </CBreadcrumbItem>
      ))}
    </CBreadcrumb>
  );
};

export default React.memo(AppBreadcrumb);
