import { Link } from 'react-router-dom'

export default function Title() {
  return (
    <Link to="/" className="flex items-center gap-2 font-semibold">
      {/* <Package2 className="w-6 h-6" /> */}
      <img src="/logo.png" alt="logo" className="w-6 h-6 rounded-md" />
      <span className="">YouBet Task</span>
    </Link>
  )
}
