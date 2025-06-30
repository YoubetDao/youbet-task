import coming_soon from '@/assets/images/coming-soon.png'
import { Card, CardTitle, CardDescription, CardContent, CardFooter, CardHeader } from '@/components/ui/card'

interface ComingSoonProps {
  title?: string
  description?: string
  imageSrc?: string
  mainText?: string
  subText?: string
}

export default function ComingSoon({
  title = 'Language',
  description = 'Null technical languages',
  imageSrc = coming_soon,
  mainText = 'Content will be available soon',
  subText = 'This session is under construction.',
}: ComingSoonProps) {
  return (
    <Card className="border-gray-700 bg-card">
      <CardHeader className="pb-4">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex min-h-[190px] w-full flex-1 flex-col items-center justify-center px-8 pb-8 ">
        <div className="relative mt-4 flex h-full w-full flex-col items-center justify-center">
          <div className="absolute left-1/2 top-1/2 h-[178px] w-[178px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5" />
          <div className="absolute left-1/2 top-1/2 h-[90px] w-[120px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-[#5A5D6C] opacity-80 shadow-lg" />
          <img
            src={imageSrc}
            alt="empty box"
            className="relative z-10 h-[60px] w-[60px] object-contain"
            style={{ filter: 'grayscale(1) brightness(0.95) drop-shadow(0 2px 8px rgba(0,0,0,0.10))' }}
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-center justify-center gap-2 pb-8">
        <div className="text-center text-[16px] font-medium leading-[1.21] text-white">{mainText}</div>
        <div className="w-[200px] text-center text-[14px] font-normal leading-[1.21] text-[#757B8C]">{subText}</div>
      </CardFooter>
    </Card>
  )
}
