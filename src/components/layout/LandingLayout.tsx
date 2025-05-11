import { PropsWithChildren } from 'react'
import { Link } from 'react-router-dom'
import { getNavItems } from '@/constants/data'
import { InteractiveHoverButton } from '../ui/interactive-hover-button'
import { Github, MessageCircle, Twitter } from 'lucide-react'
import { motion } from 'framer-motion'

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
      {/* Navigation */}
      <nav className="fixed left-0 right-0 top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-6">
              <Link to="/" className="group flex items-center gap-2">
                <img src="/logo.svg" alt="According.work" className="h-8" />
                <span className="font-outfit text-lg font-light tracking-wide">According.work</span>
              </Link>
            </div>
            <Link to={getNavItems().find((item) => item.title === 'Login')!.href}>
              <InteractiveHoverButton>Go to dashboard</InteractiveHoverButton>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-16">{children}</main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/30 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="flex flex-col items-center justify-between">
              <div className="mb-8 flex items-center gap-2 md:mb-0">
                <img src="/logo.svg" alt="According.work" className="h-8" />
                <span className="font-outfit text-lg font-light tracking-wide">According.work</span>
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
              <span> © 2025 According.work. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingLayout
