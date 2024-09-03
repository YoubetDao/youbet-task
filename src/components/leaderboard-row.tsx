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
      <div className="flex items-start mb-6">
        <Avatar className="w-9 h-9">
          <AvatarImage src={avatarSrc} alt="Avatar" />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col flex-wrap flex-1 space-y-1 ml-4 w-0 break-words">
          <p className="w-full font-medium text-sm leading-none">{name}</p>
          <p className="!line-clamp-5 w-full text-muted-foreground text-sm">{bio}</p>
        </div>
        <div className="ml-2 font-medium shrink-0">{completedTasks} </div>
      </div>
    </a>
  )
}

export default LeaderboardRow
