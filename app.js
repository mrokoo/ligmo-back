const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const cors = require('@koa/cors')
const unless = require('koa-unless')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const secret = 'my_secret' // 密钥 
const jwt = require('koa-jwt')({
  secret
})

const index = require('./routes/index')
const users = require('./routes/users')

const db = require('./DB/index')
app.context.db = db

// error handler
onerror(app)

app.unless = unless
// middlewares
app.use(bodyparser())
app.use(json())

// 错误处理
app.use((ctx, next) => {
  return next().catch((err) => {
    if(err.status === 401){
      ctx.status = 401;
      ctx.body = 'Protected resource, use Authorization header to get access\n';
    }else{
      throw err;
    }
  })
})

// jwt验证
// 进一步检验token是否过期中间件
app.use(jwt).unless({
  path: [
    '/',
  ]
})
app.use(logger())
// 静态文件
app.use(require('koa-static')(__dirname + '/public'))
app.use(views(__dirname + '/views', {
  extension: 'html'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// cors 跨域解决
app.use(cors({
  origin: '*',
}))
// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});


module.exports = app
