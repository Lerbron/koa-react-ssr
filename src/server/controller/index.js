const Router = require('@koa/router')
import React from "react";
import ReactDOMServer from "react-dom/server";
import { StaticRouter, matchPath } from "react-router";
import { Provider } from "react-redux";
import MetaTagsServer from "react-meta-tags/server";
import { MetaTagsContext } from "react-meta-tags";
const path= require('path')
const fs= require('fs')

// 路由配置
import configureStore from "@/store";
// 路由组件
import AppRouter, { routes } from "@/router";
// 路由初始化的redux内容
import { initialStateJSON } from "@/store/reducers";

let tml= fs.readFileSync(path.join(__dirname, './../../dist/server/index.html'), 'utf-8')

const router= new Router()
router.get("/", async (ctx, next) => {
  let store = configureStore(JSON.parse(initialStateJSON));
  let _route = null,
    _match = null;

  routes.some((route) => {
    let match = matchPath(ctx.url.split("?")[0], route);
    if (match && match.path) {
      _route = route;
      _match = match;
      return true;
    }
  });

  let context = {
    code: 200,
  };

  if (_route.component && _route.component.preFetch) {
    context = await _route.component.preFetch({
      store,
      match: _match,
      query: ctx.query,
    });
  }

  _route &&
    _route.component &&
    _route.component.preload &&
    (await _route.component.preload());

  const metaTagsInstance = MetaTagsServer();

  let _mainContent = (
    <Provider store={store}>
      <MetaTagsContext extract={metaTagsInstance.extract}>
        <StaticRouter location={ctx.url} context={context}>
          <AppRouter />
        </StaticRouter>
      </MetaTagsContext>
    </Provider>
  );

  // html
  let _html = ReactDOMServer.renderToString(_mainContent);

  // 获取页面的meta，嵌套到模版中
  let meta = metaTagsInstance.renderToString();
  let reduxState = JSON.stringify(store.getState()).replace(/</g, "\\x3c");

  let html= tml.replace('<%- html %>', _html)
  html= html.replace('<%- reduxState %>', reduxState)
  html= html.replace('<%- meta %>', meta)

  if (context.code == 302) {
    ctx.status= 302;
    ctx.redirect(ctx.url)
  } else {
    ctx.status= context.code
    ctx.type= 'text/html';
    ctx.body= html;
  }

  // 释放store内存
  store = null;
  return next()
});


module.exports= router.routes()