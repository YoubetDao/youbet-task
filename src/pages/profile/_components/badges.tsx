import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Trophy } from 'lucide-react'
import type { AchievementDto } from '@/openapi/client/models/achievement-dto'

export default function Badges({ achievements = [] }: { achievements?: AchievementDto[] }) {
  const totalAchievements = achievements.length

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
        <div className="mb-6 grid grid-cols-4 gap-4">
          {achievements.map((achievement) => (
            <Tooltip key={achievement.id}>
              <TooltipTrigger asChild>
                <div className="bg-purple-medium flex aspect-square cursor-pointer items-center justify-center rounded-full transition-transform hover:scale-105">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-white text-black">
                <div className="font-bold">{achievement.name}</div>
                {/* <div className="text-xs">{achievement.description}</div>
                <div className="text-xs text-gray-500">{achievement.stats}</div>
                <div className="text-xs text-gray-500">{achievement.rarity}</div> */}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
        <p className="text-center text-sm text-muted-foreground">
          {totalAchievements} Recognitions and Milestones Achieved
        </p>
      </CardContent>
    </Card>
  )
}
