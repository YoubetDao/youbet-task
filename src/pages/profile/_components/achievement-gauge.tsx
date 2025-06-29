import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'
import ReactECharts from 'echarts-for-react'

// const colors = ['#B744B8', '#A379C9', '#ADB9E3', '#ACDDE7', '#9AD5CA']
const colors = ['#C71FF7', '#881EF8', '#1374FC', '#1AC0FF']
export default function AchievementGauge({ score = 66, percent = 76.54 }: { score: number; percent: number }) {
  const option = {
    series: [
      {
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        center: ['50%', '70%'],
        radius: '100%',
        min: 0,
        max: 1,
        splitNumber: 4,
        axisLine: {
          lineStyle: {
            width: 16,
            color: [
              [0.25, colors[3]],
              [0.5, colors[2]],
              [0.75, colors[1]],
              [1, colors[0]],
            ],
          },
        },
        pointer: {
          icon: 'rect',
          length: '0%',
          width: 6,
          offsetCenter: [0, '-50%'],
          itemStyle: {
            color: '#fff',
          },
        },
        axisTick: {
          length: 4,
          lineStyle: {
            color: 'auto',
            width: 1,
          },
        },
        splitLine: {
          length: 12,
          lineStyle: {
            color: '#fff',
            width: 2,
          },
        },
        axisLabel: {
          color: '#fff',
          fontSize: 16,
          distance: -48,
          rotate: 'tangential',
          formatter: function (value: number) {
            if (value === 0.875) return 'Excellent'
            if (value === 0.625) return 'Good'
            if (value === 0.375) return 'Average'
            if (value === 0.125) return 'Poor'
            return ''
          },
        },
        title: {
          show: true,
          offsetCenter: [0, '30%'],
          fontSize: 16,
          color: '#fff',
        },
        detail: {
          fontSize: 32,
          fontWeight: 'bold',
          offsetCenter: [0, '-10%'],
          valueAnimation: true,
          formatter: function () {
            return score
          },
          color: '#fff',
        },
        data: [
          {
            value: score / 100,
            name: `Above ${percent}% developers`,
          },
        ],
        itemStyle: {
          shadowColor: 'rgba(0,0,0,0.2)',
          shadowBlur: 8,
        },
        backgroundColor: 'transparent',
      },
    ],
    backgroundColor: 'transparent',
    grid: { left: 0, right: 0, top: 0, bottom: 0 },
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl text-white">Achievement</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div style={{ width: '100%', maxWidth: 340, aspectRatio: '1.2 / 1', margin: '0 auto' }}>
          <ReactECharts option={option} style={{ width: '100%', height: '100%' }} />
        </div>
      </CardContent>
    </Card>
  )
}
