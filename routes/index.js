const router = require('koa-router')()
const { sign } = require('jsonwebtoken')


// router.get('/')
// 逻辑应该是这样的，当用户进入首页时，首先通过fetch检查token是否合理（存在、且未过期），如果合理则跳转至home，不合理则弹出loginModal,提示登入。
// 路由的跳转在前端进行使用vue-router，检验合理性在后端进行。
// 可以在app.vue添加逻辑
// 1. 路由设计
// 2. 进入的逻辑设计，"/"，直接访问时，若无效token跳转至/login，若为有效则通过...跳转至/:user

router.get('/', async (ctx, next) => {
  await ctx.render('index')

})

router.post('/login', async (ctx, next) => {
  console.log(ctx.request.body)
  // 通过sequelize查询数据库
  // 模拟数据库查询
  const user = {
    username: '1',
    password: '123456'
  }
  // 从数据库中查找用户名和密码是否匹配
  const { username, password } = ctx.request.body
  if (username === user.username && password === user.password) {
    const token = sign({ username }, secret, { expiresIn: '1h' })
    // 设置cookie
    ctx.cookies.set('token', token, {
      maxAge: 1000 * 60 * 60,
      httpOnly: true
    })

    ctx.body = {
      code: 200,
      message: '登录成功',
      token
    }
  } else {
    ctx.body = {
      code: 400,
      msg: '用户名或密码错误'
    }
  }
})  // 登录
module.exports = router
