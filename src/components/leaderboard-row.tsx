import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
interface LeaderboardRowProps {
  avatarSrc: string
  name: string
  bio: string
  completedTasks: number
}

const LeaderboardRow: React.FC<LeaderboardRowProps> = ({ avatarSrc, name, bio, completedTasks }) => {
  const githubUrl = `https://github.com/${name}`

  return (
    <a href={githubUrl} target="_blank" rel="noopener noreferrer">
      <div className="mb-6 flex items-start">
        <Avatar className="h-9 w-9">
          <AvatarImage src={avatarSrc} alt="Avatar" />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="ml-4 flex w-0 flex-1 flex-col flex-wrap space-y-1 break-words">
          <p className="w-full text-sm font-medium leading-none">{name}</p>
          <p className="!line-clamp-5 w-full text-sm text-muted-foreground">{bio}</p>
        </div>
        <div className="ml-2 shrink-0 font-medium">{completedTasks} </div>
      </div>
    </a>
  )
}

export default LeaderboardRow
