const express = require('express')

const v1Router = express.Router()

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