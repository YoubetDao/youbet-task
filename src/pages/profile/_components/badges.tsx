import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Trophy, type LucideIcon } from 'lucide-react'

interface Achievement {
  id: number
  name: string
  icon: LucideIcon
}

const achievementsData: Achievement[] = [
  { id: 1, name: 'Code Master', icon: Trophy },
  { id: 2, name: 'Git Guru', icon: Trophy },
  { id: 3, name: 'React Rockstar', icon: Trophy },
  { id: 4, name: 'TypeScript Titan', icon: Trophy },
  { id: 5, name: 'Top Contributor', icon: Trophy },
  { id: 6, name: 'Community Champion', icon: Trophy },
  { id: 7, name: 'Bug Hunter', icon: Trophy },
  { id: 8, name: 'Perfect Pull Request', icon: Trophy },
]

export default function Badges() {
  const totalAchievements = 12

  return (
    <Card className="border-gray-700 bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-xl text-white">Achievements</CardTitle>
        <Button
          variant="default"
          size="sm"
          className="border-gray-600 bg-gray-700 px-4 py-2 text-white hover:bg-gray-600"
        >
          View All
        </Button>
      </CardHeader>
      <CardContent className="pt-2">
        <TooltipProvider delayDuration={100}>
          <div className="mb-6 grid grid-cols-4 gap-4">
            {achievementsData.map((achievement) => (
              <Tooltip key={achievement.id}>
                <TooltipTrigger asChild>
                  <div className="bg-purple-medium flex aspect-square cursor-pointer items-center justify-center rounded-full transition-transform hover:scale-105">
                    <achievement.icon className="h-8 w-8 text-white" />
                  </div>
                </TooltipTrigger>
                <TooltipContent className="bg-white text-black">
                  <p>{achievement.name}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
        <p className="text-center text-sm text-muted-foreground">
          {totalAchievements} Recognitions and Milestones Achieved
        </p>
      </CardContent>
    </Card>
  )
}
