import ProfileBanner from '@/components/banner/banner'

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="flex-1 space-y-6 p-6">
        <ProfileBanner />
      </div>
    </div>
  )
}
