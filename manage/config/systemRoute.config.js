//系统必有组件，无需权限即可显示的菜单或路由
import AccountSetting from '../src/systemPages/account/setting/info'

export default [

    {
        key: 'accountInfo',
        title: '个人中心',
        menuLink: '/account/setting/:name',
        component: AccountSetting
    },
]