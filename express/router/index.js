const express = require('express')
const { readFile } = require('../utils')
const path = require('path')
const DATABASE_PATH = path.join(__dirname, '..', 'data.json');

const router = express.Router();

router.get('/', (req, res) => {
  readFile({
    path: DATABASE_PATH,
    encoding: 'utf-8',
    callback: (data) => {
      res.render('index', { data: JSON.parse(data) });
    }
  })
  // res.send('嘿嘿');
});

module.exports = router;
