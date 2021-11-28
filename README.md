
**分支说明：**

**master分支**：前后端统一开发的版本；可以用于学习nodejs+mongodb+express相关知识；

**dev分支**：进行了前后端分离的版本；用户只关注于前端部分，可忽略服务端；下载下来，即可运行；

**dev-permission分支**：<b color="#87DE75">增加了权限管理(包括页面权限和按钮权限)的功能和顶栏三级菜单显示，完全剥离nodejs后台，使用mockjs模拟数据，让用户只需关注前端，更容易上手学习。目前此分支为正常维护分支。如有需要，请大家clone本分支代码运行。</b>


本文主要讲解dev-permission分支内容：


```bash
  如果对您对此项目有兴趣，可以点 "Star" 支持一下 谢谢！ ^_^
  
  或者您可以 "follow" 一下，我会不断开源更多的有趣的项目
  
  开发环境 windows 64 、nodejs 6.11.0
  
  如有问题请直接在 Issues 中提，或者您发现问题并有非常好的解决方案，欢迎 PR
```

## 技术栈

**前端技术栈：** vue2 + vuex + vue-router + webpack + ES6/7 + less + element-ui

**服务端技术栈：** mockjs

## 参考文档

- [vue](https://vuejs.bootcss.com/v2/guide/)：Vue是一套用于构建用户界面的渐进式框架。

- [vuex](https://vuex.vuejs.org/zh/)：Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式。
 
- [vue-router](https://router.vuejs.org/zh/)：Vue Router 是 Vue.js 官方的路由管理器。
 
- [webpack](https://webpack.js.org/concepts/)：前端模块打包器。
 
- [less](http://lesscss.cn/)：Less 是一门 CSS 预处理语言，它扩展了 CSS 语言，增加了变量、Mixin、函数等特性，使 CSS 更易维护和扩展。
 
 


## 前序准备

**运行前准备：**

   由于此项目是基于nodejs的前后端结合项目，你需要进行nodejs的相关准备工作。项目运行之前，请确保系统已经安装以下应用：
   
   (1)、node (6.0 及以上版本)。使用细节，请参考：[node的下载及安装。](https://nodejs.org/en/download/)
        

## 开发：

1. npm install

**本地运行：**

**npm run serve** 运行之后，会默认打开本地访问路径：http://localhost:8012

**发布：**

**npm run bulid** (生成打包之后的项目文件,此文件主要用于项目部署)。

## 演示
测试账号:

1. username: admin / password: 123456
2. username: editor / password: 123456

注意：

admin：拥有最高权限，可以查看所有的页面和按钮；

editor：只有被赋予权限的页面和按钮才可以看到；


