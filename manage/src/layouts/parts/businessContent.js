import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Menu, Icon } from 'antd'

const { SubMenu } = Menu

class BusinessContent extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="system-component">
                {
                    this.props.children
                }
            </div>
        )
    }
}

export default BusinessContent