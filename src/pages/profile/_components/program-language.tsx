'use client'

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import * as React from 'react'
import { Bar, BarChart, LabelList, XAxis, YAxis, Cell } from 'recharts'

// const colors = ['#B744B8', '#A379C9', '#ADB9E3', '#ACDDE7', '#9AD5CA']
const colors = ['#C71FF7', '#881EF8', '#1374FC', '#1AC0FF']

const chartConfig = {} satisfies ChartConfig

export interface Languages {
  [key: string]: number
}

export default function ProgramLanguage({ languages = {} as Languages }: { languages?: Languages }) {
  const chartData = Object.entries(languages || {})
    .map(([name, value]) => ({ name, value }))
    .filter((item) => item.value >= 1)
    .sort((a, b) => b.value - a.value)

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle>Languages</CardTitle>
        <CardDescription>{`${chartData.length} technical languages`}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{ left: 0, right: 12 }}
            width={400}
            height={chartData.length * 28}
          >
            {/* <CartesianGrid horizontal={false} /> */}
            <YAxis dataKey="name" type="category" tickLine={false} tickMargin={10} axisLine={false} hide />
            <XAxis dataKey="value" type="number" hide />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <Bar dataKey="value" layout="vertical" radius={4}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
              <LabelList dataKey="value" position="right" offset={8} className="fill-foreground" fontSize={12} />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
