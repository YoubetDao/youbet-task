import { Button } from '@/components/ui/button'
import { Github, Mail } from 'lucide-react'

export function ProfileMainInfo() {
  return (
    <div>
      <h2 className="font-inter mb-2 align-middle text-[18px] font-semibold leading-[100%] tracking-normal text-white">
        Dylan
      </h2>
      <p className="font-inter mb-4 max-w-md align-middle text-[18px] text-sm font-semibold leading-[100%] tracking-normal text-muted-foreground">
        Remote developer which work for the new...
      </p>
      <div className="flex gap-4">
        <Button
          variant="outline"
          size="sm"
          className="font-inter border-gray-600 bg-gray-700 align-middle text-[12px] font-normal leading-[100%] tracking-normal text-white hover:bg-gray-600"
        >
          <Github className="mr-2 h-4 w-4" />
          DylanGuo916
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="font-inter border-gray-600 bg-gray-700 align-middle text-[12px] font-normal leading-[100%] tracking-normal text-white hover:bg-gray-600"
        >
          <Mail className="mr-2 h-4 w-4" />
          dylanguo916@email.com
        </Button>
      </div>
    </div>
  )
}

export function ProfileStats() {
  return (
    <div className="flex gap-8 text-center">
      <div>
        <p className="font-inter align-middle text-2xl text-[18px] font-bold font-semibold leading-[100%] tracking-normal text-white">
          89
        </p>
        <p className="font-inter align-middle text-[18px] text-xs font-semibold leading-[100%] tracking-normal text-muted-foreground">
          Projects
        </p>
      </div>
      <div>
        <p className="font-inter align-middle text-2xl text-[18px] font-bold font-semibold leading-[100%] tracking-normal text-white">
          66
        </p>
        <p className="font-inter align-middle text-[18px] text-xs font-semibold leading-[100%] tracking-normal text-muted-foreground">
          Followers
        </p>
      </div>
      <div>
        <p className="font-inter align-middle text-2xl text-[18px] font-bold font-semibold leading-[100%] tracking-normal text-white">
          21
        </p>
        <p className="font-inter align-middle text-[18px] text-xs font-semibold leading-[100%] tracking-normal text-muted-foreground">
          Following
        </p>
      </div>
    </div>
  )
}
