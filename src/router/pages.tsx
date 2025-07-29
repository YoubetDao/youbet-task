import Dashboard from '@/pages/dashboard'
import Project from '@/pages/project'
import Login from '@/pages/login'
import Callback from '@/pages/callback'
import ProfilePage from '@/pages/profile'
import MyTask from '@/pages/mytask'
import Tasks from '@/pages/tasks'
import TaskDetailPage from '@/pages/task-detail'
import ErrorPage from '@/pages/error'
import TaskApplyAdmin from '@/pages/task-apply'
import PeriodAdmin from '@/pages/period'
import MyRewards from '@/pages/myrewards'
import CompletedTaskAdmin from '@/pages/admin/completedTask'
import ExpenseAdmin from '@/pages/admin/expense'
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
  taskDetail: TaskDetailPage,
  error: ErrorPage,
  taskApplyAdmin: TaskApplyAdmin,
  completedTaskAdmin: CompletedTaskAdmin,
  expenseAdmin: ExpenseAdmin,
  periodAdmin: PeriodAdmin,
  projectDetail: ProjectDetailPage,
}
