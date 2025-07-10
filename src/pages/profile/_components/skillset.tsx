'use client'

import React, { useRef, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import ReactECharts from 'echarts-for-react'
import type { SkillsetDto } from '@/openapi/client/models/skillset-dto'

// const colors = ['#B744B8', '#A379C9', '#ADB9E3', '#ACDDE7', '#9AD5CA']
const colors = ['#C71FF7', '#881EF8', '#1374FC', '#1AC0FF']
const bgColor = '#2E2733'

export default function Skillset({
  skillset = [],
  isScanning = false,
}: {
  skillset?: SkillsetDto[]
  isScanning?: boolean
}) {
  const chartRef = useRef<any>(null)
  const data = skillset.map((item, idx) => ({
    name: item.name,
    value: item.percentage,
    itemStyle: { color: colors[idx % colors.length] },
    children: item.children
      .slice()
      .sort((a, b) => b.percentage - a.percentage)
      .map((child) => ({
        name: child.name,
        value: child.percentage,
        itemStyle: { color: colors[idx % colors.length] },
      })),
  }))

  const option = {
    color: colors,
    series: [
      {
        type: 'sunburst',
        center: ['50%', '50%'],
        radius: [0, '100%'],
        data: data,
        sort: undefined,
        emphasis: {
          focus: 'ancestor',
        },
        label: {
          rotate: 'radial',
          color: bgColor,
        },
        itemStyle: {
          borderColor: bgColor,
          borderWidth: 2,
        },
        levels: [
          {},
          {
            r0: '33%',
            r: '60%',
            label: {
              rotate: 0,
              color: bgColor,
            },
          },
          {
            r0: '60%',
            r: '75%',
            itemStyle: {
              borderWidth: 3,
            },
            label: {
              position: 'outside',
              rotate: 0,
              padding: 3,
              silent: false,
              color: '#FFFFFF',
            },
          },
        ],
      },
    ],
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => `${params.name}: ${params.value}%`,
    },
  }

  const loadingOption = {
    text: 'Scanning...',
    color: '#A632A5',
    textColor: '#fff',
    maskColor: 'rgba(17,19,26,0.85)',
    zlevel: 0,
    fontSize: 20,
    spinnerRadius: 30,
    spinnerType: 'circular',
  }

  useEffect(() => {
    const chartInstance = chartRef.current?.getEchartsInstance?.()
    if (chartInstance) {
      if (isScanning) {
        chartInstance.showLoading('default', loadingOption)
      } else {
        chartInstance.hideLoading()
      }
    }
  }, [isScanning])

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-0">
        <CardTitle>Skills</CardTitle>
        <CardDescription>{`${data.length} technical skills`}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 items-center justify-center pb-0">
        <div style={{ width: '100%', maxWidth: 500, aspectRatio: '1 / 1', minHeight: 300, margin: '0 0' }}>
          <ReactECharts
            ref={chartRef}
            option={option}
            style={{ width: '100%', height: '100%' }}
            loadingOption={loadingOption}
            showLoading={false}
          />
        </div>
      </CardContent>
    </Card>
  )
}
