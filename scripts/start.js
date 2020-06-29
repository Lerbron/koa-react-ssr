const webpack = require('webpack')
const Koa= require('koa')
const cors = require('koa2-cors');
const serve= require('koa-static');
const path= require('path')
const koaDevMiddleware= require('koa-webpack-dev-middleware')
const webpackHotMiddleware = require('koa-webpack-hot-middleware')

const nodemon = require('nodemon')
const rimraf = require('rimraf')
// const webpackDevMiddleware = require('webpack-dev-middleware')
// const webpackHotMiddleware = require('webpack-hot-middleware')

const clientConfig = require('../config/webpack/client.dev')
const serverConfig = require('../config/webpack/server.dev')

const config = require('../config')

const compilerPromise = compiler => {
  return new Promise((resolve, reject) => {
    compiler.plugin('done', stats => {
      if (!stats.hasErrors()) {
        return resolve()
      }
      return reject('Compilation failed')
    })
  })
}

const app= new Koa()
app.use( async (ctx, next) => {
  // 允许来自所有域名请求
  ctx.set("Access-Control-Allow-Origin", "*");
  // 这样就能只允许 http://localhost:8080 这个域名的请求了
  // ctx.set("Access-Control-Allow-Origin", "http://localhost:8080"); 

  // 设置所允许的HTTP请求方法
  ctx.set("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, POST, DELETE");

  // 字段是必需的。它也是一个逗号分隔的字符串，表明服务器支持的所有头信息字段.
  ctx.set("Access-Control-Allow-Headers", "x-requested-with, accept, origin, content-type");

  // 服务器收到请求以后，检查了Origin、Access-Control-Request-Method和Access-Control-Request-Headers字段以后，确认允许跨源请求，就可以做出回应。

  // Content-Type表示具体请求中的媒体类型信息
  ctx.set("Content-Type", "application/json;charset=utf-8");

  // 该字段可选。它的值是一个布尔值，表示是否允许发送Cookie。默认情况下，Cookie不包括在CORS请求之中。
  // 当设置成允许请求携带cookie时，需要保证"Access-Control-Allow-Origin"是服务器有的域名，而不能是"*";
  ctx.set("Access-Control-Allow-Credentials", true);

  await next()
})
// app.use(cors())
const WEBPACK_PORT = config.port + 1

const start = async () => {
  rimraf.sync('./dist')

  clientConfig.entry.app.unshift(`webpack-hot-middleware/client?path=http://localhost:${WEBPACK_PORT}/__webpack_hmr`)

  clientConfig.output.hotUpdateMainFilename = `[hash].hot-update.json`
  clientConfig.output.hotUpdateChunkFilename = `[id].[hash].hot-update.js`

  clientConfig.output.publicPath = `http://localhost:${WEBPACK_PORT}/`
  serverConfig.output.publicPath = `http://localhost:${WEBPACK_PORT}/`

  const clientCompiler = webpack([clientConfig, serverConfig])

  const _clientCompiler = clientCompiler.compilers[0]
  const _serverCompiler = clientCompiler.compilers[1]

  const clientPromise = compilerPromise(_clientCompiler)
  const serverPromise = compilerPromise(_serverCompiler)

  app.use(
    koaDevMiddleware(_clientCompiler, {
      publicPath: clientConfig.output.publicPath,
      reload: true,
      noInfo: true,
      stats: {
        colors: true
      }
    })
  )

  // 客户端热更新
  app.use(webpackHotMiddleware(_clientCompiler))

  app.use(serve(path.resolve(__dirname,'../dist/client')))
  

  app.listen(WEBPACK_PORT)

  // 服务端代码更新监听
  _serverCompiler.watch({
    ignored: /node_modules/
  }, (error, stats) => {
    if (!error && !stats.hasErrors()) {
      console.log(stats.toString(serverConfig.stats))
      return
    }
    if (error) {
      console.log(error, 'error')
    }
  })

  await serverPromise
  await clientPromise

  const script = nodemon({
    script: `./dist/server/server.js`,
    ignore: ['src', 'scripts', 'config', './*.*', 'build/client']
  })

  script.on('restart', () => {
    console.log('Server side app has been restarted.')
  })

  script.on('quit', () => {
    console.log('Process ended')
    process.exit()
  })

  script.on('error', () => {
    console.log('An error occured. Exiting')
    process.exit(1)
  })
}

start()