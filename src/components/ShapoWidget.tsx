import { useEffect, useRef } from 'react'

interface ShapoWidgetProps {
  widgetId: string
  className?: string
}

const ShapoWidget: React.FC<ShapoWidgetProps> = ({ widgetId, className = '' }) => {
  const widgetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 检查脚本是否已加载
    const isScriptLoaded = document.getElementById('shapo-embed-js')

    if (!isScriptLoaded) {
      // 动态加载Shapo脚本
      const script = document.createElement('script')
      script.id = 'shapo-embed-js'
      script.type = 'text/javascript'
      script.src = 'https://cdn.shapo.io/js/embed.js'
      script.defer = true
      document.head.appendChild(script)
    }

    // 清理函数：组件卸载时清理
    return () => {
      // 可选：清理widget相关的事件监听器等
    }
  }, [])

  return <div id={`shapo-widget-${widgetId}`} className={className} ref={widgetRef} />
}

export default ShapoWidget
