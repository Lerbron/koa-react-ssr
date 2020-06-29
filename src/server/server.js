import Koa from 'koa'
const serve= require('koa-static');
const Router = require('@koa/router')
const koaBody= require('koa-body')

const path= require('path')
const proxy = require('koa-proxy');

// 配置
import { port } from "Config";

const app= new Koa()

app.use(async (ctx, next) => {
  if (!ctx.cookies.get('uuid')) {
    ctx.cookies.set('uuid', 'dd')
  }
 await next()
})

app.use(koaBody())

app.use(proxy({
  host:  'https://cnodejs.org', // proxy alicdn.com...
  match: /^\/api\//
}));


app.use(serve(path.resolve(__dirname, './../../dist/client')))

const IndexRouter= require('./controller/index')
const BackEndRouter= require('./controller/backend')

const router= new Router()
app.use(BackEndRouter)
app.use(IndexRouter)
app.use(router.routes())
  .use(router.allowedMethods())

app.listen(port);
console.log("server started on port " + port);
