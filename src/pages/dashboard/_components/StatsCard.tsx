import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function StatsCard({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) {
  return (
    <Card className="relative bg-transparent">
      <div className="absolute inset-0 bg-white/10 opacity-70" />
      <div className="relative">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            {icon}
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
        </CardContent>
      </div>
    </Card>
  )
}
