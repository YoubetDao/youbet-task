import { Link } from 'react-router-dom'
import { BRAND_NAME, BRAND_LOGO } from '@/lib/config'

export default function Title() {
  return (
    <Link to="/" className="flex items-center gap-2 font-semibold">
      {/* <Package2 className="w-6 h-6" /> */}
      <img src={BRAND_LOGO} alt="logo" className="w-6 h-6 rounded-md" />
      <span className="">{BRAND_NAME}</span>
    </Link>
  )
}
