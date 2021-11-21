const express = require('express')
const apiRouter = require('./router/apiRouter')
const v1Router = require('./router/v1Router')
const errorhandler = require('./middleware/errorHandler')
const cors = require('cors')
const parseJwt = require('express-jwt')
const SECRET_KEY = 'login2021'

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// cors跨域
app.use(cors())
app.use(cors())

// 解析token
console.log(111, SECRET_KEY);
app.use(
  parseJwt({
    secret: SECRET_KEY,
    algorithms: ['HS256'],
  })
    .unless({ path: ['/v1/login'] })
)

// 给路由添加前缀 (命名空间, 配置多组路由对象)
app.use('/api', apiRouter)
app.use('/v1', v1Router)

// 末尾添加兜底错误中间件
app.use(errorhandler)

app.listen(8001, () => {
  console.log('服务器启动成功, http://localhost:8001')
})