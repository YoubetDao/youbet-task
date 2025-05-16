import { useState, forwardRef } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Scan } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { Switch } from '@/components/ui/switch'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

interface Props {
  userName: string
  onScanComplete?: () => void
}

export const ScanButton = forwardRef<HTMLButtonElement, Props>(({ userName, onScanComplete }, ref) => {
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [scanPrivate, setScanPrivate] = useState(false)
  const { toast } = useToast()

  const startScan = async () => {
    try {
      // 先开始扫描进度
      setIsScanning(true)
      setScanProgress(0)

      // 模拟5秒的扫描过程
      const totalTime = 5000 // 5秒
      const interval = 100 // 每 100ms 更新一次
      const stepValue = 2 // 每次增加 2%

      const progressInterval = setInterval(() => {
        setScanProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval)
            return 100
          }
          return Math.min(prev + stepValue, 100)
        })
      }, interval)

      // 等待扫描完成
      await new Promise((resolve) => setTimeout(resolve, totalTime))

      // 扫描完成后显示成功提示
      toast({
        title: 'Scan Complete',
        description: 'Repository scan completed successfully',
      })

      // 等待 1 秒后关闭弹窗
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsScanning(false)
      setShowAuthDialog(false)

      if (onScanComplete) {
        onScanComplete()
      }
    } catch (error) {
      console.error('Error scanning repositories:', error)
      toast({
        title: 'Error',
        description: 'Failed to scan repositories',
        variant: 'destructive',
      })
      setIsScanning(false)
    }
  }

  const handleScan = () => {
    setShowAuthDialog(true)
  }

  return (
    <>
      <Button
        ref={ref}
        variant="outline"
        size="sm"
        className="scan-button flex items-center gap-1.5 rounded-lg border-0 bg-[#1C1A27] px-4 py-2 text-sm font-medium text-white hover:bg-[#1C1A27]/80"
        onClick={handleScan}
        disabled={isScanning}
      >
        <Scan className="h-4 w-4" />
        {isScanning ? 'Scanning...' : 'Scan Now'}
      </Button>

      {/* GitHub 验证对话框 */}
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <div className="flex items-start justify-between">
            <DialogHeader>
              <DialogTitle className="text-2xl">GitHub Authorization</DialogTitle>
              <DialogDescription className="mt-4 text-base">
                Connect your GitHub account to analyze your developer profile. We&apos;ll collect your public data
                including name, avatar, and repositories.
              </DialogDescription>
            </DialogHeader>
            <div>
              <button
                onClick={() => setShowAuthDialog(false)}
                className="flex h-4 w-4 items-center justify-center opacity-70 hover:opacity-100"
              >
                {}
              </button>
            </div>
          </div>

          <div className="py-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={`https://github.com/${userName}.png`} />
                <AvatarFallback>{userName[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-medium text-white">{userName}</h3>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-white">Include private repositories</span>
              </div>
              <Switch checked={scanPrivate} onCheckedChange={setScanPrivate} />
            </div>

            <p className="mt-6 text-sm text-gray-400">
              By clicking Start Scan, you agree to our{' '}
              <a href="#" className="text-purple-400 hover:underline">
                terms of service
              </a>{' '}
              (updated July 2024).
            </p>
          </div>

          {isScanning ? (
            <div className="py-4">
              <Progress value={scanProgress} className="h-2 w-full" />
              <p className="mt-2 text-center text-sm text-gray-400">{scanProgress}% Complete</p>
            </div>
          ) : (
            <Button className="w-full bg-black text-white hover:bg-black/90" onClick={startScan}>
              Start Scan
            </Button>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
})

ScanButton.displayName = 'ScanButton'
