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

import BaseLayout from '@/components/layout/shared/BaseLayout'

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
        path: 'dashboard',
        element: (
          <BaseLayout>
            <Dashboard />
          </BaseLayout>
        ),
        loader: () => ({
          title: 'Dashboard',
        }),
      },

      {
        path: 'projects',
        element: (
          <BaseLayout>
            <Project />
          </BaseLayout>
        ),
        loader: () => ({
          title: 'Projects',
        }),
      },
      {
        path: 'projects/:project',
        element: (
          <BaseLayout>
            <ProjectDetailPage />
          </BaseLayout>
        ),
        loader: () => ({
          title: 'Project Detail',
        }),
      },
      {
        path: 'tasks',
        element: (
          <BaseLayout>
            <Tasks />
          </BaseLayout>
        ),
        loader: () => ({
          title: 'Tasks',
        }),
      },
      {
        path: 'task/:githubId',
        element: (
          <BaseLayout>
            <TaskDetailPage />
          </BaseLayout>
        ),
        loader: () => ({
          title: 'TaskDetail',
          description: 'task detail.',
        }),
      },
      {
        path: 'mytasks',
        element: (
          <AuthWrapper requireAuth>
            <BaseLayout>
              <MyTask />
            </BaseLayout>
          </AuthWrapper>
        ),
        loader: () => ({
          title: 'MyTasks',
        }),
      },
      {
        path: 'myrewards',
        element: (
          <AuthWrapper requireAuth>
            <BaseLayout>
              <MyRewards />
            </BaseLayout>
          </AuthWrapper>
        ),
        loader: () => ({
          title: 'MyRewards',
        }),
      },

      {
        path: 'profile',
        element: (
          <AuthWrapper requireAuth>
            <BaseLayout>
              <ProfilePage />
            </BaseLayout>
          </AuthWrapper>
        ),
        loader: () => ({
          title: 'Profile',
        }),
      },
      {
        path: 'admin/period',
        element: (
          <AuthWrapper requireAuth>
            <BaseLayout>
              <PeriodAdmin />
            </BaseLayout>
          </AuthWrapper>
        ),
        loader: () => ({
          title: 'Period',
        }),
      },

      {
        path: 'admin/task-apply',
        element: (
          <AuthWrapper requireAuth>
            <BaseLayout>
              <TaskApplyAdmin />
            </BaseLayout>
          </AuthWrapper>
        ),
        loader: () => ({
          title: 'Task Apply',
        }),
      },
      {
        path: 'admin/completed-task',
        element: (
          <AuthWrapper requireAuth>
            <BaseLayout>
              <CompletedTaskAdmin />
            </BaseLayout>
          </AuthWrapper>
        ),
        loader: () => ({
          title: 'Completed Task',
        }),
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
