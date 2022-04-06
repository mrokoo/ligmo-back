const router = require('koa-router')()
const verify = require('../jwt/verify')
const secret = 'my_secret' // 密钥 

router.prefix('/:user')

// router.get('/', async function (ctx, next) {
//   const User = ctx.db.models.User
//   console.log(User)
//   const jane = await User.create({ firstName: "Jane" });
//   // console.log(jane); // 不要这样!
//   console.log(jane.toJSON()); // 这样最好!
//   console.log(JSON.stringify(jane, null, 4)); // 这样也不错!
//   ctx.body = 'this is a users response!'
// })

// router.get('/bar', function (ctx, next) {
//   ctx.body = 'this is a users/bar response'
// })



// get请求验证token后获取cards，若查询失败则返回错误信息
router.get('/cards', async function (ctx, next) {
  const decode = await verify(ctx.header.authorization, secret)
  // 通过decode的username获取该用户的全部cards
  const cards = await ctx.db.Card.findAll({
    where: {
      userId: decode.username
    }
  })
  if (cards) {
    ctx.body = {
      code: 200,
      message: '获取cards成功',
      data: cards
    }
  } else {
    ctx.body = {
      code: 500,
      message: '查询失败',
      data: null
    }
  }
})

// 通过post请求修改cards数据，若失败返回错误信息
router.post('/cards/update', async function (ctx, next) {
  const decode = await verify(ctx.header.authorization, secret)
  const { id, title, content } = ctx.request.body
  const card = await ctx.db.Card.update({
    title,
    content
  }, {
    where: {
      id,
      userId: decode.username
    }
  })
  // 返回code:200，message:修改成功，data:修改后的card
  if (card) {
    ctx.body = {
      code: 200,
      message: '修改成功',
      data: card
    }
  } else {
    ctx.body = {
      code: 500,
      message: '修改失败',
      data: null
    }
  }
})

// post删除制定cards数据，若失败返回错误信息
router.post('/cards/delete', async function (ctx, next) {
  const decode = await verify(ctx.header.authorization, secret)
  // 通过decode的username和body中的id删除指定card
  const card = await ctx.db.Card.destroy({
    where: {
      id: ctx.request.body.id,
      userId: decode.username
    }
  })
  // 返回code:200，message:删除成功，data:删除后的card
  if (card) {
    ctx.body = {
      code: 200,
      message: '删除成功',
      data: card
    }
  } else {
    ctx.body = {
      code: 500,
      message: '删除失败',
      data: null
    }
  }
})

// post添加cards数据，若失败返回错误信息
router.post('/cards/add', async function (ctx, next) {
  const decode = await verify(ctx.header.authorization, secret)
  // 利用decode的username和body中的title和content创建card
  const card = await ctx.db.Card.create({
    title: ctx.request.body.title,
    content: ctx.request.body.content,
    userId: decode.username
  })
  // 返回code:200，message:添加成功，data:添加后的card
  if (card) {
    ctx.body = {
      code: 200,
      message: '添加成功',
      data: card
    }
  } else {
    ctx.body = {
      code: 500,
      message: '添加失败',
      data: null
    }
  }
})


module.exports = router
