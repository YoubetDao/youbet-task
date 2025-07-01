import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trophy } from 'lucide-react'

export interface ScopeItem {
  id: number | string
  label: string
  value: string | number
}

export default function Scope({ scopeItems = [] }: { scopeItems: ScopeItem[] }) {
  return (
    <Card className="border-gray-700 bg-card">
      <CardHeader>
        <CardTitle className="text-white">Scope</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {scopeItems.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <div className="rounded-full bg-gray-700 p-2">
              <Trophy className="text-purple-medium h-5 w-5" />
            </div>
            <div>
              <span className="text-lg font-semibold text-white">{item.value}</span>
              <span className="ml-2 text-sm text-muted-foreground">{item.label}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
