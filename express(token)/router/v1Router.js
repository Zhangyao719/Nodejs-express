const express = require('express')
const v1Router = express.Router()
const jwt = require('jsonwebtoken')
const SECRET_KEY = 'login2021'

v1Router.post('/login', (req, res) => {
  // 校验密码....此处省略
  // 如果校验成功, 生成jwt
  /**
   * 参数1: 生成到token中的信息
   * 参数2: 密钥
   * 参数3: token的有效时间
   */
  const token = jwt.sign(
    { user: { name: 'zs', password: 123 } },
    SECRET_KEY,
    { expiresIn: '3h' }
  )
  console.log('🚀 → token', token)
  res.send({
    status: 200,
    message: 'success',
    // 免去前端拼接Bearer [token]的麻烦
    token: 'Bearer ' + token,
  })
})

v1Router.get('/getAll', (req, res) => {
  res.send({
    status: 200,
    message: 'success',
    list: [
      { name: 'zs', age: 18 },
      { name: 'ls', age: 19 },
    ]
  })
})

v1Router.post('/add', (req, res) => {
  console.log(req);
  res.send({
    status: 200,
    message: 'add success',
  })
})

module.exports = v1Router