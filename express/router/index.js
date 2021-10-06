const express = require('express')
const { readFile, writeFile, format } = require('../utils')

const router = express.Router();

router.get('/', (req, res) => {
  readFile({
    encoding: 'utf-8',
    callback: (data) => {
      res.render('index', { data: JSON.parse(data) });
    }
  })
});

router.get('/add', (req, res) => {
  res.render('add');
});

router.post('/publish', (req, res) => {
  readFile({
    callback: (data) => {
      const dataBase = JSON.parse(data);
      dataBase.unshift({
        ...req.body,
        id: Date.now(),
        time: format(Date.now()),
      });
      writeFile({
        data: JSON.stringify(dataBase, null, 2),
        callback: () => {
          res.redirect('/');
        }
      })
    }
  });
});

router.get('/delete', (req, res) => {
  readFile({
    callback: (data) => {
      const dataBase = JSON.parse(data);
      const filters = dataBase.filter(d => +d.id !== +req.query.id)

      writeFile({
        data: JSON.stringify(filters, null, 2),
        callback: () => {
          res.redirect('/')
        }
      })
    }
  });
})

router.get('/edit', (req, res) => {
  readFile({
    callback: (data) => {
      const dataBase = JSON.parse(data);
      const current = dataBase.find(d => +d.id === +req.query.id);
      res.render('edit', current);
    }
  });
})

router.post('/update', (req, res) => {
  readFile({
    callback: (data) => {
      const dataBase = JSON.parse(data);
      const current = dataBase.find(d => +d.id === +req.body.id);
      const currentIndex = dataBase.findIndex(d => +d.id === +req.body.id);
      Object.assign(current, req.body);
      current.time = format(Date.now());
      dataBase.splice(currentIndex, 1, current)
      writeFile({
        data: JSON.stringify(dataBase, null, 2),
        callback: () => {
          res.redirect('/');
        }
      })
    }
  });
})

router.get('/login', (req, res) => {
  res.render('login');
})

router.post('/submit', (req, res) => {
  // 1. 先看有没有这个账号
  readFile({
    callback: (data) => {
      const dataBase = JSON.parse(data);
      const { username, password } = req.body;
      const user = dataBase.find(d => d.name === username);
      if (!user) return res.status(401).send({ error: '没有改账户' });
      // 2. 这个账号和密码匹不匹配
      if (password !== user.password) return res.status(401).send({ error: '密码不正确' });
      res.redirect('/');
    }
  })
})

module.exports = router;
