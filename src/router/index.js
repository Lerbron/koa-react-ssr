import React from "react";
import ReactDOM from "react-dom";
import { Route, Switch, Redirect } from "react-router-dom";
import Loadable from "react-loadable";

// import Head from "@/components/head";
import Loading from "@/components/ui/loading";

import Home from "@/pages/home";
import Detail from "@/pages/detail";

/**
 * 创建路由
 * @param  {Object} userinfo 用户信息，以此判断用户是否是登录状态，并控制页面访问权限
 * @return {[type]}
 */

export const routes = [
  {
    path: "/",
    exact: true,
    // head: Head,
    component: Home
  },

  {
    path: "/detail/:id",
    exact: true,
    // head: Head,
    component: Detail
  },
  {
    path: "**",
    // head: Head,
    component: Loadable({
      loader: () => import("@/pages/not-found"),
      loading: () => <Loading />
    })
  }
];

export default () => (
  <div>
    <Switch>
      {routes.map((route, index) => {
        if (route.component) {
          return (
            <Route
              key={index}
              path={route.path}
              exact={route.exact}
              component={route.component}
            />
          );
        }
      })}
    </Switch>
  </div>
);
// export default () => {
// 登录用户才能访问
// const requireAuth = (Layout, props) => {
//   if (!user) {
//     return <Redirect to="/sign-in" />;
//   } else {
//     return <Layout {...props} />;
//   }
// };

// 游客才能访问
// const requireTourists = (Layout, props) => {
//   if (user) {
//     return <Redirect to="/" />;
//   } else {
//     return <Layout {...props} />;
//   }
// };

// 大家都可以访问
// const triggerEnter = (Layout, props) => {
//   return <Layout {...props} />;
// };

// 路由数组

// let router = () => (
//   <div>
//     <Switch>
//       {routeArr.map((route, index) => {
//         if (route.component) {
//           return (
//             <Route
//               key={index}
//               path={route.path}
//               exact={route.exact}
//               component={route.component}
//             />
//           );
//         }
//       })}
//     </Switch>
//   </div>
// );

// return router

// return {
//   // list: routeArr,
//   dom: router
// };
// };
