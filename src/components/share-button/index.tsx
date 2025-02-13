import { Button, ButtonProps } from '@/components/ui/button'
import { Share2 } from 'lucide-react'

interface Props extends ButtonProps {
  iconSize?: number
}
export const ShareButton = ({ iconSize = 18, children, ...props }: Props) => {
  return (
    <Button title="Share on X (Twitter)" {...props}>
      <Share2 size={iconSize} />
      {children}
    </Button>
  )
}
