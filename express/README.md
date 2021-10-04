# Express

## Express 简介

> **基于 Node.js 平台，快速、开放、极简的 web 开发框架**

- [express 官网](http://expressjs.com/)
- [express 中文网](http://expressjs.com.cn/)

```js
1. Express 的作用和 Node.js 内置的 http 模块类似，是专门用来创建 Web 服务器的。
2. Express 的本质：就是一个 npm 上的第三方包，提供了快速创建 Web 服务器的便捷方法。
```

进一步了解express

```js
思考：不使用 Express 能否创建 Web 服务器？
答案：能，使用 Node.js 提供的原生 http 模块即可。

思考：既生瑜何生亮（有了 http 内置模块，为什么还有用 Express）？
答案：http 内置模块用起来很复杂，开发效率低；Express 是基于内置的 http 模块进一步封装出来的，能够极大的提高开发效率。

思考：http 内置模块与 Express 是什么关系？
答案：类似于浏览器中 Web API 和 jQuery 的关系。后者是基于前者进一步封装出来的。

```

## 基本使用步骤

- 安装：`npm i express`

```js
// 导入 express
const express = require('express');
// 创建 express实例，也就是创建 express服务器
const app = express();

// 启动服务器
app.listen(3000, function () {
  console.log('服务器已启动')
});
```

> 1. 自动识别404
> 2. 

### 监听get请求

直接通过 `app.get()` 方法，可以监听客户端的 GET 请求，具体的语法格式如下：

```js
app.get('/user', (req, res) => {
  res.end('user')
})
```

### 监听post请求

直接通过 `app.post()` 方法，可以监听客户端的 POST 请求，具体的语法格式如下：

```js
app.post('/list', (req, res) => {
  res.end('列表')
})
```

### 响应内容给客户端

通过 res.send() 方法，可以把处理好的内容，发送给客户端：

```js
app.get('/user', (req, res) => {
  res.end('用户');  // 乱码 需要手动设置请求头(chartset=utf-8)
  res.send('用户'); // 不会乱码 自动设置content-type
})
```

> res.end和res.send的区别
>
> 推荐使用res.send, 会帮我们自动识别内容, 无需手动添加content-type



## req扩展属性详解

### 获取get请求的参数

通过 req.query 对象，可以访问到客户端通过查询字符串的形式，发送到服务器的参数：

```js
app.get('/user', (req, res) => {
    console.log(req.query);
});
```

### 获取post请求的参数

通过`req.body`可以获取post请求的参数，但是需要配合`body-parser`中间件

```js
// 1. 先使用urlencoded中间件(这个是用来处理URL-encoded格式(表单)的中间件)
app.use(express.urlencoded({extended: true}));

// 2. post请求可以获取body
app.post('/login', (req, res) => {
	console.log(req.body);
})
```

## res扩展属性详解

- ### res.send([body])

```js
// send() 发送数据给客户端，并自动设置Content-Type
res.send('哈哈');
```

- ### res.sendFile(path [, options] [, fn])

```js
// 发送文件给浏览器，并根据文件后缀名自动设置Content-Type
// 注意：文件路径必须是绝对路径
res.sendFile(path.join(__dirname, 'index.html'));
```

- ### res.set(field [, value])

```js
// 设置响应头
res.set('Content-Type', 'text/plain');
res.set({
  'Content-Type': 'text/plain',
  'cute': 'fangfang'
});
```

- ### res.redirect([status,] path)

```js
// 重定向 
res.redirect('/index');
```



## express路由处理

### 基本使用

+ `app.get(path, callback)`
+ `app.post(path, callback)`

-  `app.use(path, callback)` 
  - 注意：模糊匹配(只要是以path开头的请求地址，都可以被use处理)
  - 注意：可以处理任意的请求类型
  - 注意：path参数可省略，默认值为：`/`
  - 更重要的作用是处理中间件

### 路由的匹配过程

每当一个请求到达服务器之后，需要先经过路由的匹配，只有匹配成功之后，才会调用对应的处理函数。

在匹配时，会按照路由的顺序进行匹配，如果请求类型和请求的 URL 同时匹配成功，则 Express 会将这次请求，转交给对应的 function 函数进行处理。

路由匹配的注意点：

①按照定义的先后顺序进行匹配

②请求类型和请求的URL同时匹配成功，才会调用对应的处理函数



### 全局挂载路由(不推荐)

​     在 Express 中使用路由最简单的方式，就是把路由挂载到 app 上，示例代码如下  

```js
// app.js
// 1.创建路由对象
const express = require('express');
const app = express();

// 2.直接挂载路由到app上
app.get('/index', (res, req) => {
    res.send('首页');
});
app.post('/login', (res, req) => {
    res.send('登录');
});
```



### 模块化路由(推荐)

​	为了方便对路由进行模块化的管理，Express **不建议**将路由直接挂载到 app 上，而是推荐将路由抽离为单独的模块。

将路由抽离为单独模块的步骤如下：

①创建路由模块对应的 .js 文件

②调用 express.Router() 函数创建路由对象

③向路由对象上挂载具体的路由

④使用 module.exports 向外共享路由对象

⑤使用 app.use() 函数注册路由模块

```js
// router.js
// 1.创建路由对象
const express = require('express');
const router = express.Router();

// 2.挂载具体路由
router.get('/index', (res, req) => {
    res.send('首页');
});
router.post('/login', (res, req) => {
    res.send('登录');
});
module.exports = router;

// app.js
// 挂载到app上
const express = require('express');
const router = require('./router');

const app = express();
app.use(router);
```



## 静态资源处理

### 基本使用

> express 提供了一个非常好用的函数，叫做 `express.static()`，通过它，我们可以非常方便地创建一个静态资源服务器，例如，通过如下代码就可以将 public 目录下的图片、CSS 文件、JavaScript 文件对外开放访问了：

```js
const express = require('express');
const app = express();

// 使用内置static中间件, 传入路径
app.use(express.static('public'));

现在，你就可以访问 public 目录中的所有文件了：
http://localhost:3000/images/bg.jpg
http://localhost:3000/css/style.css
http://localhost:3000/js/login.js

注意：Express 在指定的静态目录中查找文件，并对外提供资源的访问路径。
因此，存放静态文件的目录名不会出现在 URL 中。
```

### 托管多个资源目录

如果要托管多个静态资源目录，请多次调用 express.static() 函数：

```js
app.use(express.static('public'));
app.use(express.static('static'));
```

访问静态资源文件时，express.static() 函数会根据目录的添加顺序查找所需的文件。

### 挂载路径前缀

如果希望在托管的静态资源访问路径之前，挂载路径前缀，则可以使用如下的方式：

```js
app.use('/aaa', express.static('public'));

现在，你就可以通过带有'/aaa'的前缀地址来访问 public 目录中的文件了：
http://localhost:3000/public/images/kitten.jpg
http://localhost:3000/public/css/style.css
http://localhost:3000/public/js/app.js
```



## express中间件

### 什么是中间件

中间件（Middleware ），特指业务流程的中间处理环节。

### express中的中间件

当一个请求到达 Express 的服务器之后，可以连续调用多个中间件，从而对这次请求进行预处理。

### 基本使用

Express 的中间件，本质上就是一个 **function** **处理函数**，Express 中间件的格式如下：

```js
const mw = function(req, res, next) {
  // 处理事件
  console.log(req.ip, req.url);
  // 记得结束一定要调用next()
  next();
}

app.use(mw);
```

注意：中间件函数的形参列表中，**必须包含 next 参数**。而路由处理函数中只包含 req 和 res。

next函数的作用： **next** **函数**是实现多个中间件连续调用的关键，它表示把流转关系转交给下一个中间件或路由。

### 中间件的作用

多个中间件之间，**共享同一份** **req** **和** **res**。基于这样的特性，我们可以在上游的中间件中，**统一**为 req 或 res 对象添加自定义的属性或方法，供下游的中间件或路由进行使用。

```js
// 第一个中间件 给req添加一个属性
const mw1= function(req, res, next) {
    req.name = 'zs';
    next();
}

// 第二个中间件就能获取到req中新增的name属性
const mw1= function(req, res, next) {
    console.log(req.name);
    next();
}
app.use(mw1, mw2);
```

### 定义多个中间件

可以使用 app.use() 连续定义多个全局中间件。客户端请求到达服务器之后，会按照中间件定义的先后顺序依次进行调用，示例代码如下：

```js
app.use(function(req, res, next) {
    console.log('调用第一个中间件');
    next();
})
app.use(function(req, res, next) {
    console.log('调用第二个中间件');
    next();
})
app.use(function(req, res, next) {
    console.log('调用第三个中间件');
    next();
})
```

### express内置中间件

自 Express 4.16.0 版本开始，Express 内置了 3 个常用的中间件，极大的提高了 Express 项目的开发效率和体验：

① express.static 快速托管静态资源的内置中间件，例如： HTML 文件、图片、CSS 样式等（无兼容性）

```js
// 详见上述静态资源处理↑
```

② express.json 解析 JSON 格式的请求体数据（有兼容性，仅在 4.16.0+ 版本中可用） 0

```js
// 将json请求体处理成对象, 并放置到req的body属性上
app.use(express.json({extended: true}));
```

③ express.urlencoded 解析 Form-encoded 格式的请求体数据（有兼容性，仅在 4.16.0+ 版本中可用）

```js
// 将表单请求体处理成对象, 并放置到req的body属性上
app.use(express.urlencoded({extended: true}));
```

## express中的模板引擎

```js
/**
 * 为后缀为html的模板设置模板引擎
 * 参数一: 给'.xxx'后缀的文件设置模板引擎
 * 参数二: 模板引擎
 */
app.engine('html', require('express-art-template'))

/**
 * 设置模板文件默认所在的目录
 * 参数一: 固定值
 * 参数二: 设置文件路径
 */
app.set('views', './')

/**
 * 将模板引擎的后缀默认设置为html:
 * 参数一: 固定值
 * 参数二: 后缀格式
 */
app.set('view engine', 'html');

// 渲染 index.html 模板文件，并发送给浏览器
res.render('index', { list: [] })
```
