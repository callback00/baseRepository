/**
 * 本工具类用于加载按需加载的组件
 */
import React from 'react'

class Bundle extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      mod: null
    }
  }

  componentWillMount() {
    this.load(this.props)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.load !== this.props.load) {
      this.load(nextProps)
    }
  }

  load(props) {
    this.setState({
      mod: null
    })

    props.load((mod) => {
      this.setState({
        // handle both es imports and cjs
        mod: mod.default ? mod.default : mod
      })
    })
  }

  render() {
    if (!this.state.mod) {
      return null
    }

    return this.props.children(this.state.mod)
  }
}

export default Bundle
