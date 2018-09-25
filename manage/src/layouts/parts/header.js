import React from 'react'
import { Link } from 'react-router-dom'
import auth from '../../utils/auth'

function logout(props) {
    auth.logout();
    props.history.push('/login')
}

const header = function (props) {
    return (
        <div className="system-header">
            <span style={{ fontSize: 16, marginRight: 15 }}><i>{auth.getName()}</i></span>
            {/* <Link className="repassword" to={{ pathname: '/dashboard/repassword' }}>修改密码</Link> */}
            <Link className="repassword" to={{ pathname: '/account/setting/security' }}>修改密码</Link>
            <span onClick={logout.bind(this, props)} className="logout">登出</span>
        </div>
    )
}

export default header