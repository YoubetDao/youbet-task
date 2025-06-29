'use client'

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import React, { useEffect, useRef } from 'react'
import ReactECharts from 'echarts-for-react'

// const colors = ['#B744B8', '#A379C9', '#ADB9E3', '#ACDDE7', '#9AD5CA']
const colors = ['#C71FF7', '#881EF8', '#1374FC', '#1AC0FF']
const bgColor = '#2E2733'

export default function EvaluateRadar({ isScanning = false }: { isScanning?: boolean }) {
  const chartRef = useRef<any>(null)
  const option = {
    // title: {
    //   text: '基础雷达图',
    // },
    color: colors,
    tooltip: {},
    legend: {
      data: ['Score', 'Average'],
      left: 'left',
      top: 'top',
      orient: 'vertical',
      textStyle: {
        color: '#fff',
      },
    },
    radar: {
      // shape: 'circle',
      indicator: [
        { name: 'Reliability', max: 100 },
        { name: 'Influence', max: 100 },
        { name: 'Contribution', max: 100 },
        { name: 'Uniqueness', max: 100 },
        { name: 'Maintainability', max: 100 },
        { name: 'Security', max: 100 },
      ],
    },
    series: [
      {
        name: 'Score vs Average',
        type: 'radar',
        // areaStyle: {normal: {}},
        data: [
          {
            value: [95, 40, 65, 60, 85, 90],
            name: 'Score',
          },
          {
            value: [75, 60, 55, 50, 70, 65],
            name: 'Average',
          },
        ],
      },
    ],
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
      <CardHeader className="pb-4">
        <CardTitle>Evaluate</CardTitle>
        <CardDescription>Know yourself better</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ReactECharts
          ref={chartRef}
          option={option}
          style={{ width: '100%', height: '100%' }}
          loadingOption={loadingOption}
          showLoading={false}
        />
      </CardContent>
    </Card>
  )
}
