import { PropsWithChildren } from 'react'
import { Github, MessageCircle, Twitter } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { InteractiveHoverButton } from '../ui/interactive-hover-button'
import { getNavItems } from '@/constants/data'

const socialLinks = [
  {
    name: 'Twitter',
    url: 'https://x.com/youbetdao',
    icon: Twitter,
  },
  {
    name: 'Telegram',
    url: 'https://t.me/+_a-io1KqMIc5ZjQ9',
    icon: MessageCircle,
  },
  {
    name: 'GitHub',
    url: 'https://github.com/YoubetDao/',
    icon: Github,
  },
]

const LandingLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex min-h-screen flex-col">
      <header
        className="max-w-lg:mr-auto fixed top-4 z-20 flex h-[60px] w-full max-w-[100vw] justify-between rounded-md bg-white px-[3%] 
                    text-gray-700 shadow-md dark:bg-[#17181b] dark:text-gray-200 dark:shadow-gray-700 max-lg:top-0 lg:left-1/2 lg:max-w-5xl lg:-translate-x-1/2
                    lg:px-4 lg:opacity-[0.99] lg:!backdrop-blur-lg"
      >
        <div className="flex items-center space-x-6">
          <Link to="/" className="group flex items-center gap-2">
            <img src="/logo.svg" alt="According.Work" className="h-8" />
            <span className="font-outfit text-lg font-light tracking-wide">According.Work</span>
          </Link>
        </div>
        <Link className="flex items-center" to={getNavItems().find((item) => item.title === 'Login')!.href}>
          <InteractiveHoverButton>Go to app</InteractiveHoverButton>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-16">{children}</main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/30 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="flex flex-col items-center justify-between">
              <div className="mb-8 flex items-center gap-2 md:mb-0">
                <img src="/logo.svg" alt="According.Work" className="h-8" />
                <span className="font-outfit text-lg font-light tracking-wide">According.Work</span>
              </div>

              <div className="flex items-center gap-2">
                {socialLinks.map((link) => {
                  const Icon = link.icon
                  return (
                    <motion.a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-white/5 p-3 transition-colors hover:bg-white/10"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon className="h-6 w-6" />
                    </motion.a>
                  )
                })}
              </div>
            </div>

            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#" className="transition-colors hover:text-white">
                Terms
              </a>
              <a href="#" className="transition-colors hover:text-white">
                Privacy
              </a>
              <span> © 2025 According.Work. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingLayout
