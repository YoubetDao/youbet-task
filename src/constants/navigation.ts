import { UserPermission } from '@/store'
import { NavItem } from '@/types'

export const getNavItems = (userPermission?: UserPermission): NavItem[] => {
  const navItems: NavItem[] = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: 'home',
      component: 'dashboard', // 保留兼容性
      layout: 'dashboard', // 保留兼容性
    },
    {
      title: 'Projects',
      href: '/projects',
      icon: 'package',
      component: 'project',
      layout: 'dashboard',
      children: [
        {
          title: 'Project Detail',
          href: '/projects/:project',
          component: 'projectDetail',
          layout: 'dashboard',
          hideInMenu: true,
        },
      ],
    },
    {
      title: 'MyTasks',
      href: '/mytasks',
      icon: 'listChecks',
      component: 'mytask',
      layout: 'dashboard',
    },
    {
      title: 'Tasks',
      href: '/tasks',
      icon: 'layoutListIcon',
      component: 'tasks',
      layout: 'dashboard',
    },
    {
      title: 'MyRewards',
      href: '/myrewards',
      icon: 'circleDollarSignIcon',
      component: 'myrewards',
      layout: 'dashboard',
    },
    {
      title: 'Profile',
      href: '/profile',
      icon: 'profile',
      component: 'profile',
      description: 'My Profile.',
      layout: 'dashboard',
    },
    {
      title: 'Admin',
      href: '#',
      icon: 'settings',
      component: 'error',
      layout: 'dashboard',
      hideInMenu: !userPermission,
      children: [
        {
          title: 'Period',
          href: '/admin/period',
          icon: 'period',
          component: 'periodAdmin',
          layout: 'dashboard',
          hideInMenu: userPermission !== UserPermission.PullRequest && userPermission !== UserPermission.All,
        },
        {
          title: 'Task Apply',
          href: '/admin/task-apply',
          icon: 'clipboardList',
          component: 'taskApplyAdmin',
          layout: 'dashboard',
          hideInMenu: userPermission !== UserPermission.TaskApplies && userPermission !== UserPermission.All,
        },
        {
          title: 'Completed Task',
          href: '/admin/completed-task',
          icon: 'listChecks',
          component: 'completedTaskAdmin',
          layout: 'dashboard',
          hideInMenu: userPermission !== UserPermission.TaskApplies && userPermission !== UserPermission.All,
        },
      ],
    },
  ]

  const filteredNavItems = navItems.filter((item) => !item.disabled)

  return filteredNavItems
}

export const getSafeHrefByTitle = (title: string): string => {
  const item = getNavItems().find((item) => item.title === title)
  return item?.href as string
}
