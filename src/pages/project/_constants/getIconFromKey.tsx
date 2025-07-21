import {
  LucideFlame,
  LucideGift,
  LucidePickaxe,
  LucideSparkles,
  LucideSprout,
  LucideThumbsUp,
  LucideZap,
} from 'lucide-react'

export default function getIconFromKey(key: string) {
  return {
    'issues-available': <LucideThumbsUp className="h-4 w-4" />,
    'hot-community': <LucideFlame className="h-4 w-4" />,
    'good-first-issues': <LucideSprout className="h-4 w-4" />,
    'big-whale': <LucideSparkles className="h-4 w-4" />,
    'potential-reward': <LucideGift className="h-4 w-4" />,
    'work-in-progress': <LucidePickaxe className="h-4 w-4" />,
    'fast-and-furious': <LucideZap className="h-4 w-4" />,
  }[key]
}
