import React from 'react'
import ReactDOM from 'react-dom'

import Home from './systemPages/home'

// webpack是预加载文件，require 不接受变量路径。
// 利用require.context将components文件下的所有js引入进来
const context = require.context('.', true, /^\.\/components\/.*\.js$/);//参数3正则介绍：扫描../components/目录下所有以.js结尾的文件
// console.log(context.keys());//获取正则js目录下文件，转化成数组形势输出

const render = (Component) => {
  ReactDOM.render(<Component comContext={context} />, document.getElementById('app-mount'))
}

render(Home)

// 热加载更新
if (module.hot) {
  module.hot.accept()
}
