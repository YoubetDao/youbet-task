import { createBrowserRouter } from 'react-router-dom'

// Wrappers
import RootWrapper from '@/wrappers/RootWrapper'
import AuthWrapper from '@/wrappers/AuthWrapper'
import ErrorBoundary from '@/wrappers/ErrorBoundary'

// Pages
import LandingPage from '@/pages/landing'
import Dashboard from '@/pages/dashboard'
import Project from '@/pages/project'
import ProjectDetailPage from '@/pages/projectdetail'
import MyTask from '@/pages/mytask'
import Tasks from '@/pages/tasks'
import TaskDetailPage from '@/pages/task-detail'
import MyRewards from '@/pages/myrewards'
import Login from '@/pages/login'
import Callback from '@/pages/callback'
import ProfilePage from '@/pages/profile'
import TaskApplyAdmin from '@/pages/task-apply'
import PeriodAdmin from '@/pages/period'
import CompletedTaskAdmin from '@/pages/admin/completedTask'
import ErrorPage from '@/pages/error'

import LayoutWrapper from '@/wrappers/LayoutWrapper'

export const router: ReturnType<typeof createBrowserRouter> = createBrowserRouter([
  {
    path: '/',
    Component: RootWrapper,
    ErrorBoundary: ErrorBoundary,
    children: [
      {
        index: true,
        Component: LandingPage,
        loader: () => ({
          title: 'Landing',
          description: 'YouBet Task Platform',
        }),
      },

      {
        path: 'login',
        Component: Login,
        loader: () => ({
          title: 'Login',
          description: 'Authentication forms built using the components.',
        }),
      },
      {
        path: 'auth/github/callback',
        Component: Callback,
        loader: () => ({
          title: 'Callback',
          description: 'Redirect route.',
        }),
      },
      {
        element: <LayoutWrapper />,
        children: [
          {
            path: 'dashboard',
            Component: Dashboard,
            loader: () => ({
              title: 'Dashboard',
            }),
          },
          {
            path: 'projects',
            Component: Project,
            loader: () => ({
              title: 'Projects',
            }),
          },
          {
            path: 'projects/:project',
            Component: ProjectDetailPage,
            loader: () => ({
              title: 'Project Detail',
            }),
          },
          {
            path: 'tasks',
            Component: Tasks,
            loader: () => ({
              title: 'Tasks',
            }),
          },
          {
            path: 'task/:githubId',
            Component: TaskDetailPage,
            loader: () => ({
              title: 'TaskDetail',
            }),
          },
        ],
      },
      {
        element: (
          <AuthWrapper requireAuth>
            <LayoutWrapper />
          </AuthWrapper>
        ),
        children: [
          {
            path: 'mytasks',
            element: <MyTask />,
            loader: () => ({
              title: 'MyTasks',
            }),
          },
          {
            path: 'myrewards',
            element: <MyRewards />,
            loader: () => ({
              title: 'MyRewards',
            }),
          },
          {
            path: 'profile',
            element: <ProfilePage />,
            loader: () => ({
              title: 'Profile',
            }),
          },
          {
            path: 'admin/period',
            element: <PeriodAdmin />,
            loader: () => ({
              title: 'Period',
            }),
          },
          {
            path: 'admin/task-apply',
            element: <TaskApplyAdmin />,
            loader: () => ({
              title: 'Task Apply',
            }),
          },
          {
            path: 'admin/completed-task',
            element: <CompletedTaskAdmin />,
            loader: () => ({
              title: 'Completed Task',
            }),
          },
        ],
      },

      // 404
      {
        path: '*',
        element: <ErrorPage />,
        loader: () => ({
          title: 'Page Not Found',
        }),
      },
    ],
  },
])
