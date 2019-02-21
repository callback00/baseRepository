//系统必有组件，无需权限即可显示的菜单或路由
import AccountSetting from '../src/systemPages/account/setting/info'
import MyNoticesHome from '../src/systemPages/account/myNotices/myNoticesHome'
import NoticeDetail from '../src/systemPages/account/myNotices/noticeDetail'

export default [

    {
        key: 'accountInfo',
        title: '个人中心',
        menuLink: '/account/setting/:name',
        component: AccountSetting
    },
    {
        key: 'myMessageList',
        title: '我的消息',
        menuLink: '/account/notice/myNoticeList',
        component: MyNoticesHome
    },
    // {
    //     key: 'myMessageDetail',
    //     title: '消息详情',
    //     menuLink: '/account/notice/noticeDetail/:detailId',
    //     component: NoticeDetail
    // }
]