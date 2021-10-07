// 创建服务器
const express = require('express');
const session = require('express-session');
const path = require('path');
const router = require('./router');

const app = express();

// 配置模板引擎(搭配res.render()使用)
app.engine('html', require('express-art-template'));
// 配置模板默认路径
app.set('views', path.join(__dirname, 'pages'));
// 配置引擎默认后缀
app.set('view engine', 'html');

// 配置静态资源处理中间件
app.use('/static', express.static('static'));

// 配置post的body请求体
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 配置session
app.use(session({
  secret: 'keyboard cat', // 密钥
  resave: false,
  saveUninitialized: true
}))

// 配置cookie认证
app.use((req, res, next) => {
  // 登录页 or 有session 通过当前session校验
  if (['/login', '/submit'].includes(req.url) || req.session.user) {
    next();
  } else {
    res.status(401).send('<script>alert("账户或者密码错误"); location="/login"</script>')
  }
})

// 配置路由
app.use(router);

app.listen(8083, () => {
  console.log('服务器开启成功, 点击访问"http://localhost:8083/login"');
});