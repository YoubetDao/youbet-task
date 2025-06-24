import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import ProfileBannerBackground from '@/components/banner/background'
import { ProfileMainInfo, ProfileStats } from './info'

export default function ProfileBanner() {
  return (
    <div className="relative w-full">
      <div className="relative h-[138px] opacity-90">
        <ProfileBannerBackground />
      </div>
      <div className="flex h-[146px] w-full max-w-full items-center border-b border-muted px-10">
        <div className="ml-[60px] mt-[-94px] flex-shrink-0">
          <Avatar className="h-[187px] w-[187px] border-4 border-background">
            <AvatarImage src="/placeholder.svg?height=128&width=128" alt="Moyo-Made" />
            <AvatarFallback>Dylan</AvatarFallback>
          </Avatar>
        </div>
        <div className="ml-[48px] flex flex-1 flex-col justify-center">
          <ProfileMainInfo />
        </div>
        <div className="ml-[48px] flex-shrink-0">
          <ProfileStats />
        </div>
      </div>
    </div>
  )
}
