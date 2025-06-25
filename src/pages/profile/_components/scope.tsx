import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trophy } from 'lucide-react'

const scopeItems = [
  { id: 1, label: 'Points', value: '160' },
  { id: 2, label: 'Rewards', value: '0.00000' },
  { id: 3, label: 'To Claim', value: '0.00000' },
]

export default function Scope() {
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
