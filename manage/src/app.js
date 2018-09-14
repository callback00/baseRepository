import React from 'react'
import ReactDOM from 'react-dom'

import Dashboard from './home/dashboard'

const render = (Component) => {
  ReactDOM.render(<Component />, document.getElementById('app-mount'))
}

render(Dashboard)

// 热加载更新
if (module.hot) {
  module.hot.accept()
}
