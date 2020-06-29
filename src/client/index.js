import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Router } from "react-router-dom";

const createHistory = require("history").createBrowserHistory;
import { Provider } from "react-redux";
import { matchPath } from "react-router";
import parseUrl from "@/utils/parseUrl";

import configureStore from "@/store";
import AppRouter, { routes } from "@/router";

// 引入全局样式
import "../pages/global.scss";

class AppRoute extends React.Component {
  componentDidMount() {
    history.listen((location, action) => {
      let { pathname, search } = location;
      let _route = null,
        _match = null;
      routes.some((route) => {
        let match = matchPath(pathname, route);
        if (match && match.path) {
          _route = route;
          _match = match;
          return true;
        }
      });

      let { appStore } = this.props;
      const query = search ? parseUrl(search) : null;
      if (_route && _route.component && _route.component.preFetch) {
        _route.component.preFetch({ store: appStore, match: _match, query });
      }
    });
  }

  render() {
    return <AppRouter />;
  }
}

// 从页面中获取服务端生产redux数据，作为客户端redux初始值
const store = configureStore(window.__initState__);
const history = createHistory();

const run = async () => {
  let _route = null;

  routes.some((route) => {
    let match = matchPath(window.location.pathname, route);
    if (match && match.path) {
      _route = route;
      return true;
    }
  });

  ReactDOM.hydrate(
    <Provider store={store}>
      <Router history={history}>
        <AppRoute
          pathname={location.pathname}
          appStore={store}
          initPath={_route.path}
        />
      </Router>
    </Provider>,
    document.getElementById("app")
  );

  if (process.env.NODE_ENV === "development") {
    if (module.hot) {
      module.hot.accept();
    }
  }
};

run();
