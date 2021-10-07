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
  res.render('login', req.session && req.session.user || {});
})

router.post('/submit', (req, res) => {
  // 1. 先从数据库中查询有无此人
  readFile({
    callback: (data) => {
      const dataBase = JSON.parse(data);
      // 从表单中获取user信息
      const { name, password } = req.body;
      const user = dataBase.find(d => d.name === name && d.password === password);
      // 如果查询到此人的信息, 那就将user信息放置于session中(下次请求就会携带上cookie)
      if (user) {
        req.session.user = user;
        return res.redirect('/');
      } else {
        return res.status(401).send('<script>alert("账户或者密码错误"); location="/login"</script>')
      };
    }
  })
})

module.exports = router;
