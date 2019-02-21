import React from 'react'
import ReactDOM from 'react-dom'

import Home from './systemPages/home'

const render = (Component) => {
  ReactDOM.render(<Component />, document.getElementById('app-mount'))
}

render(Home)

// 热加载更新
if (module.hot) {
  module.hot.accept()
}
