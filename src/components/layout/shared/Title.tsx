import { Link } from 'react-router-dom'
import { BRAND_NAME, BRAND_LOGO } from '@/lib/config'

export default function Title() {
  return (
    <Link to="/dashboard" className="flex items-center gap-2 font-semibold">
      {/* <Package2 className="w-6 h-6" /> */}
      <img src={BRAND_LOGO} alt="logo" className="h-8 w-8 rounded-md" />
      <span className="font-american-captain translate-y-[3px] text-2xl leading-none">{BRAND_NAME}</span>
    </Link>
  )
}
