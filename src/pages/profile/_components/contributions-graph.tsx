import { Info, List, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import GitHubCalendar, { type ThemeInput } from 'react-github-calendar'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { ContributedRepoDto } from '@/openapi/client/models/contributed-repo-dto'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'

const URLS = {
  GITHUB_AVATAR: (username: string) => `https://github.com/${username}.png`,
  GITHUB_REPO: (fullName: string) => `https://github.com/${fullName}`,
  GITHUB_CONTRIBUTIONS: (fullName: string, username: string) =>
    `https://github.com/${fullName}/pulls?q=is%3Apr+is%3Amerged+author%3A${username}`,
} as const

const explicitTheme: ThemeInput = {
  light: ['#EBEDF0', '#E9D7FE', '#C767C6', '#A632A5', '#401340'],
  dark: ['#EBEDF0', '#E9D7FE', '#C767C6', '#A632A5', '#401340'],
}

export default function ContributionsGraph({
  username,
  contributedRepos = [],
}: {
  username: string
  contributedRepos?: ContributedRepoDto[]
}) {
  return (
    <Card className="mb-4 border-gray-700 bg-card">
      <CardHeader>
        <CardTitle className="text-white">Contributions</CardTitle>
      </CardHeader>
      <CardContent>
        <GitHubCalendar username={username} fontSize={12} theme={explicitTheme} />
        <div className="mb-3 flex items-center justify-between pt-4">
          <div className="flex items-center gap-2 text-white">
            <List className="h-5 w-5" />
            <h3 className="font-semibold">Contributions List</h3>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs text-sm">
                Contribution list according to, currently show top2 contribution information, read details to see all.
              </TooltipContent>
            </Tooltip>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="border-gray-600 bg-gray-700 text-white hover:bg-gray-600">
                View All
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Contributions List</DialogTitle>
              </DialogHeader>
              <div className="max-h-[60vh] space-y-2 overflow-y-auto pt-2">
                {contributedRepos.map((item) => (
                  <div key={item.fullName} className="flex items-center justify-between rounded-md bg-gray-700/50 p-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={URLS.GITHUB_AVATAR(item.fullName.split('/')[0])} />
                        <AvatarFallback>{item.fullName.substring(0, 1).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div>
                          <a
                            href={URLS.GITHUB_REPO(item.fullName)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-white hover:underline"
                          >
                            {item.fullName}
                          </a>
                        </div>
                        <div>
                          <a
                            href={URLS.GITHUB_CONTRIBUTIONS(item.fullName, username)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-muted-foreground hover:underline"
                          >
                            {item.contributions} contributions
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <span>{item.stargazerCount}</span>
                      <Star className="text-brand-yellow fill-brand-yellow h-4 w-4" />
                    </div>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="space-y-2">
          {contributedRepos.slice(0, 2).map((item) => (
            <div key={item.fullName} className="flex items-center justify-between rounded-md bg-gray-700/50 p-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={URLS.GITHUB_AVATAR(item.fullName.split('/')[0])} />
                  <AvatarFallback>{item.fullName.substring(0, 1).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <div>
                    <a
                      href={URLS.GITHUB_REPO(item.fullName)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-white hover:underline"
                    >
                      {item.fullName}
                    </a>
                  </div>
                  <div>
                    <a
                      href={URLS.GITHUB_CONTRIBUTIONS(item.fullName, username)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted-foreground hover:underline"
                    >
                      {item.contributions} contributions
                    </a>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <span>{item.stargazerCount}</span>
                <Star className="text-brand-yellow fill-brand-yellow h-4 w-4" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
