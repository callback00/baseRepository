//系统必有组件，无需权限即可显示的菜单或路由

const systemMenu = [

    {
        id: 'accountInfo',
        name: '个人主页',
        icom: 'user',
        children: [
            {
                id: 'accountInfoSetting',
                treeId: ['accountInfo', 'accountInfoSetting'],
                name: '个人设置',
                menuLink: '/account/setting/base'
            }
        ]
    }

]

export default {
    getDefaultMenu() {
        return systemMenu;
    }
}