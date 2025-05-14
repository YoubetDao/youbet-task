import Dashboard from '@/pages/dashboard'
import Project from '@/pages/project'
import Login from '@/pages/login'
import Callback from '@/pages/callback'
import ProfilePage from '@/pages/profile'
import MyTask from '@/pages/mytask'
import Tasks from '@/pages/tasks'
import Tutorial from '@/pages/tutorial'
import Tutorials from '@/pages/tutorials'
import TaskDetailPage from '@/pages/task-detail'
import ErrorPage from '@/pages/error'
import PullRequestAdmin from '@/pages/pull-request'
import TaskApplyAdmin from '@/pages/task-apply'
import PeriodAdmin from '@/pages/period'
import MyRewards from '@/pages/myrewards'
import CompletedTaskAdmin from '@/pages/admin/completedTask'
import LandingPage from '@/pages/landing'
import ProjectDetailPage from '@/pages/projectdetail'

export const Pages = {
  landing: LandingPage,
  dashboard: Dashboard,
  mytask: MyTask,
  tasks: Tasks,
  myrewards: MyRewards,
  project: Project,
  login: Login,
  callback: Callback,
  profile: ProfilePage,
  tutorial: Tutorial,
  tutorials: Tutorials,
  taskDetail: TaskDetailPage,
  error: ErrorPage,
  pullRequestAdmin: PullRequestAdmin,
  taskApplyAdmin: TaskApplyAdmin,
  completedTaskAdmin: CompletedTaskAdmin,
  periodAdmin: PeriodAdmin,
  projectDetail: ProjectDetailPage,
}
