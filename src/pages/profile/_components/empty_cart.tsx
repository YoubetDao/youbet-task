import empty_cart from '@/assets/images/empty_cart.png'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'

type EmptyCartProps = {
  title: string
  description?: string
}

export default function EmptyCart({ title, description }: EmptyCartProps) {
  return (
    <Card className="border-gray-700 bg-card">
      <CardHeader className="pb-4">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex min-h-[190px] w-full flex-1 flex-col items-center justify-center px-8  pb-8 ">
        <div className="relative mt-4 flex h-full w-full flex-col items-center justify-center">
          <div className="absolute left-1/2 top-1/2 h-[178px] w-[178px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5" />
          <img
            src={empty_cart}
            alt="empty box"
            className="relative z-10 h-[95px] w-[100px] object-contain opacity-60"
            style={{ filter: 'grayscale(1) brightness(0.8) drop-shadow(0 2px 8px rgba(0,0,0,0.10))' }}
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-center justify-center gap-2 pb-8">
        <div className="text-center text-[16px] font-medium leading-[1.21] text-white">Cart is Empty</div>
        <div className="w-[200px] text-center text-[14px] font-normal leading-[1.21] text-[#757B8C]">
          Please scan for display
        </div>
      </CardFooter>
    </Card>
  )
}
