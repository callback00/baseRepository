// 系统自带的菜单栏目，不受权限影响
export default [
    {
        id: 'accountInfo',
        name: '个人中心',
        icon: 'user',
        children: [
            {
                id: 'accountInfoSetting',
                treeId: ['accountInfo', 'accountInfoSetting'],
                menuType: '1', //写在此js文件内的menuType 必须设置为 '1'
                name: '个人设置',
                menuLink: '/account/setting/base'
            },
            {
                id: 'myNoticeList',
                treeId: ['accountInfo', 'myNoticeList'],
                menuType: '1', //写在此js文件内的menuType 必须设置为 '1'
                name: '我的消息',
                menuLink: '/account/notice/myNoticeList'
            }
        ]
    }
]