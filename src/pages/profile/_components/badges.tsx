import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Trophy } from 'lucide-react'
import type { AchievementDto } from '@/openapi/client/models/achievement-dto'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export default function Badges({ achievements = [] }: { achievements?: AchievementDto[] }) {
  const totalAchievements = achievements.length

  return (
    <Card className="border-gray-700 bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-xl text-white">Achievements</CardTitle>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="default"
              size="sm"
              className="border-gray-600 bg-gray-700 px-4 py-2 text-white hover:bg-gray-600"
            >
              View All
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>All Achievements</DialogTitle>
            </DialogHeader>
            <div className="max-h-[60vh] space-y-2 overflow-y-auto pt-2">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="flex items-center gap-4 rounded-md bg-gray-700/50 p-3">
                  <div className="bg-purple-medium flex h-12 w-12 items-center justify-center rounded-full">
                    {/* 可根据 achievement.icon 渲染图片或 Trophy 图标 */}
                    <Trophy className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-white">{achievement.name}</div>
                    <div className="text-xs text-muted-foreground">{achievement.description}</div>
                    <div className="mt-1 text-xs text-gray-400">
                      <span>Stats: {achievement.stats}</span>
                      <span className="ml-4">Rarity: {achievement.rarity}</span>
                      <span className="ml-4">
                        {new Date(achievement.date).toLocaleDateString('zh-CN', {
                          timeZone: 'Asia/Shanghai',
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
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
