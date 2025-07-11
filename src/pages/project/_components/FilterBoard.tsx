import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import getIconFromKey from '../_constants/getIconFromKey'
import { Button } from '@/components/ui/button'
import { LucideRefreshCcw } from 'lucide-react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface FilterBoardProps {
  filterTags: string[]
  setFilterTags: (tags: string[]) => void
}

export default function FilterBoard({ filterTags, setFilterTags }: FilterBoardProps) {
  const tags = [
    {
      label: 'Hot Community',
      value: 'hot-community',
      icon: getIconFromKey('hot-community'),
    },
    {
      label: 'Good First Issues',
      value: 'good-first-issues',
      icon: getIconFromKey('good-first-issues'),
    },
    {
      label: 'Potential Reward',
      value: 'potential-reward',
      icon: getIconFromKey('potential-reward'),
    },
  ]

  return (
    <div className="w-full flex-shrink-0 pt-4 lg:w-48 xl:w-96">
      <Card className="sticky left-0 top-0 bg-transparent">
        <CardHeader className="py-4">
          <CardTitle className="relative text-lg">
            <span>Filter</span>
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-0 top-1/2 flex -translate-y-1/2 cursor-pointer items-center gap-1 text-xs text-primary hover:text-primary"
              onClick={() => setFilterTags([])}
            >
              <LucideRefreshCcw className="h-3 w-3" />
              Clear all
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-y-4">
          {/* filter */}
          <ToggleGroup type="multiple" value={filterTags} onValueChange={setFilterTags}>
            {tags.map((tag) => (
              <ToggleGroupItem key={tag.value} size="sm" value={tag.value}>
                {tag.icon}
                {tag.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <div className="space-y-3 border-t border-muted pt-2">
            <Label>Languages</Label>
            <Select>
              <SelectTrigger className="w-full max-w-[180px]">
                <SelectValue placeholder="Select Languages..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solidity">Solidity</SelectItem>
                <SelectItem value="rust">Rust</SelectItem>
                <SelectItem value="move">Move</SelectItem>
                <SelectItem value="typescript">Typescript</SelectItem>
                <SelectItem value="javascript">javascript</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
