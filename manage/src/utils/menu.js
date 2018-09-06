const menu = {

  sys: {
    key: 'sys',
    title: '用户管理',
    icon: 'github',
    child: [

      {
        key: '/dashboard/user/list',
        link: '/dashboard/user/list',
        title: '用户列表',
        style: {
          fontSize: '14px'
        }
      },

      {
        key: '/dashboard/user/add',
        link: '/dashboard/user/add',
        title: '新建用户',
        style: {
          fontSize: '14px'
        }
      },

    ]
  },

  baseReport: {
    key: 'baseReport',
    title: '基础报表',
    icon: 'area-chart',
    child: [
      {
        key: '/dashboard/baseReport/memberReport',
        link: '/dashboard/baseReport/memberReport',
        title: '游客查询',
        style: {
          fontSize: '14px'
        }
      },
      {
        key: '/dashboard/baseReport/auditLogReport',
        link: '/dashboard/baseReport/auditLogReport',
        title: '核销报表',
        style: {
          fontSize: '14px'
        }
      }
    ]
  },

  auditer: {
    key: 'auditer',
    link: '/dashboard/auditerHome',
    title: '核销管理员',
    icon: 'contacts',
  },
}

export default menu
