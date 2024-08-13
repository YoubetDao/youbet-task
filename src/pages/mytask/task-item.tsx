import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Task } from '@/types'
import { CircleCheck, CircleDot } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { Link } from 'react-router-dom'

export const TaskItem = ({ item }: { item: Task }) => {
  console.log(item)
  return (
    <Link to={`/projects/xx/tasks`}>
      <Card className="flex flex-col bg-gray-800 shadow-lg rounded-lg h-52">
        <CardContent className="flex-1 p-4">
          <div className="flex flex-col justify-between h-full overflow-hidden rounded">
            {/* <div>
              {item.body && (
                <div className="text-base text-gray-300 leading-relaxed">
                  <ReactMarkdown>{item.body}</ReactMarkdown>
                </div>
              )}
            </div> */}
            <div className="flex flex-row items-center">
              {item.state === 'open' ? (
                <CircleDot className="w-6 h-6 text-green-600" />
              ) : (
                <CircleCheck className="w-6 h-6 text-purple-600" />
              )}
              <Button asChild variant="link" className="text-xl font-semibold text-white">
                <a href={item.htmlUrl} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300">
                  {item.title}
                </a>
              </Button>
            </div>

            <div className="flex justify-between gap-2 mt-8">
              <div className="flex gap-1 items-center text-sm text-gray-400 font-medium">
                {/* <img
                className="w-6 h-6 rounded-full border-2 border-gray-600"
                src={item.assignee?.avatarUrl}
                alt="User Avatar"
              /> */}
                {/* <p className="leading-none ">{item.assignee?.login}</p> */}
                <span className="">Started : {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}</span>
              </div>
              <Button asChild variant="default" className="hover:bg-purple-700">
                <a href={item.htmlUrl} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300">
                  View Task
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

// function TaskItem({ item }: { item: Task }) {
//   return (
//     <Link to={`/projects/${item.name}/tasks`}>
//       <article className="rounded-2xl p-4 lg:p-6 cursor-pointer border group z-[1] duration-200 ease-in hover:border hover:border-opacity-80 hover:bg-white/10 relative w-full !pr-0 !pt-0 transition-all hover:scale-[0.998]">
//         <div className="flex gap-5">
//           {/* 头像 */}
//           <div className="pt-4">
//             <Avatar>
//               <AvatarImage src={item.owner.avatarUrl} />
//               <AvatarFallback>{item.owner.login}</AvatarFallback>
//             </Avatar>
//           </div>
//           <div className="pt-4 pr-4 overflow-hidden">
//             <div className="flex items-center w-full gap-2">
//               <div className="flex-1 overflow-hidden text-2xl font-bold whitespace-nowrap text-ellipsis">
//                 {item.name}
//               </div>
//               <div className="flex gap-2 ">
//                 {/* {__randomPickTags([
//                   'issues-available',
//                   'hot-community',
//                   'newbies-welcome',
//                   'big-whale',
//                   'likely-to-be-reward',
//                   'work-in-progress',
//                   'fast-and-furious',
//                 ])} */}
//               </div>
//             </div>
//             <div className="mt-2 text-sm text-muted-foreground">
//               {item.description || 'Decentralized social built with Nostr and powered by Starknet account abstraction.'}
//             </div>
//             <div className="flex gap-4 mt-5 text-xs">
//               <div className="flex items-center justify-center gap-1">
//                 <Avatar className="w-4 h-4">
//                   <AvatarImage src={item.owner.avatarUrl} />
//                   <AvatarFallback>{item.owner.login}</AvatarFallback>
//                 </Avatar>
//                 <span>project owner</span>
//               </div>
//               <div className="flex items-center justify-center gap-1">
//                 <LucideUser className="w-4 h-4" />
//                 {Math.floor(Math.random() * 100)} contributors
//               </div>
//               <div>Ecosystems</div>
//               <div>Languages</div>
//             </div>
//           </div>
//         </div>
//       </article>
//     </Link>
//   )
// }
