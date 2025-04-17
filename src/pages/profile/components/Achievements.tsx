import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { userApi } from '@/service/openApi'
import { useMount } from 'ahooks'
import { useState } from 'react'

interface Achievement {
  id: string
  name: string
  description: string
  date: string
  rarity: string
  stats: string
  icon: string
}

export const Achievements = ({ userName }: { userName: string }) => {
  const [achievementsData, setAchievementsData] = useState<Achievement[]>([])
  const [achievementPage, setAchievementPage] = useState(0)
  const achievementsPerPage = 6
  const totalAchievementPages = Math.ceil(achievementsData.length / achievementsPerPage)

  useMount(async () => {
    const { data } = (await userApi.userControllerGetProfileAchievements(userName)) as any

    setAchievementsData(data.data)
  })

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Achievements</h2>
        <p className="text-sm text-gray-400">{achievementsData.length} badges earned</p>
      </div>
      <p className="mt-2 text-sm text-gray-400">
        Showcase your accomplishments and milestones in the developer community.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {achievementsData
          .slice(achievementPage * achievementsPerPage, (achievementPage + 1) * achievementsPerPage)
          .map((achievement) => (
            <div
              key={achievement.id}
              className="group relative overflow-hidden rounded-lg border border-gray-800 bg-gray-900/50 p-4 transition-all hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/10 text-2xl">
                    {achievement.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{achievement.name}</h3>
                    <p className="text-sm text-gray-400">{achievement.description}</p>
                  </div>
                </div>
              </div>

              {/* 添加统计信息 */}
              {achievement.stats && <p className="mt-2 text-xs text-purple-400">{achievement.stats}</p>}

              <div className="mt-4 flex items-center justify-between text-sm">
                <span
                  className={`
                rounded-full px-2 py-1 text-xs
                ${achievement.rarity === 'Common' && 'bg-gray-800 text-gray-300'}
                ${achievement.rarity === 'Uncommon' && 'bg-green-900/50 text-green-400'}
                ${achievement.rarity === 'Rare' && 'bg-blue-900/50 text-blue-400'}
                ${achievement.rarity === 'Epic' && 'bg-purple-900/50 text-purple-400'}
                ${achievement.rarity === 'Legendary' && 'bg-orange-900/50 text-orange-400'}
              `}
                >
                  {achievement.rarity}
                </span>
                <span className="text-gray-500">{achievement.date}</span>
              </div>

              {/* 悬停时显示的光效 */}
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-purple-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </div>
          ))}
      </div>

      {/* 添加翻页控件 */}
      {totalAchievementPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAchievementPage((prev) => Math.max(0, prev - 1))}
            disabled={achievementPage === 0}
          >
            Previous
          </Button>
          <div className="flex items-center gap-2">
            {Array.from({ length: totalAchievementPages }).map((_, index) => (
              <button
                key={index}
                className={`h-2 w-2 rounded-full transition-all ${
                  achievementPage === index ? 'bg-purple-500' : 'bg-gray-700 hover:bg-gray-600'
                }`}
                onClick={() => setAchievementPage(index)}
              />
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAchievementPage((prev) => Math.min(totalAchievementPages - 1, prev + 1))}
            disabled={achievementPage === totalAchievementPages - 1}
          >
            Next
          </Button>
        </div>
      )}
    </Card>
  )
}
