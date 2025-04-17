import { Card } from '@/components/ui/card'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { SkillTooltip } from '../indexV2'
import { useState } from 'react'
import { useMount } from 'ahooks'
import { userApi } from '@/service/openApi'

interface Props {
  userName: string
}

interface Skill {
  name: string
  value: number
  color: string
  parent?: string
}

const randomColor = () => {
  // H: 0-360, S: 60-100%, L: 40-70% 保证颜色鲜艳且不太浅
  const h = Math.floor(Math.random() * 360)
  const s = Math.floor(Math.random() * 40) + 60
  const l = Math.floor(Math.random() * 30) + 40
  return `hsl(${h}, ${s}%, ${l}%)`
}

export const Skillsets = ({ userName }: Props) => {
  const [skillsData, setSkillsData] = useState({
    mainSkills: [] as Skill[],
    subSkills: [] as Skill[],
  })

  useMount(async () => {
    const { data } = (await userApi.userControllerGetProfileSkillsets(userName)) as any

    const skillset = data.data.skillset

    // Define the type for skillset items
    type SkillsetItem = {
      name: string
      percentage: number
      children: Array<{ name: string; percentage: number }>
    }

    // Process main skills in one map operation
    const mainSkills: Skill[] = skillset.map(({ name, percentage }: SkillsetItem) => ({
      name,
      value: percentage,
      color: randomColor(),
    }))

    // Process sub-skills with flatMap for cleaner code
    const subSkills: Skill[] = skillset.flatMap(
      ({ name, children }: SkillsetItem) =>
        children?.map((child) => ({
          name: child.name,
          value: child.percentage,
          color: randomColor(),
          parent: name,
        })) || [],
    )

    setSkillsData({ mainSkills, subSkills })
  })

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold text-white">Technical Skills</h2>
      <p className="mt-2 text-sm text-gray-400">
        The skills chart displays the technologies and skills detected when we scan the user&apos;s repositories.
      </p>

      <div className="mt-8">
        <div className="h-[600px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              {/* 主要技能环 */}
              <Pie
                data={skillsData.mainSkills}
                cx="50%"
                cy="50%"
                innerRadius="40%"
                outerRadius="60%"
                paddingAngle={0}
                dataKey="value"
                label={({ cx, cy, midAngle, innerRadius, outerRadius, value, name }) => {
                  const RADIAN = Math.PI / 180
                  const radius = innerRadius + (outerRadius - innerRadius) * 1.2
                  const x = cx + radius * Math.cos(-midAngle * RADIAN)
                  const y = cy + radius * Math.sin(-midAngle * RADIAN)
                  return (
                    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                      {name}
                    </text>
                  )
                }}
              >
                {skillsData.mainSkills.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                ))}
              </Pie>
              <Tooltip content={<SkillTooltip />} />

              {/* 子技能环 */}
              <Pie
                data={skillsData.subSkills}
                cx="50%"
                cy="50%"
                innerRadius="65%"
                outerRadius="85%"
                paddingAngle={0.5}
                dataKey="value"
                label={({ cx, cy, midAngle, innerRadius, outerRadius, value, name }) => {
                  const RADIAN = Math.PI / 180
                  const radius = outerRadius * 1.1
                  const x = cx + radius * Math.cos(-midAngle * RADIAN)
                  const y = cy + radius * Math.sin(-midAngle * RADIAN)
                  return (
                    <text
                      x={x}
                      y={y}
                      fill="white"
                      fontSize="12"
                      textAnchor={x > cx ? 'start' : 'end'}
                      dominantBaseline="central"
                    >
                      {name}
                    </text>
                  )
                }}
              >
                {skillsData.subSkills.map((entry, index) => {
                  const parentSkill = skillsData.mainSkills.find((skill) => skill.name === entry.parent)
                  return <Cell key={`subcell-${index}`} fill={parentSkill?.color} fillOpacity={0.6} />
                })}
              </Pie>
              <Tooltip content={<SkillTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  )
}
