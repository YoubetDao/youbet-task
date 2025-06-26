import { Info, List, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import GitHubCalendar, { type ThemeInput } from 'react-github-calendar'

const explicitTheme: ThemeInput = {
  light: ['#EBEDF0', '#E9D7FE', '#C767C6', '#A632A5', '#401340'],
  dark: ['#EBEDF0', '#E9D7FE', '#C767C6', '#A632A5', '#401340'],
}

export default function ContributionsGraph() {
  const contributionItems = [
    {
      id: 1,
      repo: 'YoubetDao/youbet-task',
      contributions: 2,
      stars: 31,
      avatar: '/placeholder.svg?height=40&width=40',
    },
    {
      id: 2,
      repo: 'YoubetDao/the-lottery',
      contributions: 29,
      stars: 1,
      avatar: '/placeholder.svg?height=40&width=40',
    },
  ]

  return (
    <Card className="border-gray-700 bg-card">
      <CardHeader>
        <CardTitle className="text-white">Contributions</CardTitle>
      </CardHeader>
      <CardContent>
        <GitHubCalendar username="dylanguo916" fontSize={12} theme={explicitTheme} />
        <div className="mb-3 flex items-center justify-between pt-4">
          <div className="flex items-center gap-2 text-white">
            <List className="h-5 w-5" />
            <h3 className="font-semibold">Contributions List</h3>
            <Info className="h-4 w-4 text-muted-foreground" />
          </div>
          <Button variant="outline" size="sm" className="border-gray-600 bg-gray-700 text-white hover:bg-gray-600">
            View All
          </Button>
        </div>
        <div className="space-y-2">
          {contributionItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-md bg-gray-700/50 p-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={item.avatar || '/placeholder.svg'} />
                  <AvatarFallback>{item.repo.substring(0, 1).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-white">{item.repo}</p>
                  <p className="text-xs text-muted-foreground">{item.contributions} contributions</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <span>{item.stars}</span>
                <Star className="text-brand-yellow fill-brand-yellow h-4 w-4" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
