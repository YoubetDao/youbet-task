import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'

interface Props {
  isVisible: boolean
  onClose: () => void
  targetButtonRef: React.RefObject<HTMLButtonElement>
}

export function OnboardingGuide({ isVisible, onClose }: Props) {
  const [showWelcome, setShowWelcome] = useState(isVisible)

  useEffect(() => {
    setShowWelcome(isVisible)
  }, [isVisible])

  return (
    <Dialog
      open={showWelcome}
      onOpenChange={(open) => {
        setShowWelcome(open)
        if (!open) onClose()
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Welcome to Your Developer Profile!</DialogTitle>
          <DialogDescription className="mt-4 text-base">
            Let&apos;s get started by analyzing your GitHub contributions and impact.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 space-y-6">
          <div className="space-y-4">
            <Card className="p-4">
              <h4 className="mb-2 font-medium text-white">Step 1: Repository Scan</h4>
              <p className="text-sm text-gray-400">
                Click the &quot;Scan&quot; button to analyze your GitHub repositories and calculate your developer
                score.
              </p>
            </Card>

            <Card className="p-4">
              <h4 className="mb-2 font-medium text-white">Step 2: View Analysis</h4>
              <p className="text-sm text-gray-400">
                Explore your developer score, contribution patterns, and skill distribution.
              </p>
            </Card>

            <Card className="p-4">
              <h4 className="mb-2 font-medium text-white">Step 3: Track Progress</h4>
              <p className="text-sm text-gray-400">
                Monitor your growth and achievements over time through regular updates.
              </p>
            </Card>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              className="w-full bg-purple-500 hover:bg-purple-600"
              onClick={() => {
                setShowWelcome(false)
                onClose()
              }}
            >
              Get Started
            </Button>
            <p className="text-center text-xs text-gray-400">
              You can always rescan your repositories to update your profile.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
