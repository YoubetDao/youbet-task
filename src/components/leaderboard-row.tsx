import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
interface LeaderboardRowProps {
  avatarSrc: string
  name: string
  html: string
  completedTasks: number
}

const LeaderboardRow: React.FC<LeaderboardRowProps> = ({ avatarSrc, name, html, completedTasks }) => {
  return (
    <div className="flex items-center">
      <Avatar className="h-9 w-9">
        <AvatarImage src={avatarSrc} alt="Avatar" />
        <AvatarFallback>{name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="ml-4 space-y-1">
        <p className="text-sm font-medium leading-none">{name}</p>
        <p className="text-sm text-muted-foreground">{html}</p>
      </div>
      <div className="ml-auto font-medium">{completedTasks} </div>
    </div>
  )
}

export default LeaderboardRow
