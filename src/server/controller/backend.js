const Router = require('@koa/router')


const router= new Router()
router.prefix('/back')

router.get('/detail', (ctx, next) => {
  ctx.status= 200
  ctx.body= ctx.request.query
})

router.post('/test', ctx => {
  ctx.body= ctx.request.body
})


module.exports= router.routes()