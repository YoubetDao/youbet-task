import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Github, Mail, Edit, Share2 } from 'lucide-react'

type Profile = {
  avatarUrl?: string
  displayName?: string
  username?: string
  bio?: string
  github?: string
  email?: string
  projects?: number
  followers?: number
  following?: number
}

export default function ProfileBanner({ profile }: { profile: Profile }) {
  console.log(profile)
  return (
    <div className="relative mb-4 border-b">
      <div className="bg-profile-banner h-[138px] rounded-t-lg bg-[#C767C6]" />
      <div className="absolute left-10 top-24 flex h-[146px] items-end gap-6">
        <Avatar className="h-[187px] w-[187px] border-4 border-background">
          <AvatarImage src={profile?.avatarUrl} alt="Avatar" />
          <AvatarFallback>{profile?.username?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-3xl font-bold text-white">{profile?.displayName || profile?.username}</h2>
          <p className="max-w-md text-sm text-muted-foreground">{profile?.bio || 'No bio...'}</p>
          <div className="mt-2 flex gap-2">
            <Button variant="outline" size="sm" className="border-gray-600 bg-gray-700 text-white hover:bg-gray-600">
              <Github className="mr-2 h-4 w-4" />
              {profile?.username}
            </Button>
            <Button variant="outline" size="sm" className="border-gray-600 bg-gray-700 text-white hover:bg-gray-600">
              <Mail className="mr-2 h-4 w-4" />
              {profile?.email}
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-12 flex items-center justify-end px-10 pb-4 pt-4">
        <div className="flex gap-8 text-center">
          <div>
            <p className="text-2xl font-bold text-white">{profile?.projects || 100}</p>
            <p className="text-xs text-muted-foreground">Projects</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{profile?.followers}</p>
            <p className="text-xs text-muted-foreground">Followers</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{profile?.following}</p>
            <p className="text-xs text-muted-foreground">Following</p>
          </div>
        </div>
      </div>
      <div className="absolute right-6 top-6 flex gap-2">
        <Button variant="outline" size="sm" className="border-gray-600 bg-gray-700 text-white hover:bg-gray-600">
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
        <Button variant="outline" size="sm" className="border-gray-600 bg-gray-700 text-white hover:bg-gray-600">
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </div>
    </div>
  )
}
