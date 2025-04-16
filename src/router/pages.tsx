import Dashboard from '@/pages/dashboard'
import Project from '@/pages/project'
import Login from '@/pages/login'
import Callback from '@/pages/callback'
import ProfilePage from '@/pages/profile'
import MyTask from '@/pages/mytask'
import Tutorial from '@/pages/tutorial'
import Tutorials from '@/pages/tutorials'
import TaskDetailPage from '@/pages/task-detail'
import ErrorPage from '@/pages/error'
import PullRequestAdmin from '@/pages/pull-request'
import TaskApplyAdmin from '@/pages/task-apply'
import PeriodAdmin from '@/pages/period'
import MyRewards from '@/pages/myrewards'
import CompletedTaskAdmin from '@/pages/admin/completedTask'
import ProjectDetailPage from '@/pages/projectdetail'
import ProfilePageV2 from '@/pages/profile/indexV2'

export const Pages = {
  dashboard: Dashboard,
  mytask: MyTask,
  myrewards: MyRewards,
  project: Project,
  login: Login,
  callback: Callback,
  profile: ProfilePage,
  profileV2: ProfilePageV2,
  tutorial: Tutorial,
  tutorials: Tutorials,
  taskDetail: TaskDetailPage,
  error: ErrorPage,
  pullRequestAdmin: PullRequestAdmin,
  taskApplyAdmin: TaskApplyAdmin,
  completedTaskAdmin: CompletedTaskAdmin,
  periodAdmin: PeriodAdmin,
  projectDetail: ProjectDetailPage,
} as const
