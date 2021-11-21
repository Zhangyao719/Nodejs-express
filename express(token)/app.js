const express = require('express')
const apiRouter = require('./router/apiRouter')
const v1Router = require('./router/v1Router')
const cors = require('cors')

const app = express()

// 给路由添加前缀 (命名空间, 配置多组路由对象)
app.use(cors())
app.use('/api', apiRouter)
app.use('/v1', v1Router)

app.listen(8001, () => {
  console.log('服务器启动成功, http://localhost:8001')
})