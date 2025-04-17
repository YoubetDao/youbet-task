import { Card } from '@/components/ui/card'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { SkillTooltip } from '../indexV2'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

export const LanguageTab = () => {
  const [languageData, setLanguageData] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 10
  const totalPages = Math.ceil(languageData.length / itemsPerPage)
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Programming Languages</h2>
        <p className="text-sm text-gray-400">Last updated: April 15, 2024</p>
      </div>
      <p className="mt-2 text-sm text-gray-400">
        The skills chart displays the distribution of programming languages across repositories.
      </p>

      <div className="mt-8">
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={languageData}
                cx="50%"
                cy="50%"
                innerRadius="60%"
                outerRadius="80%"
                paddingAngle={2}
                dataKey="value"
                startAngle={90}
                endAngle={450}
              >
                {languageData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    // 添加3D效果
                    style={{
                      filter: 'drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.5))',
                      transform: `translateZ(${index * 2}px)`,
                    }}
                  />
                ))}
              </Pie>
              <Tooltip content={<SkillTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 语言列表和翻页 */}
        <div className="mt-8">
          <div className="grid grid-cols-4 gap-4">
            {languageData.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage).map((lang) => (
              <div key={lang.name} className="flex items-center gap-3">
                <div
                  className="h-3 w-3 rounded-full shadow-lg"
                  style={{
                    backgroundColor: lang.color,
                    boxShadow: `0 2px 4px ${lang.color}40`,
                  }}
                />
                <span className="text-white">{lang.name}</span>
                <span className="text-gray-400">{lang.value}%</span>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-400">
                Page {currentPage + 1} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
                disabled={currentPage === totalPages - 1}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
