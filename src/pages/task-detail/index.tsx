import { useMd } from '@/components/md-renderer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChevronLeft, FilePenLine } from 'lucide-react'
import UtterancesComments from './_components/UtterancesComments'
import { useNavigate, useParams } from 'react-router-dom'
import { LoadingCards } from '@/components/loading-cards'
import ErrorPage from '../error'
import { useTask } from './_hooks'
import QuestLog from './_components/QuestLog'

export default function TaskDetailPage() {
  const { githubId } = useParams()
  const { data: task, isInitialLoading: loading } = useTask(githubId)
  const { MdRenderer } = useMd(task?.body || '')
  const navigate = useNavigate()

  if (loading) {
    return <LoadingCards />
  }

  if (task == null) {
    return <ErrorPage />
  }

  return (
    <>
      <div className="mb-5 flex cursor-pointer" onClick={() => navigate(-1)}>
        <ChevronLeft />
        <span className="pl-2">Go Back</span>
      </div>
      <div className="mt-5 flex w-full flex-col-reverse gap-5 xl:flex-row">
        <article className="flex w-full flex-col gap-5">
          <header>
            <h1 className="text-4xl font-bold">{task.title}</h1>
          </header>
          <div className="flex flex-row gap-3">
            {task.labelsWithColor &&
              task.labelsWithColor.length > 0 &&
              task.labelsWithColor.map((label, index) => (
                <Badge key={index} variant="outline" style={{ backgroundColor: label.color }}>
                  {label.name}
                </Badge>
              ))}
          </div>
          <div className="flex w-full flex-row">
            <div className="mr-4 flex flex-1 flex-col items-start gap-10">
              <MdRenderer />
              <div className="flex w-full flex-row items-center justify-between">
                <Button variant="link" className="gap-3 text-blue-500">
                  <FilePenLine className="h-5 w-5" />
                  <a href={task.htmlUrl} target="_blank" rel="noopener noreferrer">
                    Edit it in Github
                  </a>
                </Button>
                <span className="text-l text-slate-500">Updated At: {task.updatedAt}</span>
              </div>

              <div className="w-full">
                <UtterancesComments task={task} />
              </div>
            </div>
          </div>
        </article>

        <QuestLog createUser={task.user?.login || ''} />
      </div>
    </>
  )
}
